# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Prisma schema and data layer complete

## Current Goal

- Ready for the next feature unit.

## Completed

- Implemented feature spec 01: design system and UI primitives.
- Implemented feature spec 02: editor chrome.
- Implemented feature spec 03: Clerk authentication, route protection, auth redirects, and the editor user menu.
- Implemented feature spec 04: editor home empty state, project create/rename/delete dialogs, owned project sidebar actions, and mobile sidebar scrim dismissal behavior using mock data only.
- Implemented feature spec 05: project and collaborator Prisma models, cached Prisma client singleton, first migration, generated client, and build validation.
- Installed and configured shadcn/ui with the Radix component library.
- Added `Button`, `Card`, `Dialog`, `Input`, `Tabs`, `Textarea`, and `ScrollArea` primitives in `components/ui/`.
- Installed `lucide-react`.
- Installed `@clerk/ui` and applied Clerk's `dark` theme through `ClerkProvider` with app CSS variables.
- Added `lib/utils.ts` with the reusable `cn()` helper.
- Restored the documented dark-only theme tokens in `app/globals.css` and mapped them to Tailwind utilities and shadcn token aliases.
- Added reusable editor chrome components: `EditorNavbar`, `ProjectSidebar`, and `EditorWorkspaceShell`.
- Added a project-scoped `EditorDialogShell` pattern on top of the shared dialog primitives for future modal work.
- Moved the editor workspace shell to `/editor`, redirected `/` to `/editor` for authenticated users, and exposed public Clerk auth routes at `/sign-in` and `/sign-up`.

## In Progress

- None yet.

## Next Up

- Select and implement the next feature spec.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Root `AGENTS.md` was read; `context/AGENTS.md` is not present in this checkout.
- Feature spec 05 was started on June 2, 2026 and covers the project/collaborator Prisma models, cached Prisma client singleton, first migration, and build validation.
- Feature spec 05 migration `20260602171922_init` was created and applied on June 2, 2026.
- Feature spec 05 validation passed on June 2, 2026: `npx prisma format`, `npx prisma validate`, `npx prisma generate`, `npx tsc --noEmit`, `npm run build`, and `npm run lint` succeeded.
- Prisma CLI commands were run with Node `v22.20.0`; the default shell Node `v20.9.0` is below Prisma 7.8's supported range and failed before schema loading.
- The first feature spec 05 build attempt failed in the sandbox because `next/font` could not fetch Google Fonts; the approved retry with network access passed.
- Feature spec 04 was started on June 1, 2026 and covers the `/editor` empty state, project create/rename/delete dialogs, owned-vs-shared sidebar actions, and mobile sidebar dismissal behavior.
- Feature spec 04 validation passed on June 1, 2026: `npm run lint`, `npx tsc --noEmit`, and `npm run build` succeeded.
- The first feature spec 04 build attempt failed in the sandbox because `next/font` could not fetch Google Fonts; the approved retry with network access passed.
- Validation passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- The first build attempt failed because sandboxed network access blocked `next/font` Google font downloads; the approved retry passed.
- Local server verification used the existing Next dev server at `http://127.0.0.1:3000`, which returned `Ghost AI` and no create-next-app text.
- In-app browser verification was attempted, but the `iab` browser backend was unavailable in this session.
- Feature spec 02 is scoped to reusable editor chrome primitives: top navbar, floating project sidebar, and a project-specific dialog shell pattern for future dialogs.
- Feature spec 02 validation passed again: `npm run lint`, `npx tsc --noEmit`, and `npm run build` succeeded after the approved font-fetch retry for `next/font`.
- Feature spec 03 uses Clerk's official `proxy.ts` entrypoint, keeps only the auth pages public, and relies on official Clerk env var names for sign-in, sign-up, and redirect behavior.
- Feature spec 03 validation passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build` succeeded on June 1, 2026. The first build attempt failed in the sandbox because `next/font` could not reach Google Fonts; the approved retry passed.
