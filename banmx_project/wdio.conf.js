exports.config = {
  runner: 'local',
  port: 4723,
  specs: ['./tests/**/*.test.js'],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Android Emulator',
    'appium:platformVersion': '11.0', // versión de tu emulador
    'appium:automationName': 'UiAutomator2',
    'appium:app': '/ruta/a/tu/app-release.apk',
  }],
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
};
