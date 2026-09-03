# API

Backend for ncsuguessr--a [Hono](https://hono.dev/docs/getting-started/cloudflare-workers) server hosted on [Cloudflare Workers](https://workers.cloudflare.com/).

## Development

The backend is deployed in two environments, `prod` and `staging`. `prod` is automatically deployed whenever the `main` branch is updated, and `staging` tracks `development`.

When developing locally, you can use wrangler to deploy a local version of `prod` or `staging`. Generally, when developing locally, prefer `staging`. You can deploy a set of local staging environment resources by running `npm run dev:staging`.

You should not manually deploy to remote staging or prod from your local machine. Cloudflare is set to track the remote GitHub repository and should remain in sync with that repository at all times.

## Web app hosting

The Worker also serves the mobile app's static web build (from `mobile/dist`, produced by `expo export --platform web`) on the same domain as the API. See [wrangler.jsonc](./wrangler.jsonc) `assets`. Non-API browser navigation falls back to `index.html` (SPA mode), while API requests to `/images` and `/games` are handled by the Worker.

To build the web app and deploy the Worker with its assets:

```bash
# from the repo root
npm run deploy:staging
npm run deploy:prod
```

To serve the built web app and the API locally:

```bash
npm run dev:api
```
