#!/usr/bin/env node
/**
 * Patches node_modules Swift files that fail to compile with Xcode 26.
 *
 * Xcode 26 / iOS 26 SDK adds new cases to several Foundation/UIKit enums.
 * Any exhaustive switch that doesn't handle the new cases gets a compile error.
 * This script adds @unknown default guards to the affected switches.
 *
 * Run automatically via "postinstall" in package.json.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function patch(filePath, transform) {
  const abs = path.join(root, filePath);
  if (!fs.existsSync(abs)) {
    console.log(`[fix-ios26] skip (not found): ${filePath}`);
    return;
  }
  const original = fs.readFileSync(abs, 'utf8');
  const patched = transform(original);
  if (patched === original) {
    console.log(`[fix-ios26] already patched: ${filePath}`);
    return;
  }
  fs.writeFileSync(abs, patched);
  console.log(`[fix-ios26] patched: ${filePath}`);
}

// expo-localization: Calendar.Identifier switch — iOS 26 adds new calendar types
// (e.g. .dangi) that make the switch non-exhaustive.
patch(
  'node_modules/expo-localization/ios/LocalizationModule.swift',
  (src) => {
    if (src.includes('@unknown default')) return src;
    // Insert @unknown default before the closing } of getUnicodeCalendarIdentifier
    return src.replace(
      /(\s+case \.iso8601:\s+return "iso8601"\s+)(})/,
      '$1@unknown default:\n      return "gregory"\n    $2'
    );
  }
);

console.log('[fix-ios26] done.');
