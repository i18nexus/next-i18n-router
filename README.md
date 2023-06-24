# next-i18n-router

**Adds internationalized routing for Next.js apps that use the App Router**

## App Router internationalized routing 🎉

### Why is this library needed?

With the release of the App Router, internationalized routing has been removed as a built-in Next.js feature. This library adds back internationalized routing in addition to locale detection and optional cookie usage to set a user's current language.

Unlike other implementations, this library does **not** require you to wrap all your pages in a `[lang]` path segment. The default language can be accessed from the base path without a language prefix.

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

Create a `middleware.js` file at the root of your project where the `i18nRouter` will be used to provide internationalized redirects:

```js
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';

export function middleware(request) {
  return i18nRouter(request, i18nConfig);
}

// only apply this middleware to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};
```

Update your `next.config.json` to call `i18nRewriter` in the `rewrites` async function:

```js
const { i18nRewriter } = require('next-i18n-router');
const i18nConfig = require('./i18nConfig');

const nextConfig = {
  async rewrites() {
    return {
      afterFiles: i18nRewriter(i18nConfig)
    };
  }
};

module.exports = nextConfig;
```

You now have internationalized routing!

## Config Options

| Option           | Default value   | Type              | Required? |
| ---------------- | --------------- | ----------------- | --------- |
| `locales`        |                 | string[]          | &#10004;  |
| `defaultLocale`  |                 | string            | &#10004;  |
| `localeDetector` | (See below)     | function \| false |           |
| `localeCookie`   | `'NEXT_LOCALE'` | string            |           |
| `prefixDefault`  | `false`         | boolean           |           |

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

You can also set `localeDetector` option to `false` if you wish to opt out of any locale detection.

### Locale Cookie (optional)

You can also override the `localeDetector` using the `NEXT_LOCALE=the-locale` cookie. For example, you can set this cookie when a user opts to change to a different language. When they return to your site, their preferred language will already be set.

If you would prefer to use a different cookie key other than `NEXT_LOCALE`, you can set the `localeCookie` option.

## Locale Path Prefixing

By default, the `defaultLocale` uses the base path without a prefix. For example, if `defaultLocale` is set to `en` and `locales` is set to `['en', 'de']`, the paths will appear as follows:

**English**: `/products`

**German**: `/de/products`

To include your default language in the path, set the `prefixDefault` config option to `false`.

# With react-intl

```sh
npm install react-intl
```

One of the most popular Javascript i18n libraries is `react-intl`. The `react-intl` library works great for Client Components, but with the App Router we'll have to make a minor change for usage with Server Components.

We just need to create 2 helper files:

### app/intl.js

Create a `useIntl` function to be used in Server Components. We will use the base `intl` library that is bundled with `react-intl`:

```js
'server-only';

import { createIntl } from '@formatjs/intl';
import { headers } from 'next/headers';

const getMessages = async lang => {
  return (await import(`./messages/${lang}.json`)).default;
};

export default async function useIntl() {
  // get current lang from header set by next-i18n-router
  const lang = headers().get('x-next-i18n-router-locale');

  return createIntl({
    locale: lang,
    messages: await getMessages(lang)
  });
}
```

### components/ServerIntlProvider.js

Second, create a helper provider to use when nesting a Client Component in a Server Component.

```js
'use client';

import { IntlProvider } from 'react-intl';

export default async function ServerIntlProvider({ intl, children }) {
  return <IntlProvider {...intl}>{children}</IntlProvider>;
}
```

## Example react-intl usage:

**app/page.js**

```js
import useIntl from 'app/intl';
import ServerIntlProvider from 'components/ServerIntlProvider';
import AClientComponent from 'components/AClientComponent';

async function Home() {
  const intl = await useIntl();

  return (
    <main>
      <h1>{intl.formatMessage({ id: 'header' })}</h1>
      <ServerIntlProvider
        intl={{ messages: intl.messages, locale: intl.locale }}>
        <AClientComponent />
      </ServerIntlProvider>
    </main>
  );
}

export default Home;
```

**Reminder:** We only need to wrap **top level Client Components** with our `ServerIntlProvider`. We can then nest as many client components as we need without having to use the provider again.

**components/AClientComponent.js**

```js
'use client';

import { FormattedMessage } from 'react-intl';

export default async function AClientComponent({ intl }) {
  return (
    <h3>
      <FormattedMessage id="greeting" />
    </h3>
  );
}
```

That's it!

You can read more in the [intl](https://formatjs.io/docs/intl) docs and the [react-intl](https://formatjs.io/docs/react-intl) docs.
