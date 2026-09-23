import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { setTimeout } from 'node:timers/promises';

const example = process.cwd();
const require = createRequire(path.join(example, 'package.json'));
const next = require.resolve('next/dist/bin/next');
const isReactIntl = path.basename(example) === 'react-intl-example';
assert.ok(
  isReactIntl || path.basename(example) === 'i18next-example',
  'Run npm run test:routing from one of the example directories.'
);
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const translations = {};
for (const locale of ['en', 'de', 'ja']) {
  translations[locale] = isReactIntl
    ? await readJson(path.join(example, 'messages', `${locale}.json`))
    : {
        ...(await readJson(path.join(example, 'locales', locale, 'home.json'))),
        ...(await readJson(path.join(example, 'locales', locale, 'about.json')))
      };
}
const escapeHtml = value =>
  value.replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      })[character]
  );
const modes = [
  { name: 'hidden default locale', prefix: false, hidden: false, cache: false },
  { name: 'all locale prefixes', prefix: true, hidden: false, cache: false },
  { name: 'all locales hidden', prefix: false, hidden: true, cache: false },
  {
    name: 'hidden locales with Cache Components',
    prefix: false,
    hidden: true,
    cache: true
  }
];

async function availablePort() {
  const socket = createServer();
  socket.listen(0, 'localhost');
  await once(socket, 'listening');
  const { port } = socket.address();
  await new Promise(resolve => socket.close(resolve));
  return port;
}

// Build copies under the example so they can resolve its installed dependencies.
// The original source files and .next build are never modified by these checks.
const entries = await readdir(example);
const cwd = await mkdtemp(path.join(example, '.routing-check-'));
try {
  for (const entry of entries) {
    if (
      entry.startsWith('.') ||
      ['node_modules', 'next-env.d.ts'].includes(entry) ||
      entry.endsWith('.tsbuildinfo')
    )
      continue;
    await cp(path.join(example, entry), path.join(cwd, entry), {
      recursive: true
    });
  }
  const originalConfig = await readFile(
    path.join(cwd, 'i18nConfig.ts'),
    'utf8'
  );
  for (const mode of modes) {
    await writeFile(
      path.join(cwd, 'i18nConfig.ts'),
      originalConfig +
        `\ni18nConfig.prefixDefault = ${mode.prefix};\ni18nConfig.noPrefix = ${mode.hidden};\n`
    );
    await writeFile(
      path.join(cwd, 'next.config.js'),
      `module.exports = ${JSON.stringify({
        turbopack: { root: example },
        outputFileTracingRoot: example,
        cacheComponents: mode.cache
      })};\n`
    );
    console.log(`\nVerifying ${mode.name}`);
    const env = {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1'
    };
    const build = spawnSync(process.execPath, [next, 'build'], {
      cwd,
      env,
      stdio: 'inherit'
    });
    assert.equal(build.status, 0, 'Production build failed');

    const manifest = await readJson(
      path.join(cwd, '.next/prerender-manifest.json')
    );
    for (const locale of ['en', 'de', 'ja']) {
      for (const suffix of ['', '/about']) {
        assert.ok(
          manifest.routes[`/${locale}${suffix}`],
          `${locale}${suffix} must be prerendered`
        );
      }
    }

    const port = await availablePort();
    const base = `http://localhost:${port}`;
    const server = spawn(
      process.execPath,
      [next, 'start', '-p', String(port), '-H', 'localhost'],
      {
        cwd,
        env,
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );
    let logs = '';
    server.stdout.on('data', data => {
      logs += data;
    });
    server.stderr.on('data', data => {
      logs += data;
    });

    try {
      let ready = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        if (server.exitCode !== null)
          throw new Error(`Server stopped: ${logs}`);
        try {
          await fetch(base, {
            redirect: 'manual',
            signal: AbortSignal.timeout(1000)
          });
          ready = true;
          break;
        } catch {
          await setTimeout(100);
        }
      }
      assert.ok(ready, `Server did not start: ${logs}`);

      const request = (path, headers = {}) =>
        fetch(`${base}${path}`, {
          headers,
          redirect: 'manual',
          signal: AbortSignal.timeout(10000)
        });
      const expectLocale = async (path, locale, headers) => {
        const response = await request(path, headers);
        assert.equal(response.status, 200, `${path} should render ${locale}`);
        const html = await response.text();
        assert.ok(
          html.includes(`<html lang="${locale}"`),
          `html language must match ${locale}`
        );
        const messages = translations[locale];
        const isAbout = path.split('?')[0].endsWith('/about');
        const heading = isAbout ? messages.about_header : messages.header;
        assert.ok(
          html.includes(`<h1>${escapeHtml(heading)}</h1>`),
          'Server translation must match'
        );
        const clientText = isAbout ? messages.back : messages.greeting;
        assert.ok(
          html.includes(escapeHtml(clientText)),
          'Client translation must match'
        );
        assert.match(
          html,
          new RegExp(`<option value="${locale}" selected="">`),
          'Client language selector must match the server'
        );
        const prefix =
          mode.hidden || (!mode.prefix && locale === 'en') ? '' : `/${locale}`;
        const href = isAbout ? prefix || '/' : `${prefix}/about`;
        assert.ok(
          html.includes(`href="${href}"`),
          `Navigation must target ${href}`
        );
      };
      const expectRedirect = async (path, target, headers) => {
        const response = await request(path, headers);
        assert.equal(response.status, 307);
        assert.equal(
          new URL(response.headers.get('location'), base).href,
          `${base}${target}`
        );
        return response;
      };

      if (mode.hidden) {
        await expectLocale('/', 'en', { 'accept-language': 'en' });
        await expectLocale('/?ref=example', 'de', { 'accept-language': 'de' });
        await expectLocale('/', 'de', {
          cookie: 'NEXT_LOCALE=de',
          'accept-language': 'en'
        });
        await expectLocale('/', 'en', {
          cookie: 'NEXT_LOCALE=unknown',
          'accept-language': 'en'
        });
        await Promise.all([
          expectLocale('/', 'en', { cookie: 'NEXT_LOCALE=en' }),
          expectLocale('/', 'de', { cookie: 'NEXT_LOCALE=de' })
        ]);
      } else {
        await expectLocale('/de', 'de');
        await expectRedirect('/?ref=example', '/de?ref=example', {
          'accept-language': 'de'
        });
        await expectRedirect('/', '/de', {
          cookie: 'NEXT_LOCALE=de',
          'accept-language': 'en'
        });
        if (mode.prefix) {
          await expectLocale('/en', 'en');
          await expectRedirect('/', '/en', { 'accept-language': 'en' });
        } else {
          await expectLocale('/', 'en', { 'accept-language': 'en' });
          await expectRedirect('/en?ref=example', '/?ref=example');
          const response = await expectRedirect('/en/about', '/about', {
            cookie: 'NEXT_LOCALE=ja'
          });
          const preference = response.headers.get('set-cookie')?.split(';')[0];
          assert.equal(preference, 'NEXT_LOCALE=en');
          await expectLocale('/about', 'en', { cookie: preference });
        }
      }
      for (const locale of ['en', 'de', 'ja']) {
        const prefix =
          mode.hidden || (!mode.prefix && locale === 'en') ? '' : `/${locale}`;
        await expectLocale(prefix || '/', locale, {
          cookie: `NEXT_LOCALE=${locale}`
        });
        await expectLocale(`${prefix}/about`, locale, {
          cookie: `NEXT_LOCALE=${locale}`
        });
      }
      assert.equal(
        (await request('/missing-page', { 'accept-language': 'en' })).status,
        mode.prefix ? 307 : 404
      );
      console.log(`Passed: ${mode.name}`);
    } catch (error) {
      console.error(logs);
      throw error;
    } finally {
      if (server.exitCode === null) {
        const exited = once(server, 'exit');
        server.kill('SIGTERM');
        await exited;
      }
    }
  }
} finally {
  await rm(cwd, { recursive: true, force: true });
}

console.log('\nAll root-params routing checks passed.');
