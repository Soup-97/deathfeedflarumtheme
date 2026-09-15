// flarum-webpack-config's entry-point resolution (node_modules/flarum-webpack-config/src/index.cjs)
// looks for a literal forum.js/forum.ts here in the webpack working directory -- it can't be
// forum.tsx itself since a .ts file can't contain JSX, so this just re-exports the real
// entry point, which webpack resolves via its normal extension list (.tsx included).
import './src/forum';
