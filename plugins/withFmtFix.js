const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Xcode 26 ships Clang 17+ which is stricter about consteval.
// Folly's bundled fmt library triggers "call to consteval function is not a constant expression".
// Setting FMT_USE_CONSTEVAL=0 disables the consteval path and fixes the build.
// We inject into the existing post_install block rather than adding a new one —
// CocoaPods only runs the last post_install block, so a new one would shadow React Native's.
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('FMT_USE_CONSTEVAL')) {
        const fmtPatch = [
          '  # Fix: Xcode 26 / Clang 17 consteval strictness breaks Folly fmt',
          '  installer.pods_project.targets.each do |target|',
          '    target.build_configurations.each do |build_config|',
          "      build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'",
          '    end',
          '  end',
        ].join('\n');

        // Inject after __apply_Xcode_12_5_M1_post_install_workaround which is always
        // the last statement inside Expo's generated post_install block.
        const anchor = '__apply_Xcode_12_5_M1_post_install_workaround(installer)';
        if (podfile.includes(anchor)) {
          podfile = podfile.replace(anchor, anchor + '\n' + fmtPatch);
        } else {
          // Fallback for Podfiles without that workaround line: find the first
          // post_install block's opening and insert right after it.
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
