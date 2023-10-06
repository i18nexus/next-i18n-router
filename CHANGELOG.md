## 4.1.2

- Fix bug in `localeDetector` when no accept-language header present on request (https://stackoverflow.com/questions/76447732/nextjs-13-i18n-incorrect-locale-information-provided)

## 4.1.1

- Minor updates to README adding instructions for setup with i18next.

## 4.1.0

- Fix bug in which rewrites did not have an opening `/`, causing pathnames with more than 2 segments to return 404's

## 4.0.0

- Adds new option named `routingStrategy` that can be set to `"rewrite"` (default) or `"dynamicSegment"`.
  - The `"rewrite"` strategy is the same functionality as v3.
  - The `"dynamicSegment"` strategy allows for using the current locale as a dynamic segment, enabling usage of `generateStaticParams` for static generation of all languages at build time.

### Breaking Changes

- `i18nRewriter` has been removed as it is no longer needed. 🎉
- `i18nRouter` no longer accepts an existing response as a third argument.

## 3.3.0

TypeScript optimization:

- Return `undefined` instead of `null` in `useCurrentLocale` hook
- Return `undefined` instead of `null` in `currentLocale` helper

## 3.2.0

- Update: Adds optional third argument of type `NextResponse` to `i18nRouter` to allow for developers to use a previously generated response (#8)
- Fix: The original request's search parameters are now persisted when redirecting to another language (#13)

## 3.1.0

- Adds `basePath` config option to support using the Next config `basePath`
- Adds the `currentLocale` helper function for retrieving the current language in Server Components
- Adds the `useCurrentLocale` hook for retrieving the current language in Client Components

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
