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
  # FMT_CONSTEVAL_FIX: patch fmt source headers for Xcode 26 / Clang 17+ compatibility.
  # The fmt version in Folly redefines FMT_CONSTEVAL unconditionally (no #ifndef guard),
  # so -D compiler flags are overridden. We must patch the source directly.
  pods_root = installer.sandbox.root.to_s
  Dir.glob(pods_root + '/**/*.{h,hpp}') do |header_path|
    begin
      content = File.read(header_path)
      if content.include?('define FMT_CONSTEVAL consteval')
        patched = content.gsub(
          /^(\s*#\s*define\s+FMT_CONSTEVAL\s+)consteval(\s*)$/,
          '\\1constexpr\\2'
        )
        File.write(header_path, patched) if patched != content
      end
    rescue
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
