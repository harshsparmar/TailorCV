const { join } = require('path');

/**
 * Puts the Chrome cache inside the project directory so Render copies it
 * from the build container to the runtime container.
 * The default ~/.cache/puppeteer path lives outside the project and is lost.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
