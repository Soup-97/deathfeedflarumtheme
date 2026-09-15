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
- Links, unread badges, tags -- neon-blue/violet/green accents.
- Scrollbar -- violet thumb, matching the main site.

If a specific element still doesn't match after enabling this, it's most likely because Flarum
2.0's actual rendered class names for that component differ from what's assumed here -- inspect
the element in your browser's devtools and it's a small selector tweak in `less/forum.less`.
