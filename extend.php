<?php

/*
 * Deathfeed theme for Flarum -- CSS/LESS (Flarum compiles server-side) plus a small JS bundle
 * that replaces the default WelcomeHero with a live-stats hero matching deathfeed.com's own
 * homepage (js/src/forum/index.tsx, js/src/forum/components/DeathfeedHero.tsx). js/dist/forum.js
 * is committed pre-built (via `npm run build` in js/) so installing this extension doesn't
 * require Node inside the Flarum container -- only Composer.
 *
 * Also registers an admin-configurable footer: an "admin" frontend bundle (js/dist/admin.js,
 * built from js/src/admin/) adds a "Footer text" field to this extension's own settings page
 * (Admin > Extensions > Deathfeed Theme), and Extend\Settings serializes the saved value to the
 * forum payload so js/src/forum/components/DeathfeedFooter.tsx can read it via
 * app.forum.attribute('deathfeedFooterText').
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Settings())
        ->serializeToForum('deathfeedFooterText', 'deathfeed-theme.footer_text')
        ->default('deathfeed-theme.footer_text', ''),
];
