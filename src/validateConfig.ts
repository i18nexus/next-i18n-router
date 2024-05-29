import { Config } from './types';

function validateConfig(config: Config): void {
  if (!Array.isArray(config.locales)) {
    throw new Error(`The config requires a 'locales' array.`);
  }

  if (!config.defaultLocale) {
    throw new Error(`The config requires a 'defaultLocale'.`);
  }

  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error(
      `The 'defaultLocale' must be contained in 'locales' array.`
    );
  }

  if (config.localeDetector && typeof config.localeDetector !== 'function') {
    throw new Error(`'localeDetector' must be a function.`);
  }

  if (config.cookieOptions) {
    if (typeof config.cookieOptions !== 'object') {
      throw new Error(`'cookieOptions' must be an object.`);
    }
  }

  if (config.serverSetCookie) {
    const validOptions = ['if-empty', 'always', 'never'];
    if (!validOptions.includes(config.serverSetCookie)) {
      throw new Error(
        `Invalid 'serverSetCookie' value. Valid values are ${validOptions.join(
          ' | '
        )}`
      );
    }
  }
}

export default validateConfig;
