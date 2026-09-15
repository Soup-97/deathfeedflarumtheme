import app from 'flarum/forum/app';
import { override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';

import DeathfeedHero from './components/DeathfeedHero';

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
});
