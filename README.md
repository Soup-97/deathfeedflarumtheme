# Deathfeed Theme for Flarum

A Flarum extension that themes the forum to match [deathfeed.com](https://deathfeed.com)'s own
neon-glass dark design: same dark-900 background + radial glow, same neon-blue/violet/green/gold
accents, same Poppins font, same glass-card and pill-button treatment used across the site's React
frontend (`src/index.css`, `Layout.tsx`, `AlbionBackdrop.tsx`).

Two parts:
- **CSS/LESS** (`less/forum.less`) -- Flarum compiles this server-side, no build step.
- **JS** (`js/src/forum/`) -- two things:
  1. Replaces Flarum's default WelcomeHero with a custom hero that matches deathfeed.com's own
     homepage hero exactly (same headline/subtitle copy, same background image, same layout),
     including live "Kills Today" / "Loot Today" / "Active PvP Players Today" stats fetched
     client-side from Killboard's own `/api/local/stats` (CORS is already wide open there, no
     backend proxy needed). This replaces the [MagicSlider](https://github.com/forumaker/magicslider)
     extension entirely -- **disable/uninstall MagicSlider in Admin > Extensions** once this is
     live, since both override the same hero and having both active means whichever loads last wins.
  2. A logged-in user stats panel (avatar, join date, post/discussion counts, profile/settings
     links -- or a sign-up/log-in prompt for guests) dropped into the forum index's existing
     sidebar column, the same feature [madeyedeer/flarum-pallet-theme](https://github.com/madeyedeer/flarum-pallet-theme)
     has. Built as a much smaller, self-contained version of that: Pallet's own implementation
     mounts a whole separate site-wide sidebar DOM node and needs global layout/margin changes on
     every page; this one just adds an item to `IndexPage.sidebarItems()`, which core already
     renders inside the `.sideNav` column this theme already styles -- no layout changes needed
     anywhere else, and no dependency on `flarum/tags` (Pallet's version requires it).

  `js/dist/forum.js` is committed pre-built (`npm run build` was already run, and the compiled
  output's externalized imports were checked against Flarum's actual current source tree), so
  installing this extension only needs Composer -- no Node inside the Flarum container.

## Installing on your running Flarum instance (Coolify / Docker)

This isn't published on Packagist, so Composer needs to be told where to find it via a VCS
repository entry. From a shell inside the running `flarum` container (Coolify's resource page has
a **Terminal** tab, or `docker exec -it <container> sh`):

```sh
cd /var/www/html

composer config repositories.deathfeed-theme vcs https://github.com/Soup-97/deathfeedflarumtheme
composer require deathfeed/flarum-ext-theme:dev-main

php flarum cache:clear
```

Then in the forum's admin panel, go to **Extensions** and enable **Deathfeed Theme**.

## Updating

Since the whole Flarum app directory is a persistent volume (see `boardflarum`'s
`docker-compose.yml`), updating after you push changes to this repo is the same `composer update`
pattern as any other Flarum extension update:

```sh
cd /var/www/html
composer update deathfeed/flarum-ext-theme
php flarum assets:publish
php flarum cache:clear
```

`assets:publish` matters specifically since the hero's background image
(`assets/hero-bg.png`, served at `/assets/extensions/deathfeed-theme/...`) is only guaranteed
to be re-copied to the public assets directory on enable or on that command -- a bare
`composer update` while the extension is already enabled doesn't reliably re-publish it.

## Developing the JS (changing the hero)

```sh
cd js
npm install
npm run build   # or `npm run dev` to watch
```

Commit both `js/src/` and the rebuilt `js/dist/forum.js` -- the container installing this
extension never runs `npm install`/`npm run build` itself, only Composer, so the compiled output
has to already be in the repo.

## What it touches

- `@config-primary-color` / `@config-secondary-color` / `@config-dark-mode` -- so this doesn't
  depend on also setting Admin > Appearance's color pickers separately.
- Body background + radial glow, font-family (Poppins, Google Fonts import).
- `.App-header` -- blurred glass nav bar.
- `.Button` / `.Button--primary` -- pill shape, neon-blue glow.
- `.DiscussionListItem`, `.Post`, `.Dropdown-menu`, `.Modal-content` -- glass-card treatment.
- `.DiscussionListItem-title` / `.DiscussionListItem-info` / `.item-excerpt` / `.stickyDiscussion`
  -- finer-grained discussion list card detail, sticky discussions get Deathfeed's gold tint.
- `.Hero` -- rounded banner card using the exact same background image + scrim as Killboard's own
  hero (`assets/backgrounds/block1.png` + `linear-gradient(to bottom, rgba(13,17,23,0.55) 0%,
  rgba(13,17,23,0.85) 100%)`), with Deathfeed's blue/violet radial glow layered on top. The image
  is shipped in this extension's own `assets/` folder (Flarum's built-in mechanism, auto-published
  to `/assets/extensions/deathfeed-theme/...`) rather than linked to Killboard's own build output,
  whose filenames are content-hashed and would break on its next rebuild.
- `.sideNav` -- rounded pill tag/nav items with the same active-state neon-blue glow as
  Layout.tsx's navbar pills.
- Links, unread badges, tags -- neon-blue/violet/green accents.
- `.FormControl` -- focus glow on inputs/textareas.
- `.Composer` -- dark glass panel for the reply/post editor.
- `.TagTile` / `.TagTile-info` (if `flarum/tags` is installed) -- translates Killboard's own
  "Explore by content" homepage cards onto Flarum's tag grid: glass-card, neon-blue border glow
  on hover.
- `.Avatar` -- neon-blue ring on hover.
- `.LoadingIndicator-spinner` -- neon-blue glow, a small nod to DeathLoader's aesthetic.
- `.DiscussionHero-title` -- heavier weight so the discussion-page title reads as a real heading.
- `.UserCard` / `.UserCard--popover` -- glass background (`--usercard-bg` isn't set by core's own
  defaults, so this pins it explicitly) + neon-blue glow; also fixes a real core bug where the
  popover avatar has a hardcoded solid-white border that looked jarring on a dark theme.
- `.Scrubber-bar` -- glow on the discussion scroll-position indicator.
- `.NotificationsDropdown-unread.new` -- gold "new activity" pop instead of the muted default,
  matching Killboard's own gold = value/attention accent.
- `--overlay-bg` / `--control-danger-bg` / `--code-bg` / `--alert-*` / `--tooltip-bg` -- these
  aren't part of core's dark-mode derivation (`variables.less` keeps them as flat light-mode
  constants regardless of `@config-dark-mode`), so left alone they render as light-mode
  yellow/red/green alert boxes on a dark theme -- a real, visible bug, fixed with dark-toned
  equivalents using the neon palette.
- `.PostUser-name` -- bold byline. `.Post-body blockquote/code/pre` -- neon-blue-accented quote
  bar, dark code blocks. `.ReplyPlaceholder` -- neon-blue dashed border instead of the gray default.
- `.Modal-content` -- glass blur + neon-blue edge instead of a flat card.
  `.Modal--inverted .Modal-header` -- consistent dark tone.
- `.tooltip-inner` -- subtle neon-blue border.
- `h1`-`h4` -- Poppins bold, matching Killboard's own heading weight (core leaves this to the
  browser default).
- `.IndexPage-toolbar` -- more breathing room above the discussion list, matching Killboard's own
  generous spacing.
- **`DeathfeedHero` (JS)** -- overrides `IndexPage.prototype.hero` and `WelcomeHero.prototype.view`
  (`js/src/forum/index.tsx`, same extension points [forumaker/magicslider](https://github.com/forumaker/magicslider)
  uses) to render a custom hero matching deathfeed.com's own homepage: "EUROPE · LIVE" badge,
  two-tone headline, subtitle, and three live stat tiles (kills/loot/active players) fetched from
  `https://deathfeed.com/api/local/stats?server=europe` on mount. Loot uses the same
  K/M/B-abbreviation rule as Killboard's own `formatSilver` (ported, not imported, since this is
  a separate JS bundle/origin). Styled via `.DeathfeedHero-*` classes in `less/forum.less`, reusing
  the `.Hero`/`.container` wrapper so the existing rounded-card/radial-glow CSS applies
  automatically.
- **`UserStatsPanel` (JS)** -- extends `IndexPage.prototype.sidebarItems()`
  (`js/src/forum/index.tsx`) to add a logged-in user card (avatar, join date, post/discussion
  counts, profile/settings links) or a sign-up/log-in prompt for guests, at the top of the
  `.sideNav` column. Styled via `.DeathfeedSidebar-*` classes -- glass-card matching every other
  panel in the theme, stat values in neon-blue.
- Scrollbar -- violet thumb, matching the main site.

Layout ideas (the `.Hero` banner treatment and `.sideNav` pill styling) are adapted from two
community themes -- [Asirem](https://github.com/afrux/asirem) and
[Pallet](https://github.com/madeyedeer/flarum-pallet-theme) -- restyled with Deathfeed's own
palette rather than copied verbatim; both are pure CSS/LESS ideas here, their JS-driven features
(if any) aren't included.

If a specific element still doesn't match after enabling this, it's most likely because Flarum
2.0's actual rendered class names for that component differ from what's assumed here -- inspect
the element in your browser's devtools and it's a small selector tweak in `less/forum.less`.
