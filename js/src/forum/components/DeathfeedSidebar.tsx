import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LinkButton from 'flarum/common/components/LinkButton';
import Avatar from 'flarum/common/components/Avatar';
import formatNumber from 'flarum/common/utils/formatNumber';
import humanTime from 'flarum/common/utils/humanTime';
import listItems from 'flarum/common/helpers/listItems';

// A full replacement for IndexSidebar's default items() (js/src/forum/index.tsx removes
// 'newDiscussion' and 'nav' and adds this single item instead), matching the actual structure
// madeyedeer/flarum-pallet-theme's own sidebar has -- one continuous column: avatar/name/
// join-date/stats, then the forum's own nav links (whatever IndexSidebar.navItems() has
// registered -- "All Discussions" from core, plus "Tags"/anything else other installed
// extensions add via their own extend(IndexSidebar.prototype, 'navItems', ...), rendered as
// flat rows via listItems() instead of core's default dropdown so nothing installed here goes
// missing), the "Start a Discussion" button, then Profile/Settings/Administration/Log Out --
// not just the small user-stats card this started as.
//
// Deliberately still mounted via IndexSidebar.prototype.items() (js/src/forum/index.tsx)
// rather than Pallet's own approach of mounting a whole separate site-wide sidebar DOM node in
// ForumApplication.mount, which needs global .App-content margin/layout changes on every page --
// this drops straight into the .sideNav column IndexSidebar already reserves space for.
//
// Profile/Settings/Administration/Log Out here mirror core's own SessionDropdown.tsx items()
// almost exactly (same icons, same translation keys, same app.forum.attribute('adminUrl') check,
// same app.session.logout.bind(app.session) handler) -- verified against its actual source
// rather than guessed, since this is the canonical place Flarum itself implements them.
export interface DeathfeedSidebarAttrs {
  navItems: unknown;
  canStartDiscussion: boolean;
  onStartDiscussion: () => void;
}

export default class DeathfeedSidebar extends Component<DeathfeedSidebarAttrs> {
  view() {
    const user = app.session.user;
    const adminUrl = app.forum.attribute('adminUrl');

    return (
      <div className={user ? 'DeathfeedSidebar-user' : 'DeathfeedSidebar-guest'}>
        {user ? this.userHeader(user) : this.guestHeader()}

        <div className="DeathfeedSidebar-divider" />

        <nav className="DeathfeedSidebar-nav">
          <ul>{listItems(this.attrs.navItems)}</ul>
        </nav>

        <Button
          icon="fas fa-edit"
          className="Button Button--primary Button--block DeathfeedSidebar-newDiscussion"
          disabled={!this.attrs.canStartDiscussion}
          onclick={this.attrs.onStartDiscussion}
        >
          {app.translator.trans(
            `core.forum.index.${this.attrs.canStartDiscussion ? 'start_discussion_button' : 'cannot_start_discussion_button'}`
          )}
        </Button>

        {user && <div className="DeathfeedSidebar-divider" />}

        {user && (
          <nav className="DeathfeedSidebar-nav">
            <ul>
              <li>
                <LinkButton icon="fas fa-user" href={app.route.user(user)}>
                  {app.translator.trans('core.forum.header.profile_button')}
                </LinkButton>
              </li>
              <li>
                <LinkButton icon="fas fa-cog" href={app.route('settings')}>
                  {app.translator.trans('core.forum.header.settings_button')}
                </LinkButton>
              </li>
              {adminUrl && (
                <li>
                  <LinkButton icon="fas fa-wrench" href={adminUrl} target="_blank">
                    {app.translator.trans('core.forum.header.admin_button')}
                  </LinkButton>
                </li>
              )}
            </ul>
          </nav>
        )}

        {user && <div className="DeathfeedSidebar-divider" />}

        {user && (
          <Button icon="fas fa-sign-out-alt" className="Button DeathfeedSidebar-logout" onclick={app.session.logout.bind(app.session)}>
            {app.translator.trans('core.forum.header.log_out_button')}
          </Button>
        )}
      </div>
    );
  }

  userHeader(user: any) {
    return (
      <div className="DeathfeedSidebar-user-header">
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
      </div>
    );
  }

  guestHeader() {
    return (
      <div className="DeathfeedSidebar-guest-header">
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
}
