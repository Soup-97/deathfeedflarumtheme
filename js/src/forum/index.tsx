import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';

import DeathfeedHero from './components/DeathfeedHero';
import UserStatsPanel from './components/UserStatsPanel';

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

  // User stats sidebar (avatar, join date, post/discussion counts, quick links) -- dropped
  // into IndexPage's own sidebarItems() ItemList, which core already renders inside the
  // .sideNav column (IndexPage.tsx: <nav className="IndexPage-nav sideNav"><ul>{listItems(
  // this.sidebarItems().toArray())}</ul></nav>) -- no layout/margin changes needed anywhere,
  // unlike madeyedeer/flarum-pallet-theme's own version of this feature, which mounts a whole
  // separate site-wide sidebar DOM node instead. Priority 200 keeps it above core's own
  // "New Discussion" button and nav dropdown.
  extend(IndexPage.prototype, 'sidebarItems', function (items: any) {
    items.add('deathfeed-user-stats', <UserStatsPanel />, 200);
  });
});
