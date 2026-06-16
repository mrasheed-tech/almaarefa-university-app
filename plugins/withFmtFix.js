const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Xcode 26 / Clang 17+ is stricter about consteval. Folly's bundled fmt
// triggers "call to consteval function is not a constant expression".
// Fix: disable the consteval path via FMT_USE_CONSTEVAL=0, set at both
// project and target level so no xcconfig can override it.
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('FMT_USE_CONSTEVAL')) {
        const fmtPatch = `
  # Fix: Xcode 26 / Clang 17 consteval strictness breaks Folly fmt
  installer.pods_project.build_configurations.each do |build_config|
    build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
    build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = '$(inherited) FMT_USE_CONSTEVAL=0'
  end
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'
      build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = '$(inherited) FMT_USE_CONSTEVAL=0'
    end
  end`;

        // Inject into the existing post_install block.
        // Try known Expo anchor first; fall back to inserting right after the opening line.
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
