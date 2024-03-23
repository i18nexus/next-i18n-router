# next-i18n-router

**Adds internationalized routing for Next.js apps that use the App Router**

## App Router internationalized routing 🎉

### Why is this library needed?

With the release of the App Router, internationalized routing has been removed as a built-in Next.js feature. This library adds back internationalized routing in addition to locale detection and optional cookie usage to set a user's preferred language.

This library can be used with any of the popular Javascript i18n libraries such as `react-i18next` and `react-intl`. Tutorials and examples can be found [here](#usage-with-popular-i18n-libraries).

## Installation

```sh
npm install next-i18n-router
```

## Example Usage

First, nest all pages and layouts inside of a dynamic segment named `[locale]`:

```
└── app
    └── [locale]
        ├── layout.js
        └── page.js
```

Create a file called `i18nConfig.js` at the root of your project to store your config:

```js
const i18nConfig = {
  locales: ['en', 'de', 'ja'],
  defaultLocale: 'en'
};

module.exports = i18nConfig;
```

Create a `middleware.js` file at the root of your project (or in `/src` if using `/src` directory) where the `i18nRouter` will be used to provide internationalized redirects and rewrites:

```js
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';

export function middleware(request) {
  return i18nRouter(request, i18nConfig);
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};
```

You now have internationalized routing!

## Config Options

| Option            | Default value   | Type                              | Required? |
| ----------------- | --------------- | --------------------------------- | --------- |
| `locales`         |                 | string[]                          | &#10004;  |
| `defaultLocale`   |                 | string                            | &#10004;  |
| `prefixDefault`   | `false`         | boolean                           |           |
| `localeDetector`  | (See below)     | function \| false                 |           |
| `localeCookie`    | `'NEXT_LOCALE'` | string                            |           |
| `noPrefix`        | `false`         | boolean                           |           |
| `serverSetCookie` | `'always'`      | "always" \| "if-empty" \| "never" |           |
| `basePath`        | `''`            | string                            |           |

## Locale Path Prefixing

By default, the `defaultLocale`'s path is not prefixed with the locale. For example, if `defaultLocale` is set to `en` and `locales` is set to `['en', 'de']`, the paths will appear as follows:

**English**: `/products`

**German**: `/de/products`

To also include your default locale in the path, set the `prefixDefault` config option to `true`.

To hide all locales from the path, set the `noPrefix` config option to `true`.

## Locale Detection

By default, this library parses the request's `accept-language` header and determines which of your `locales` is preferred using `@formatjs/intl-localematcher`. This logic can be disabled or customized using the `localeDetector` config option (below).

Using the `accept-language` header is the recommended strategy outlined in the [Next.js docs](https://nextjs.org/docs/app/building-your-application/routing/internationalization) and is similar to the previous Pages Router implementation.

### Custom Locale Detection (optional)

If you would prefer to handle locale detection yourself, you can set the `localeDetector` option with your own locale detection function:

```js
const i18nConfig = {
  locales: ['en', 'de', 'ja'],
  defaultLocale: 'en',
  localeDetector: (request, config) => {
    // your custom locale detection logic
    return 'the-locale';
  }
};

module.exports = i18nConfig;
```

You can also set the `localeDetector` option to `false` if you wish to opt out of any locale detection.

### Locale Cookie (optional)

You can override the `localeDetector` using the `NEXT_LOCALE=the-locale` cookie. For example, you can set this cookie when a user opts to change to a different language. When they return to your site, their preferred language will already be set.

If you would prefer to use a different cookie key other than `NEXT_LOCALE`, you can set the `localeCookie` option.

### serverSetCookie (optional)

The `serverSetCookie` option automatically changes a visitor's preferred locale cookie by simply visiting a pathname that contains a locale.

`'always'`(default): When the pathname of a request includes a locale, that locale will be set as the cookie by the middleware. This means that locale detection and any existing locale cookie will be ignored if a locale exists in the request's pathname. Locale detection and the reading of any existing cookie will still be run on pathnames that do not include a locale.

`'if-empty'`: Same as `'always'`, except the middleware will not overwrite the cookie if one already exists.

`'never'`: The middleware will not automatically set the cookie.

If you are using `noPrefix`, the `serverSetCookie` option does not do anything since there is no locale in the pathname to read from. All language changing must be done by setting the cookie manually.

## Using `basePath` (optional)

This is only needed if you are using the `basePath` option in `next.config.js`. You will need to also include it as the `basePath` option in your `i18nConfig`.

As can be read about [here](https://github.com/vercel/next.js/issues/47085), you will also need to update your `matcher` in your middleware config to include `{ source: '/' }`:

```js
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)', { source: '/' }]
};
```

## Getting the current locale

### In a Client Component:

The current locale can be retrieved in a Client Component using the `useCurrentLocale` hook:

```js
'use client';

import { useCurrentLocale } from 'next-i18n-router/client';
import i18nConfig from '@/i18nConfig';

function ExampleClientComponent() {
  const locale = useCurrentLocale(i18nConfig);

  ...
}
```

### In a Server Component:

The current locale should be accessed from the component's `params` props:

```js
function ExampleServerComponent({ params: { locale } }) {
  ...
}
```

# Usage with popular i18n libraries

## react-i18next

The maintainers of `i18next` recommend using `react-i18next` with the App Router instead of `next-i18next`. The popular `next-i18next` library is built specifically for the Pages Router. This means that if you are currently migrating from the Pages Router and use `next-i18next`, you will need to refactor to use `react-i18next`.

For a full walkthrough on setting up `react-i18next` with `next-i18n-router` (plus Google Translate/DeepL integration), see [this tutorial](https://i18nexus.com/tutorials/nextjs/react-i18next).

You can also find an example project [here](https://github.com/i18nexus/next-i18n-router/tree/main/examples/i18next-example).

## react-intl

The `react-intl` library works great with the App Router. But it does require a litte extra configuration for usage in Server Components.

For a full walkthrough on using `react-intl` with `next-i18n-router` (plus Google Translate/DeepL integration), see [this tutorial](https://i18nexus.com/tutorials/nextjs/react-intl).

You can also find an example project [here](https://github.com/i18nexus/next-i18n-router/tree/main/examples/react-intl-example).
