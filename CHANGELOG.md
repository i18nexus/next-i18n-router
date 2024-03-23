## 5.4.0

- Add config option `noPrefix` for hiding the locale prefix in the pathname.
- `useCurrentLocale` now checks the document cookie for the current locale prior to checking the pathname.

## 5.3.0

- Change default of `serverSetCookie` to `"always"`.
- Add `"never"` option to `serverSetCookie`. This is the same as `undefined` in previous versions.

## 5.2.1

- Update dependencies

## 5.2.0

- Change to cookie redirect behavior: When visiting a pathname that includes a locale, the middleware will now redirect if the `localeCookie` is set. Previously the redirecting based on cookie only occured on pathnames without a locale, but we've decided this is inconsistent behavior.
- Add `serverSetCookie` config option

## 5.1.0

Add forwarding of request headers in `i18nRouter`

## 5.0.2

Fixes RangeError thrown by `@formatjs/intl-localematcher` when an invalid accept-language header is present on request

## 5.0.1

Update examples to v5 and update changelog

## 5.0.0

To encourage best practices, we have removed the `'rewrite'` routing strategy and require use of a dynamic segment.

### Breaking Changes

If you are currently using `routingStrategy: 'dynamicSegment'`, no changes are required aside from removing the `routingStrategy` option from your config.

- `routingStrategy` config option removed
- Dynamic segment for the path locale now required
- Removed `currentLocale` helper function. This function used a header set in the middleware to get the current locale, but this was undependable due to middleware response caching. Reading headers in server components also disables use of SSG. To get the current locale in server components, you can now just use the page params.

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
