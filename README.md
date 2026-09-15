# Deathfeed Theme for Flarum

A pure CSS/LESS Flarum extension that themes the forum to match [deathfeed.com](https://deathfeed.com)'s
own neon-glass dark design: same dark-900 background + radial glow, same neon-blue/violet/green/gold
accents, same Poppins font, same glass-card and pill-button treatment used across the site's React
frontend (`src/index.css`, `Layout.tsx`, `AlbionBackdrop.tsx`).

No JS build step -- Flarum compiles LESS server-side, so this is just `extend.php` + one `.less` file.

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
php flarum cache:clear
```

## What it touches

- `@config-primary-color` / `@config-secondary-color` / `@config-dark-mode` -- so this doesn't
  depend on also setting Admin > Appearance's color pickers separately.
- Body background + radial glow, font-family (Poppins, Google Fonts import).
- `.App-header` -- blurred glass nav bar.
- `.Button` / `.Button--primary` -- pill shape, neon-blue glow.
- `.DiscussionListItem`, `.Post`, `.Dropdown-menu`, `.Modal-content` -- glass-card treatment.
- `.DiscussionListItem-title` / `.DiscussionListItem-info` / `.item-excerpt` / `.stickyDiscussion`
  -- finer-grained discussion list card detail, sticky discussions get Deathfeed's gold tint.
- `.Hero` -- rounded banner card with Deathfeed's own blue/violet radial glow.
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
- `.MagicSlider` (if [forumaker/magicslider](https://github.com/forumaker/magicslider) is
  installed) -- rounded glass card matching `.Hero`'s treatment, circular icon-button arrows
  matching Layout.tsx's account/search buttons, pill dots with a neon-blue active glow instead of
  a flat white dot.
- Scrollbar -- violet thumb, matching the main site.

Layout ideas (the `.Hero` banner treatment and `.sideNav` pill styling) are adapted from two
community themes -- [Asirem](https://github.com/afrux/asirem) and
[Pallet](https://github.com/madeyedeer/flarum-pallet-theme) -- restyled with Deathfeed's own
palette rather than copied verbatim; both are pure CSS/LESS ideas here, their JS-driven features
(if any) aren't included.

If a specific element still doesn't match after enabling this, it's most likely because Flarum
2.0's actual rendered class names for that component differ from what's assumed here -- inspect
the element in your browser's devtools and it's a small selector tweak in `less/forum.less`.
