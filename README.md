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

| Option            | Default value   | Type                          | Required? |
| ----------------- | --------------- | ----------------------------- | --------- |
| `locales`         |                 | string[]                      | &#10004;  |
| `defaultLocale`   |                 | string                        | &#10004;  |
| `prefixDefault`   | `false`         | boolean                       |           |
| `localeDetector`  | (See below)     | function \| false             |           |
| `localeCookie`    | `'NEXT_LOCALE'` | string                        |           |
| `routingStrategy` | 'rewrite'       | 'rewrite' \| 'dynamicSegment' |           |
| `basePath`        | `''`            | string                        |           |

## Locale Path Prefixing

By default, the `defaultLocale`'s path is not prefixed with the locale. For example, if `defaultLocale` is set to `en` and `locales` is set to `['en', 'de']`, the paths will appear as follows:

**English**: `/products`

**German**: `/de/products`

To include your default language in the path, set the `prefixDefault` config option to `true`.

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

## Choosing the `routingStrategy` (optional)

By default, this library uses rewrites to add the current locale to the pathname. This is a convenient developer experience, but it means that you cannot run `generateStaticParams` to generate pages for all languages at build time.

To do this, you can set `routingStrategy` to `'dynamicSegment'`. This strategy requires you to add a dynamic segment folder to wrap all pages and layouts in your `app` directory:

```
├── middleware.js
└── app
    └── [locale]
        ├── layout.js
        └── page.js
```

This example is using `[locale]` as the dynamic segment, but it can be named whatever you want.

This strategy enables you to use `generateStaticParams` for all locales in `layout.js`:

```js
...
import i18nConfig from '@/i18nConfig';

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}
...
```

That's it! Everything else works the same.

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

#### If routingStrategy: "rewrite":

The current locale can be retrieved in a Server Component using `currentLocale`. This function reads the current locale from a response header set by the middleware.

```js
import { currentLocale } from 'next-i18n-router';

function ExampleServerComponent() {
  const locale = currentLocale();

  ...
}
```

#### If routingStrategy: "dynamicSegment":

Since Next.js does not allow SSG on pages that access response headers, you should read the current locale from the component's `params` props. Using `currentLocale` will prevent SSG.

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

You can also find an example project [here](https://github.com/i18nexus/next-i18n-router/tree/main/examples).
