const { join } = require('path');

/**
 * Store Chrome inside node_modules so Render copies it from the build
 * container to the runtime container. Directories outside node_modules /
 * .next (e.g. .cache/) are NOT carried over between Render build & runtime.
 */
module.exports = {
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
