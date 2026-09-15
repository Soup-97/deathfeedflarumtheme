import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LinkButton from 'flarum/common/components/LinkButton';
import Avatar from 'flarum/common/components/Avatar';
import formatNumber from 'flarum/common/utils/formatNumber';
import humanTime from 'flarum/common/utils/humanTime';

// Adapted from madeyedeer/flarum-pallet-theme's Sidebar.js (the logged-in user stats block
// specifically -- not its full IndexPage/TagsPage restructuring, which depends on flarum/tags
// and isn't what was asked for). Several of that file's import paths turned out to be stale 1.x
// ones, verified (and corrected) against Flarum 2.0's actual registered module keys by
// inspecting the compiled core forum.js bundle rather than trusting GitHub source-tree file
// paths alone -- those don't always match the runtime registry key:
//   - `flarum/common/helpers/avatar` doesn't exist in 2.0 (1.x had a helper function here);
//     the real registered key is the `common/components/Avatar` component.
//   - LogInModal/SignUpModal aren't eagerly registered at all -- core's own HeaderSecondary.js
//     loads them as lazy webpack chunks via `() => import('./LogInModal')`, so this extension
//     mirrors that exact pattern below instead of statically importing them.
//   - formatNumber/humanTime are common/utils/ (not 1.x's flarum/utils/).
//
// Mounted via IndexPage.prototype.sidebarItems() (js/src/forum/index.tsx) rather than Pallet's
// approach of mounting a whole separate site-wide sidebar DOM node in ForumApplication.mount --
// that needs global .App-content margin/layout changes on every page; this instead drops
// straight into the .sideNav column IndexPage already reserves space for, no layout changes
// needed anywhere else.
export default class UserStatsPanel extends Component {
  view() {
    const user = app.session.user;

    if (!user) {
      return (
        <div className="DeathfeedSidebar-guest">
          <p className="DeathfeedSidebar-guest-greeting">Join the community</p>
          <p className="DeathfeedSidebar-guest-message">
            Sign up to post, track discussions, and get notified.
          </p>
          <div className="DeathfeedSidebar-guest-buttons">
            {app.forum.attribute('allowSignUp') && (
              <Button
                className="Button Button--primary Button--block"
                onclick={() => app.modal.show(() => import('flarum/forum/components/SignUpModal'))}
              >
                {app.translator.trans('core.forum.header.sign_up_link')}
              </Button>
            )}
            <Button
              className="Button Button--block"
              onclick={() => app.modal.show(() => import('flarum/forum/components/LogInModal'))}
            >
              {app.translator.trans('core.forum.header.log_in_link')}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="DeathfeedSidebar-user">
        <div className="DeathfeedSidebar-user-avatar">
          <Avatar user={user} />
        </div>
        <h4 className="DeathfeedSidebar-user-name">{user.username()}</h4>
        <p className="DeathfeedSidebar-user-joined">
          {app.translator.trans('core.forum.user.joined_date_text', {
            ago: humanTime(user.joinTime()),
          })}
        </p>

        <div className="DeathfeedSidebar-user-stats">
          <div className="DeathfeedSidebar-stat">
            <span className="DeathfeedSidebar-stat-value">{formatNumber(user.commentCount())}</span>
            <span className="DeathfeedSidebar-stat-label">
              {app.translator.trans('core.forum.user.posts_link')}
            </span>
          </div>
          <div className="DeathfeedSidebar-stat">
            <span className="DeathfeedSidebar-stat-value">{formatNumber(user.discussionCount())}</span>
            <span className="DeathfeedSidebar-stat-label">
              {app.translator.trans('core.forum.user.discussions_link')}
            </span>
          </div>
        </div>

        <div className="DeathfeedSidebar-user-links">
          <LinkButton icon="fas fa-user" href={app.route.user(user)}>
            {app.translator.trans('core.forum.header.profile_button')}
          </LinkButton>
          <LinkButton icon="fas fa-cog" href={app.route('settings')}>
            {app.translator.trans('core.forum.header.settings_button')}
          </LinkButton>
        </div>
      </div>
    );
  }
}
