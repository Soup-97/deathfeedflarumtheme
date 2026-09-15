<?php

/*
 * Deathfeed theme for Flarum -- pure CSS/LESS, no JS build step. Flarum compiles LESS
 * server-side (a separate, simpler pipeline from the JS/webpack one extensions with behavior
 * changes need), so this only needs Extend\Frontend's ->css() pointed at a plain .less file.
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/less/forum.less'),
];
