// Unlike forum.ts's plain side-effect import, this has to be a re-export: src/admin/index.ts's
// `extend` export (the array of IExtenders, including the footer setting registration in
// src/admin/extend.ts) needs to end up on *this* module's own exports object, because that's
// what Flarum's ForumApplication/AdminApplication bootExtensions() reads
// (flarum.extensions['deathfeed-theme'].extend) to actually apply it -- a bare `import
// './src/admin'` would run src/admin's module code (constructing the Extend.Admin instance) but
// discard its export, so the setting would never actually get registered. Verified against
// flarum/pusher's own js/admin.ts, which uses this same `export *` form for exactly this reason
// (its own forum.ts, like ours, only needs a side-effect import, since forum-side registration
// happens via app.initializers.add(...) -- a real side effect that doesn't depend on the
// module's exports).
export * from './src/admin';
