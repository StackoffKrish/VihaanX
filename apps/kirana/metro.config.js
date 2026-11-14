const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// All three apps share one hoisted node_modules and, by default, one Metro
// transform cache ($TMPDIR/metro-cache). Metro keys cached files by their path
// relative to the project root, so hoisted files such as
// node_modules/expo-router/_ctx.web.js get the SAME key in every app, even
// though Expo inlines this app's route folder into them. Whichever app is
// bundled first would then "win": the other apps load its routes and its
// global.css, NativeWind does not recognise that file as its input, and the
// screens render with no Tailwind styles at all.
// A per-app cache version keeps each app's transform cache separate.
config.cacheVersion = require('./package.json').name;

module.exports = withNativeWind(config, { input: './global.css' });
