# Reelist source architecture

Reelist uses a lightweight version of Feature-Sliced Design (FSD). The goal is to keep related code together and make dependencies flow in one direction.

## Layers

Dependencies flow upward through these layers:

shared → entities → features → widgets → pages → app

A lower layer may be imported by a higher layer. A lower layer must not import from a higher one. Slices on the same layer should not reach into each other's internal files; expose cross-slice code through an index.ts public API.

Create a layer or slice when the project has real code for it. Do not add empty folders just to reserve future structure.

## Next.js App Router

The project was scaffolded with the src directory, so src/app is the actual Next.js App Router. Keep its route files thin: they connect URL conventions to screen-level code and shared providers.

FSD page compositions belong in src/pages. Next.js treats root app and pages directories as higher priority than their src equivalents. The root pages folder is reserved with a .gitkeep file so src/pages can remain an FSD layer rather than becoming a second Next.js router.

## Shared configuration

Shared configuration is server-only when it reads secrets or process environment values. Import it through the shared/config public API. The server-only package makes an accidental import into a Client Component fail during the build rather than exposing environment data to the browser.
