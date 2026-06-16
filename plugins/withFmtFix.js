const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Xcode 26 / Clang 17+ is stricter about consteval. The fmt version bundled
// with Folly in RN 0.76 defines FMT_CONSTEVAL=consteval directly (no
// FMT_USE_CONSTEVAL guard), so overriding FMT_USE_CONSTEVAL=0 has no effect.
// Fix: override FMT_CONSTEVAL itself to constexpr, which allows the function
// to be called in both constant and non-constant contexts.
// We patch xcconfig files via filesystem glob (more reliable than
// base_configuration_reference which may return nil for some targets).
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('FMT_CONSTEVAL_FIX')) {
        const fmtPatch = `
  # FMT_CONSTEVAL_FIX: override FMT_CONSTEVAL to constexpr for Xcode 26 / Clang 17+
  # Folly's fmt declares basic_format_string's ctor as FMT_CONSTEVAL (=consteval).
  # Clang 17+ errors when consteval functions are called in non-constant contexts.
  # Setting FMT_CONSTEVAL=constexpr removes the restriction without breaking fmt.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_CONSTEVAL=constexpr -DFMT_USE_CONSTEVAL=0'
      build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = '$(inherited) FMT_USE_CONSTEVAL=0'
    end
  end
  # Also patch the xcconfig files directly — xcconfigs override .xcodeproj build settings.
  pods_root = installer.sandbox.root.to_s
  Dir.glob(pods_root + '/Target Support Files/**/*.xcconfig') do |xcconfig_path|
    content = File.read(xcconfig_path)
    unless content.include?('FMT_CONSTEVAL_FIX')
      File.open(xcconfig_path, 'a') do |f|
        f.puts '# FMT_CONSTEVAL_FIX'
        f.puts 'OTHER_CPLUSPLUSFLAGS = $(inherited) -DFMT_CONSTEVAL=constexpr -DFMT_USE_CONSTEVAL=0'
        f.puts 'GCC_PREPROCESSOR_DEFINITIONS = $(inherited) FMT_USE_CONSTEVAL=0'
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
