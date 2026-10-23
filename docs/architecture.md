# Reelist source architecture

Reelist uses a lightweight version of Feature-Sliced Design (FSD). Code is grouped by product responsibility, and dependencies flow in one direction.

## Layers

Dependencies flow upward through these layers:

shared → entities → features → widgets → app

A lower layer may be imported by a higher layer. A lower layer must not import from a higher one. Slices on the same layer should not reach into each other's internal files; expose cross-slice code through an `index.ts` public API. Re-export-only `index.ts` files do not need comments.

## Next.js App Router

`src/app` is the App Router and owns URL routing and route-level files such as `page.tsx`, `layout.tsx`, and `loading.tsx`. Keep these files thin: they connect a route to a screen composition from `widgets` and shared providers.

Do not create `src/pages` as an FSD layer. Next.js treats that path as the Pages Router, where files can become routes. Keep page compositions in `src/widgets` until the architecture has a route-safe location that Steiger accepts.

## Folders

Create a layer or slice when it contains real code. Do not add empty directories or `.gitkeep` placeholders just to reserve future structure.

## Shared configuration

Shared configuration is server-only when it reads secrets or process environment values. Import it through the `shared/config` public API. The `server-only` package makes an accidental import into a Client Component fail during the build rather than exposing environment data to the browser.
