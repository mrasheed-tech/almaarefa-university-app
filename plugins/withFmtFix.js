const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Xcode 26 ships Clang 17+ which is stricter about consteval.
// Folly's bundled fmt library triggers "call to consteval function is not a constant expression".
// Setting FMT_USE_CONSTEVAL=0 disables the consteval path and fixes the build.
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('FMT_USE_CONSTEVAL')) {
        podfile += `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      flags = config.build_settings['OTHER_CPLUSPLUSFLAGS'] || '$(inherited)'
      config.build_settings['OTHER_CPLUSPLUSFLAGS'] = flags + ' -DFMT_USE_CONSTEVAL=0'
    end
  end
end
`;
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
