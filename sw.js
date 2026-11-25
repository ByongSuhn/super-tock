// Super Tock offline cache: the app, marbles, boards, fonts and the Firebase scripts are kept on the phone,
// so computer games work with no signal. The page itself is always fetched fresh when there's a connection.
const V = 'st-20261125020728';
const CORE = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './favicon-32.png', './boards/amethyst-t.jpg', './boards/amethyst.jpg', './boards/billiards-t.jpg', './boards/billiards.jpg', './boards/blackmarble-t.jpg', './boards/blackmarble.jpg', './boards/dragon-t.jpg', './boards/dragon.jpg', './boards/frost-t.jpg', './boards/frost.jpg', './boards/galaxy-t.jpg', './boards/galaxy.jpg', './boards/gold-t.jpg', './boards/gold.jpg', './boards/lava-t.jpg', './boards/lava.jpg', './boards/pirate-t.jpg', './boards/pirate.jpg', './boards/poker-t.jpg', './boards/poker.jpg', './boards/roman-t.jpg', './boards/roman.jpg', './boards/roulette-t.jpg', './boards/roulette.jpg', './boards/ruins-t.jpg', './boards/ruins.jpg', './boards/whitemarble-t.jpg', './boards/whitemarble.jpg', './boards/wood-t.jpg', './boards/wood.jpg', './marbles/aurora.webp', './marbles/black-diamond.webp', './marbles/cosmic-nebula.webp', './marbles/dark-aurora.webp', './marbles/diamond.webp', './marbles/dragon-scale.webp', './marbles/emerald.webp', './marbles/fire-ice.webp', './marbles/frost-crystal.webp', './marbles/galaxy.webp', './marbles/golden-dragon.webp', './marbles/golden-ember.webp', './marbles/inferno.webp', './marbles/obsidian-gold.webp', './marbles/prism-opal.webp', './marbles/prismatic.webp', './marbles/royal-amethyst.webp', './marbles/steampunk.webp', './marbles/storm-cloud.webp', './marbles/storm-lightning.webp', './marbles/stormborn.webp', './marbles/titanium.webp', './marbles/toxic-lime.webp', './marbles/turquoise.webp', './marbles/violet-magic.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.hostname.includes('firebaseio.com') || u.hostname.includes('googleapis.com') && u.pathname.includes('identitytoolkit') || u.hostname.includes('securetoken')) return;   // live data: never cache
  if (r.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('index.html')) {          // the app: fresh if online, saved copy if not
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put('./index.html', c)); return res; })
      .catch(() => caches.match('./index.html', {ignoreSearch:true})));
    return;
  }
  if (u.origin === location.origin || /gstatic\.com|fonts\.googleapis\.com/.test(u.hostname)) {          // pictures, fonts, scripts: saved copy first
    e.respondWith(caches.match(r, {ignoreSearch:true}).then(hit => hit || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); } return res; })));
  }
});
