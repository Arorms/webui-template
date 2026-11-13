# webui-template

A ready-to-copy React admin frontend built on [`@arorms/core`](https://www.npmjs.com/package/@arorms/core)
and [`@arorms/ui`](https://www.npmjs.com/package/@arorms/ui). It is a template, not a product:
`private: true`, never published. It is also the end-to-end proof that the two packages deliver a
unified design and a working OIDC flow.

This repository is self-contained. The packages come from the registry, so there is no workspace
link and no sibling directory to keep in sync.

## What is in here

```
src/
├── main.tsx              configureCore(...) then the provider stack, in order
├── App.tsx               RouterProvider
├── styles/index.css      @import "tailwindcss"; @import "@arorms/ui/theme.css";
├── i18n/
│   ├── messages.ts       project-owned dictionaries (EN / ZH)
│   └── uiLabels.tsx      bridges @arorms/ui labels to t()
├── app/
│   ├── router.tsx        /login, /callback, protected shell, /kit, 404
│   ├── nav.ts            NavGroup[] — the only place navigation is declared
│   └── pages/
│       ├── OverviewPage.tsx      PageHeader + StatCard grid (skeleton while loading)
│       ├── ExampleCrudPage.tsx   ★ the page to copy for any list screen
│       └── RecordDetailPage.tsx  ★ DetailHeader + SectionCard + DescriptionList
├── features/example/     api.ts (in-memory store) + useRecordMutations.ts (TanStack Query)
└── kit/KitPage.tsx       ★ every component and variant, light and dark
```

## Run it

```bash
pnpm install
pnpm dev              # http://localhost:5173
```

- `/kit` — component gallery (no login required, so it is always inspectable)
- `/login` — SSO entry; `/callback` handles the code exchange
- `/example` — CRUD: debounced search, chip status filter, paginated table, modal form with tag
  chips, delete confirmation, toasts
- `/example/:id` — detail layout: back link, description list, empty-value handling

`@arorms/ui` and `@arorms/core` are installed from npm as `^0.1.0`. Until `@arorms/ui@0.1.1` is
published, `@arorms/ui@0.1.0` still carries a `workspace:*` dependency and will not install from
the registry; pin `@arorms/core` explicitly or use a local `file:` link in the meantime.

## No backend

`src/features/example/api.ts` is an in-memory store, so the app runs standalone. The `vite.config.ts`
proxy (`/api` → `localhost:8086`) and `VITE_API_BASE_URL=/api` are placeholders that show the shape
a real project uses: same-origin `/api` in dev (through the proxy) and in production (through the
reverse proxy), with the token attached by `apiClient` from `@arorms/core`. 8086 is not a real
service. Point the proxy at your backend and replace `features/example/api.ts` with the commented
`apiClient` version to go live.

## OIDC

Keycloak realm `https://auth.arorms.cn/realms/arorms`, client `frontend-template` — the client id
has not been renamed yet, so it stays `frontend-template` even though this app is the template.
That client currently allows `http://localhost:5173/*`, which is why the dev server is on 5173
rather than the 5180 suggested for new projects. Register your own redirect URI before changing
the port.

`main.tsx` is the only place configuration lives:

```tsx
configureCore({
  namespace: 'playground',               // → localStorage "playground:theme", events "playground:unauthorized"
  oidc: { authority, clientId, redirectUri },
  api: { baseUrl: '/api' },
})
```

Renewal is on-demand, not on a timer: the API client refreshes 60s before expiry, de-duplicates
concurrent refreshes (the realm revokes refresh tokens), replays a request once on 401, and
broadcasts `playground:unauthorized` only when the refresh token is actually dead.

## Starting a new project from this template

1. Copy this directory (or use it as a GitHub template / `degit`) into a new repository.
2. `package.json` → change `name`, keep the `^0.1.0` ranges on `@arorms/core` / `@arorms/ui`.
3. `.env.development` / `.env.production` → `VITE_OAUTH_CLIENT_ID`, and register the new redirect
   URI on the Keycloak client.
4. `vite.config.ts` → `server.port` and the `/api` proxy target.
5. `main.tsx` → `namespace`, so the copy does not share storage keys with this template.
6. Replace `src/features/example` with your domain, and `src/app/nav.ts` / `router.tsx` with your
   routes.

Keep `/kit` and the route to it: it is the drift detector for the design system.

Port plan for the existing projects:

| Project | dev port | backend proxy |
| --- | --- | --- |
| personal-resource-planning | 5173 | 8085 |
| blog/admin | 5174 | 8083 |
| email-server | 5175 (migrate from 5173) | 8084 |
| this template | 5173 | 8086 (placeholder, no backend) |
| new projects | 5180+ | as required |

## Build & deploy

```bash
pnpm build     # → dist (static files, no server runtime)
```

nginx, SPA fallback plus the API reverse proxy that `VITE_API_BASE_URL=/api` expects:

```nginx
server {
    listen 443 ssl;
    server_name app.arorms.cn;

    root /srv/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Because `VITE_*` values are baked in at build time, build per environment
(`.env.production` or `vite build --mode staging`) and register the matching `<host>/callback`
redirect URI on the Keycloak client.

## Conventions this app follows

- No raw class strings for surfaces — use `Card`, `PageHeader`, `DataTable`, `Button`, etc.
- Data tables are `<DataTable>` + `<DataTableRow>`; column *definitions* stay in the page.
- List state (`page / size / total / isLast / loading / error`) comes from `usePagedQuery`
  (`@arorms/core`); mutations are TanStack Query and call `reload()` plus a toast on success.
- All user-visible copy goes through `t('namespace.key')` and lives in `src/i18n/messages.ts`.
  `src/i18n/uiLabels.tsx` feeds the same `t()` into `@arorms/ui`.

Full authoring rules for the packages themselves: `docs/conventions.md` and
`docs/design-system.md` in the `arorms-ui` repository.
