function validateConfig(config) {
  if (!Array.isArray(config.locales)) {
    throw new Error(`initialize requires a 'locales' array as an argument.`);
  }

  if (!config.defaultLocale) {
    throw new Error(`initialize requires a 'defaultLocale' as an argument.`);
  }

  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error(`The 'defaultLocale' must be contained in 'locales' array`);
  }

  if (config.getLocale && typeof config.getLocale !== 'function') {
    throw new Error(`'getLocale' must be a function`);
  }
}

module.exports = validateConfig;
