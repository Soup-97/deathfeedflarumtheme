import Component from 'flarum/common/Component';
import type Mithril from 'mithril';

// `m` (Mithril) is deliberately not imported -- Flarum's own core bundle sets it up as an
// ambient global (window.m) that every extension bundle shares, same pattern as `$`/jQuery;
// flarum-webpack-config's externals list only maps `flarum/*` and `jquery`, not a real
// `mithril` npm package to resolve against (confirmed: flarum/tags' own components import
// neither `m` nor `mithril` explicitly and still call `m(...)`/JSX). `import type` above is
// erased at compile time (no runtime import emitted), so it's safe for the type annotation.
declare const m: typeof Mithril;

// Which Killboard server region to pull "today" stats from. Deathfeed's own
// /api/local/stats endpoint has CORS wide open (server/index.ts: app.use(cors({ origin: true }))),
// so this is a plain cross-origin fetch, no backend proxy needed.
const STATS_SERVER = 'europe';
const STATS_URL = `https://deathfeed.com/api/local/stats?server=${STATS_SERVER}`;

interface DeathfeedStats {
  killsToday?: number;
  silverLost?: number;
  activePlayers?: number;
}

// Same abbreviation rule as Killboard's own src/utils/price.ts formatSilver --
// ported here rather than imported since this is a separate JS bundle/origin.
function formatSilver(silver: number): string {
  if (silver >= 1_000_000_000) return `${(silver / 1_000_000_000).toFixed(2)}B`;
  if (silver >= 1_000_000) return `${(silver / 1_000_000).toFixed(2)}M`;
  if (silver >= 1_000) return `${(silver / 1_000).toFixed(1)}k`;
  return silver.toLocaleString();
}

// Replacement for Flarum's default WelcomeHero, matching deathfeed.com's own homepage hero
// (DesignPreviewPage.tsx) copy, layout and live "today" stats -- reuses the .Hero/.container
// classes core already renders so the existing glass-card/radial-glow CSS in less/forum.less
// applies automatically; only the inner content here is new.
export default class DeathfeedHero extends Component {
  stats: DeathfeedStats | null = null;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);
    this.loadStats();
  }

  loadStats() {
    // Plain m.request, not Flarum's app.request -- this is a third-party external origin
    // (deathfeed.com's own API, unrelated to this Flarum instance's own JSON:API), and
    // app.request would attach this instance's own auth/CSRF headers to that cross-origin
    // call for no reason (harmless server-side since it'd just be ignored, but an unnecessary
    // CORS preflight and a layer of Flarum-specific response-format assumptions neither apply).
    m.request<DeathfeedStats>({ method: 'GET', url: STATS_URL })
      .then((data) => {
        this.stats = data;
        m.redraw();
      })
      .catch(() => {
        // Stats are decorative here -- if the fetch fails (offline, CORS change, endpoint
        // moved), the hero still renders fine with the value slots left blank rather than
        // erroring the whole forum index page.
      });
  }

  view() {
    const kills = this.stats?.killsToday;
    const loot = this.stats?.silverLost;
    const players = this.stats?.activePlayers;

    return (
      <div className="Hero DeathfeedHero">
        <div className="container">
          <span className="DeathfeedHero-badge">{STATS_SERVER.toUpperCase()} · LIVE</span>

          <h1 className="DeathfeedHero-title">
            Every death in Albion,
            <br />
            <span className="DeathfeedHero-title-accent">the moment it happens.</span>
          </h1>

          <p className="DeathfeedHero-subtitle">
            Deathfeed tracks kills in real time — loot value, build composition, and whether that
            juicy drop was actually worth ganking for.
          </p>

          <div className="DeathfeedHero-stats">
            <div className="DeathfeedHero-stat">
              <span className="DeathfeedHero-stat-value DeathfeedHero-stat-value--blue">
                {kills !== undefined ? kills.toLocaleString() : '—'}
              </span>
              <span className="DeathfeedHero-stat-label">Kills Today</span>
            </div>
            <div className="DeathfeedHero-stat-divider" />
            <div className="DeathfeedHero-stat">
              <span className="DeathfeedHero-stat-value DeathfeedHero-stat-value--gold">
                {loot !== undefined ? formatSilver(loot) : '—'}
              </span>
              <span className="DeathfeedHero-stat-label">Loot Today</span>
            </div>
            <div className="DeathfeedHero-stat-divider" />
            <div className="DeathfeedHero-stat">
              <span className="DeathfeedHero-stat-value DeathfeedHero-stat-value--red">
                {players !== undefined ? players.toLocaleString() : '—'}
              </span>
              <span className="DeathfeedHero-stat-label">Active PvP Players Today</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
