const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Xcode 26 / Clang 17+ is stricter about consteval. Folly's bundled fmt
// triggers "call to consteval function is not a constant expression".
//
// Root cause: CocoaPods xcconfig files override .xcodeproj build settings,
// so patching build_settings in post_install alone isn't enough — we must
// also append the flag to each pod's xcconfig file.
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('FMT_USE_CONSTEVAL')) {
        const fmtPatch = `
  # Fix: Xcode 26 / Clang 17 consteval strictness breaks Folly fmt.
  # Patch both .xcodeproj build settings AND xcconfig files, because
  # xcconfig files take precedence over build settings in CocoaPods projects.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
      build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = '$(inherited) FMT_USE_CONSTEVAL=0'
      xcconfig_path = build_config.base_configuration_reference&.real_path
      if xcconfig_path && File.exist?(xcconfig_path.to_s)
        xcconfig = File.read(xcconfig_path.to_s)
        unless xcconfig.include?('FMT_USE_CONSTEVAL')
          File.open(xcconfig_path.to_s, 'a') do |f|
            f.puts 'OTHER_CPLUSPLUSFLAGS = $(inherited) -DFMT_USE_CONSTEVAL=0'
            f.puts 'GCC_PREPROCESSOR_DEFINITIONS = $(inherited) FMT_USE_CONSTEVAL=0'
          end
        end
      end
    end
  end`;

        const anchor = '__apply_Xcode_12_5_M1_post_install_workaround(installer)';
        if (podfile.includes(anchor)) {
          podfile = podfile.replace(anchor, anchor + '\n' + fmtPatch);
        } else {
          podfile = podfile.replace(
            'post_install do |installer|',
            'post_install do |installer|\n' + fmtPatch
          );
        }

        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
