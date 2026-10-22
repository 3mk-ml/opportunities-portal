const fs = require('fs');

const html = fs.readFileSync('./index.html', 'utf8');
const checks = [
  ['skip-link', html.includes('class="skip-link"')],
  ['RTL dir', html.includes('dir="rtl"')],
  ['lang=ar', html.includes('lang="ar"')],
  ['hero section', html.includes('id="hero"')],
  ['featured section', html.includes('id="featured"')],
  ['catalogue section', html.includes('id="catalogue"')],
  ['about section', html.includes('id="about"')],
  ['modal', html.includes('id="opp-modal"')],
  ['lang switch', html.includes('id="lang-switch"')],
  ['menu toggle', html.includes('id="menu-toggle"')],
  ['nav overlay', html.includes('id="nav-overlay"')],
  ['main landmark', html.includes('id="main-content"')],
  ['footer landmark', html.includes('role="contentinfo"')],
  ['i18n script', html.includes('js/i18n.js')],
  ['main script', html.includes('js/main.js')],
  ['css link', html.includes('css/main.css')],
  ['service worker', html.includes('serviceWorker')],
  ['approved font (IBM Plex Sans Arabic)', html.includes('IBM+Plex+Sans+Arabic')],
  ['no external JS scripts or libraries', !html.includes('cdn.') && !html.includes('jsdelivr') && !html.includes('unpkg')],
  ['description meta', html.includes('meta name="description"')],
];

let pass = true;
checks.forEach(([name, result]) => {
  console.log((result ? '✔' : '✗') + ' ' + name);
  if (!result) pass = false;
});
console.log(pass ? '\nAll checks PASSED' : '\nSome checks FAILED');
process.exit(pass ? 0 : 1);