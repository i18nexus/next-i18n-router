# React Intl with next-i18n-router

A working Next.js 16.3+ App Router example with English, German, and Japanese. It uses the published `next-i18n-router` package.

## Run

Use Node.js 22 LTS (22.13 or later) or Node.js 24 LTS. From this directory:

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use the language selector to switch languages, and follow the link to the About page. English uses `/`, German uses `/de`, and Japanese uses `/ja`. The proxy also detects the browser's language and remembers language selections in a cookie. The language selector uses a full page navigation so the proxy runs even when the destination was prefetched.

## How the locale reaches your components

- `proxy.ts` uses `i18nRouter` to detect the locale and route the request.
- `app/[locale]/layout.tsx` is the root layout. Do not add an `app/layout.tsx` above it.
- `app/locale.ts` reads and validates `locale()` from `next/root-params`.
- `app/[locale]/intl.ts` reads the locale itself when loading translations. Pages and nested Server Components call the helper without passing locale props. `components/ExampleServerComponent.tsx` demonstrates this.
- Client Components receive translations through the library's provider. They do not import the server translation helper or `next/root-params`.
- `generateStaticParams` prerenders every configured locale. Links include the appropriate locale so navigation stays in the selected language.

The JSON files are sample translation data. In an i18nexus project, manage source strings in i18nexus and use the CLI to sync generated JSON.

Root params are available by default in Next.js 16.3+. They are not available in Route Handlers or Server Actions; pass the locale explicitly to translation helpers used from those entry points. For older Next.js apps, read `params` in pages and layouts and pass the locale to child Server Components.

See the [Next.js root-params documentation](https://nextjs.org/docs/app/api-reference/functions/next-root-params).

## Verify

```sh
npm run lint
npm run build
npm run test:routing
```

The routing checks build isolated copies of this example and make production HTTP requests. They verify all three languages, translated server and client content, locale-aware links, locale cookies, hidden prefixes, and Cache Components. They leave your app configuration and normal `.next` build untouched.
