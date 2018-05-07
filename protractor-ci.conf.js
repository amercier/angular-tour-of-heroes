const defaultConfig = require('./protractor.conf').config;

exports.config = Object.assign({}, defaultConfig, {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=1024x768', '--no-sandbox']
    }
  }
});
