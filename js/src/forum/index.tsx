import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';

import DeathfeedHero from './components/DeathfeedHero';
import DeathfeedSidebar from './components/DeathfeedSidebar';

// Same extension points forumaker/magicslider uses to replace the default WelcomeHero
// (verified against its js/src/forum/index.tsx) -- IndexPage.hero is what actually renders on
// the forum index, WelcomeHero.view is overridden too for any code path that renders it
// directly rather than through IndexPage.
app.initializers.add('deathfeed-theme', () => {
  override(IndexPage.prototype, 'hero', function () {
    return <DeathfeedHero />;
  });
  override(WelcomeHero.prototype, 'view', function () {
    return <DeathfeedHero />;
  });

  // Full sidebar (avatar/stats, nav links, Start a Discussion, Profile/Settings/Admin/Log Out)
  // -- dropped into IndexSidebar's own items() ItemList. `IndexPage.prototype.sidebarItems()`
  // doesn't exist in Flarum 2.0 -- extending it was a silent no-op, which is why nothing
  // appeared at first. 2.0 moved the whole left column out of IndexPage into its own
  // IndexSidebar component (confirmed against its actual source), and `items()` -- not
  // `sidebarItems()` -- is what core itself uses for the "New Discussion" button and nav
  // dropdown.
  //
  // Removes core's own 'newDiscussion' button and 'nav' dropdown and folds equivalent
  // functionality into DeathfeedSidebar itself, so the whole left column reads as one
  // continuous panel (avatar -> nav links -> start discussion -> account links) instead of
  // core's controls stacked above a separate small card -- matching the structure
  // madeyedeer/flarum-pallet-theme's own sidebar has, which was the actual ask (a compact
  // user-stats card wedged below the existing controls wasn't it).
  extend(IndexSidebar.prototype, 'items', function (items: any) {
    const canStartDiscussion = app.forum.attribute('canStartDiscussion') || !app.session.user;

    items.remove('newDiscussion');
    items.remove('nav');

    items.add(
      'deathfeed-sidebar',
      <DeathfeedSidebar
        navItems={this.navItems().toArray()}
        canStartDiscussion={canStartDiscussion}
        onStartDiscussion={() => this.newDiscussionAction().catch(() => {})}
      />,
      100
    );
  });
});
