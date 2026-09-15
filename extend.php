<?php

/*
 * Deathfeed theme for Flarum -- CSS/LESS (Flarum compiles server-side) plus a small JS bundle
 * that replaces the default WelcomeHero with a live-stats hero matching deathfeed.com's own
 * homepage (js/src/forum/index.tsx, js/src/forum/components/DeathfeedHero.tsx). js/dist/forum.js
 * is committed pre-built (via `npm run build` in js/) so installing this extension doesn't
 * require Node inside the Flarum container -- only Composer.
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),
];
