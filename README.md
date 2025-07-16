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

In your root layout, add a `notFound` redirect for any unsupported locales:

```js
...
import { notFound } from 'next/navigation';
...

export default function RootLayout({ children, params: { locale } }) {
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  return (
    ...
  );
}
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
| `cookieOptions`   | (See below)     | object                            |           |
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

### cookieOptions (optional)

The server sets the cookie by setting the `Set-Cookie` HTTP response header on the `NextResponse`. [(Learn More)](https://nextjs.org/docs/app/api-reference/functions/next-response#setname-value)

By default, `cookieOptions` is set to:

```
{
  sameSite: 'lax',
  maxAge: 31536000,
  path: {the basePath of the incoming NextRequest}
}
```

You can set your own `cookieOptions` object containing any of the valid `Set-Cookie` attributes: [MDN: Set-Cookie](https://nextjs.org/docs/app/api-reference/functions/next-response)

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

# FAQ

## How do I create a dropdown for a user to change the language?

In our [example projects](https://github.com/i18nexus/next-i18n-router/tree/main/examples) you will find a `LanguageChanger` component showing how to do this. Note that `router.refresh` is called after changing languages. This is because Next will not route the request through the middleware if the page happens to be cached on the client. `router.refresh` ensures the middleware is run on language change, allowing the locale cookie to be set properly.

## My not-found page is not working. What's wrong?

This is likely because of our use of the `[locale]` dynamic segment. This is not a bug with this library. It is a design choice of NextJS when using a not-found page in a dynamic segment. To solve this, we recommend making the adjustment described [here](https://github.com/i18nexus/next-i18n-router/issues/36#issuecomment-1821887026).
