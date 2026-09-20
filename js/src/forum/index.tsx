import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import ForumApplication from 'flarum/forum/ForumApplication';
import IndexPage from 'flarum/forum/components/IndexPage';
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
  // -- a fixed, full-height column docked to the left edge of the viewport on EVERY page, not
  // just embedded in the index page's own .Page-sidebar column. This matches
  // madeyedeer/flarum-pallet-theme's own actual approach (js/src/forum/index.js: extend(
  // ForumApplication.prototype, 'mount', ...) creates a standalone .App-sidebar DOM node and
  // mounts its Sidebar component into it directly with m.mount(), independent of any page's own
  // ItemList) -- that was the actual ask (see less/forum.less's .App-sidebar rules for why the
  // node has to be a direct child of #app rather than nested inside the header, and the
  // .IndexPage .Page-sidebar hide rule that stops core's own default "New Discussion"/nav
  // dropdown from duplicating this).
  //
  // `extend` (not `override`) so core's own mount logic -- which itself mounts the header,
  // navigation and footer -- still runs first; the sidebar node is inserted right before
  // .App-content so it reads first in the DOM (skip-link / tab order), even though
  // position:fixed in the CSS takes it out of the normal flow for painting.
  extend(ForumApplication.prototype, 'mount', function () {
    const appEl = document.getElementById('app');
    const contentEl = document.querySelector('.App-content');
    if (!appEl || !contentEl) return;

    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'App-sidebar';
    appEl.insertBefore(sidebarContainer, contentEl);

    m.mount(sidebarContainer, DeathfeedSidebar);
  });
});
