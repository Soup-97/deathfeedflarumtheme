import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

// Renders whatever the admin has configured in Admin > Extensions > Deathfeed Theme > Footer
// text (js/src/admin/extend.tsx registers the setting; extend.php's Extend\Settings serializes
// it to the forum payload as `deathfeedFooterText`). Mounted via override(Footer.prototype,
// 'view', ...) in js/src/forum/index.tsx -- core's own Footer component
// (flarum/forum/components/Footer) is an empty extension point by default (`view() { return
// null; }`, confirmed against its actual source), so there's no default "Powered by Flarum" text
// to preserve or clobber here.
//
// Rendered via m.trust() rather than escaped -- footer content is admin-authored (already a
// fully trusted role in Flarum, with access to arbitrary CSS/JS through this and other
// extensions' own settings), and a plain-text-only footer couldn't carry a link, which is the
// common case ("© 2026 Deathfeed. <a href=\"/privacy\">Privacy</a>").
export default class DeathfeedFooter extends Component {
  view() {
    const text = app.forum.attribute('deathfeedFooterText');

    if (!text) return null;

    return (
      <div className="DeathfeedFooter">
        <div className="container">
          <div className="DeathfeedFooter-content">{m.trust(text as string)}</div>
        </div>
      </div>
    );
  }
}
