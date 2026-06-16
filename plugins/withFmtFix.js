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
      // Patch expo-localization Swift file: add @unknown default to Calendar.Identifier switch.
      // Xcode 26 added new Calendar.Identifier cases that make this switch non-exhaustive.
      const localizationSwiftPath = path.join(
        config.modRequest.projectRoot,
        'node_modules/expo-localization/ios/LocalizationModule.swift'
      );
      if (fs.existsSync(localizationSwiftPath)) {
        let swift = fs.readFileSync(localizationSwiftPath, 'utf8');
        const oldCase = '    case .iso8601:\n      return "iso8601"\n    }';
        const newCase = '    case .iso8601:\n      return "iso8601"\n    @unknown default:\n      return "gregory"\n    }';
        if (!swift.includes('@unknown default') && swift.includes(oldCase)) {
          swift = swift.replace(oldCase, newCase);
          fs.writeFileSync(localizationSwiftPath, swift);
        }
      }

      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('FMT_CONSTEVAL_FIX')) {
        const fmtPatch = `
  # FMT_CONSTEVAL_FIX: replace consteval with constexpr in RCT-Folly and fmt pods.
  # Xcode 26 / Clang 17+ errors on consteval calls in non-constant contexts.
  # Scoped to just these two pods to avoid touching hermes or other native code.
  pods_root = installer.sandbox.root.to_s
  ['RCT-Folly', 'fmt'].each do |pod_name|
    Dir.glob(pods_root + '/' + pod_name + '/**/*.{h,hpp,cpp,cc,cxx,c}') do |file_path|
      begin
        content = File.read(file_path)
        if content.include?('consteval')
          File.write(file_path, content.gsub(/\\bconsteval\\b/, 'constexpr'))
        end
      rescue
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
