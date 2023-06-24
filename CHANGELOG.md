## 3.0.0

- Pathname language prefix for the default language no longer required
- Remove need for `[lang]` dynamic segment by introducing the `i18nRewriter`
- `getLocale` option replaced with `localeDetector`
- Cookie detection now independent of `localeDetector` detection
- Add config option for `prefixDefault`

### Breaking changes

- `i18nRouter` is no longer a default import

```js
// v2.0.0
import i18nRouter from 'next-i18n-router';

// v3.0.0
import { i18nRouter } from 'next-i18n-router';
```

- `i18nRewriter` must be used to create language paths in `next.config.js`
- `getLocale` has been replaced with `localeDetector`
- To continue having the default language's pathname prefixed, the `prefixDefault` option should be set to `true`

## 2.0.0

- Library rewritten in Typescript
- Typings for the `i18nRouter` config now available

## 1.0.2

- Fix bug causing the locale cookie to not be read

## 1.0.1

- Add `repository` to `package.json`
- Minor README fixes

## 1.0.0

- Initial Release
