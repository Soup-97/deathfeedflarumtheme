import Extend from 'flarum/common/extenders';

// Adds a "Footer text" field to this extension's own settings page (Admin > Extensions >
// Deathfeed Theme), same extender pattern flarum/pusher's own js/src/admin/extend.tsx uses
// (verified against its actual source). The saved value is keyed 'deathfeed-theme.footer_text'
// to match extend.php's Extend\Settings()->serializeToForum(...) call, which is what actually
// exposes it to the forum frontend as app.forum.attribute('deathfeedFooterText')
// (js/src/forum/components/DeathfeedFooter.tsx).
export default [
  new Extend.Admin().setting(
    () => ({
      setting: 'deathfeed-theme.footer_text',
      label: 'Footer text',
      help: 'Shown at the bottom of every page. Basic HTML (e.g. an <a href="..."> link) is allowed.',
      type: 'textarea',
      placeholder: '© 2026 Deathfeed. All rights reserved.',
    }),
    0
  ),
];
