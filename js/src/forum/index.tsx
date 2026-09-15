import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
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
  // into IndexSidebar's own items() ItemList. `IndexPage.prototype.sidebarItems()` doesn't
  // exist in Flarum 2.0 -- extending it was a silent no-op (extend() on a nonexistent method
  // just never fires), which is the real reason nothing appeared before. 2.0 moved the whole
  // left column out of IndexPage into its own IndexSidebar component (confirmed against its
  // actual source: `view()` renders <nav className="IndexPage-nav sideNav"><ul>{listItems(
  // this.items().toArray())}</ul></nav>`, and `items()` -- not `sidebarItems()` -- is what
  // core itself uses to add the "New Discussion" button and nav dropdown). Negative priority
  // renders below both of those (core's own items default to priority 0).
  extend(IndexSidebar.prototype, 'items', function (items: any) {
    items.add('deathfeed-user-stats', <UserStatsPanel />, -100);
  });
});
