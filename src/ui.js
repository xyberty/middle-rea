export const UI_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Weather in your Calendar</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#ffffff;--bg2:#f7f7f5;--bg3:#f0efeb;
  --text:#1a1a1a;--text2:#666;--text3:#999;
  --border:rgba(0,0,0,.12);--border2:rgba(0,0,0,.22);
  --accent:#1a6ef5;--accent-bg:#eef4ff;--accent-text:#0d47c4;
  --success-bg:#edf7f0;--success-text:#1a6e3c;
  --r:10px;--r2:14px
}
@media(prefers-color-scheme:dark){:root{
  --bg:#1c1c1e;--bg2:#2c2c2e;--bg3:#3a3a3c;
  --text:#f2f2f7;--text2:#aeaeb2;--text3:#636366;
  --border:rgba(255,255,255,.1);--border2:rgba(255,255,255,.2);
  --accent:#4f8ef7;--accent-bg:rgba(79,142,247,.12);--accent-text:#7aabff;
  --success-bg:rgba(48,209,88,.1);--success-text:#34c759
}}
html{font-size:16px}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:2rem 1rem 4rem}
.wrap{max-width:480px;margin:0 auto}
header{margin-bottom:2.5rem}
.logo{font-size:1.5rem;font-weight:600;letter-spacing:-.02em;display:flex;align-items:center;gap:.5rem}
.logo-icon{font-size:1.4rem}
.tagline{margin-top:.35rem;font-size:.875rem;color:var(--text2)}

.card{background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--r2);padding:1.25rem}
.card+.card{margin-top:1rem}

label{display:block;font-size:.8125rem;font-weight:500;color:var(--text2);margin-bottom:.45rem;letter-spacing:.01em}
input[type=text],select{
  width:100%;padding:.625rem .75rem;font-size:.9375rem;
  background:var(--bg);color:var(--text);
  border:0.5px solid var(--border2);border-radius:var(--r);
  outline:none;-webkit-appearance:none;appearance:none;
  transition:border-color .15s
}
input[type=text]:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-bg)}
select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center;padding-right:2.25rem}

.row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}

.btn{
  width:100%;padding:.75rem;font-size:.9375rem;font-weight:500;
  background:var(--accent);color:#fff;border:none;
  border-radius:var(--r);cursor:pointer;
  transition:opacity .15s,transform .1s;
  display:flex;align-items:center;justify-content:center;gap:.5rem
}
.btn:hover{opacity:.88}
.btn:active{transform:scale(.98)}
.btn:disabled{opacity:.45;cursor:not-allowed}

.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

#preview{margin-top:1rem;display:none}
.preview-location{font-size:.8125rem;color:var(--text2);margin-bottom:.875rem;display:flex;align-items:center;gap:.35rem}
.days-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.625rem}
.day-card{
  background:var(--bg);border:0.5px solid var(--border);
  border-radius:var(--r);padding:.75rem .625rem;text-align:center
}
.day-name{font-size:.6875rem;font-weight:500;color:var(--text2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.375rem}
.day-icon{font-size:1.375rem;line-height:1;margin-bottom:.3rem}
.day-temp{font-size:.8125rem;font-weight:500;color:var(--text)}
.day-temp span{font-weight:400;color:var(--text2)}
.day-label{font-size:.6875rem;color:var(--text3);margin-top:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.result{display:none;margin-top:1rem}
.result-label{font-size:.75rem;font-weight:500;color:var(--text2);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.06em}
.url-box{
  background:var(--bg);border:0.5px solid var(--border);
  border-radius:var(--r);padding:.75rem 1rem;
  font-family:ui-monospace,monospace;font-size:.78125rem;
  color:var(--text);word-break:break-all;line-height:1.55;
  cursor:pointer;transition:border-color .15s
}
.url-box:hover{border-color:var(--border2)}
.url-hint{font-size:.75rem;color:var(--text3);margin-top:.5rem}
.copy-btn{
  width:100%;margin-top:.625rem;padding:.6rem;
  font-size:.875rem;font-weight:500;color:var(--accent);
  background:var(--accent-bg);border:0.5px solid var(--border);
  border-radius:var(--r);cursor:pointer;transition:opacity .15s
}
.copy-btn:hover{opacity:.78}
.copy-btn.copied{color:var(--success-text);background:var(--success-bg)}

.error-msg{
  background:rgba(220,50,50,.08);border:0.5px solid rgba(220,50,50,.25);
  border-radius:var(--r);padding:.75rem 1rem;
  font-size:.875rem;color:#c0392b;margin-top:.75rem;display:none
}
@media(prefers-color-scheme:dark){.error-msg{color:#ff6b6b}}

footer{margin-top:2.5rem;font-size:.75rem;color:var(--text3);text-align:center;line-height:1.6}
footer a{color:var(--text3);text-decoration:underline;text-underline-offset:2px}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="logo"><span class="logo-icon">&#9925;</span> weather-ical</div>
    <p class="tagline">Subscribe to a live weather feed in any calendar app</p>
  </header>

  <div class="card">
    <div style="margin-bottom:1rem">
      <label for="city">Location</label>
      <input type="text" id="city" placeholder="London, Berlin, New York&#8202;…" autocomplete="off" spellcheck="false">
    </div>
    <div class="row" style="margin-bottom:1rem">
      <div>
        <label for="units">Units</label>
        <select id="units">
          <option value="metric">Metric (°C)</option>
          <option value="imperial">Imperial (°F)</option>
        </select>
      </div>
      <div>
        <label for="temp">Temperature</label>
        <select id="temp">
          <option value="range">Min – Max</option>
          <option value="day">Day avg</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom:1.25rem">
      <label for="days">Forecast days: <strong id="days-val">14</strong></label>
      <input type="range" id="days" min="1" max="16" value="14" style="width:100%;margin-top:.375rem">
    </div>
    <button class="btn" id="submit-btn" type="button">
      <span id="btn-text">Preview &amp; get URL</span>
    </button>
  </div>

  <div id="preview" class="card">
    <div class="preview-location" id="preview-loc"></div>
    <div class="days-grid" id="days-grid"></div>
  </div>

  <div class="result" id="result">
    <div class="result-label">Your calendar feed URL</div>
    <div class="url-box" id="url-box" title="Click to copy"></div>
    <p class="url-hint">Subscribe in your calendar app using this URL (or replace <code style="font-size:.78em">https://</code> with <code style="font-size:.78em">webcal://</code>)</p>
    <button class="copy-btn" id="copy-btn" type="button">Copy URL</button>
  </div>

  <div class="error-msg" id="error-msg"></div>

  <footer>
    Weather data by <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a> (CC BY 4.0) &middot;
    <a href="https://github.com/open-meteo/open-meteo" target="_blank" rel="noopener">open source</a>
  </footer>
</div>

<script>
const $ = id => document.getElementById(id);

$('days').addEventListener('input', () => { $('days-val').textContent = $('days').value });

const WMO = {
  0:'☀️',1:'🌤',2:'⛅',3:'☁️',
  45:'🌫',48:'🌫',
  51:'🌦',53:'🌦',55:'🌧',56:'🌧',57:'🌧',
  61:'🌧',63:'🌧',65:'🌧',66:'🌨',67:'🌨',
  71:'🌨',73:'❄️',75:'❄️',77:'❄️',
  80:'🌦',81:'🌧',82:'🌧',85:'🌨',86:'🌨',
  95:'⛈',96:'⛈',99:'⛈'
};
const WMO_LABEL = {
  0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
  45:'Fog',48:'Icy fog',
  51:'Lt drizzle',53:'Drizzle',55:'Hvy drizzle',56:'Frz drizzle',57:'Frz drizzle',
  61:'Lt rain',63:'Rain',65:'Hvy rain',66:'Frz rain',67:'Frz rain',
  71:'Lt snow',73:'Snow',75:'Hvy snow',77:'Snow grains',
  80:'Lt showers',81:'Showers',82:'Hvy showers',85:'Snow showers',86:'Snow showers',
  95:'Thunderstorm',96:'T-storm/hail',99:'T-storm/hail'
};
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return DAY_NAMES[d.getDay()];
}

$('submit-btn').addEventListener('click', async () => {
  const city = $('city').value.trim();
  if (!city) { $('city').focus(); return; }

  const units  = $('units').value;
  const temp   = $('temp').value;
  const days   = $('days').value;

  $('submit-btn').disabled = true;
  $('btn-text').innerHTML = '<span class="spinner"></span> Fetching…';
  $('error-msg').style.display = 'none';
  $('preview').style.display = 'none';
  $('result').style.display = 'none';

  try {
    const qs = new URLSearchParams({ city, units, temp, days: 3 });
    const res = await fetch('/preview?' + qs);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');

    $('preview-loc').innerHTML =
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M6 1C3.79 1 2 2.79 2 5c0 3 4 7 4 7s4-4 4-7c0-2.21-1.79-4-4-4z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>'
      + data.location;

    $('days-grid').innerHTML = data.days.map(d => {
      const tempHtml = temp === 'day'
        ? Math.round((d.tMin + d.tMax) / 2) + '<span>°</span>'
        : Math.round(d.tMin) + '<span>°</span> .. ' + Math.round(d.tMax) + '<span>°</span>';
      const windHtml = d.windMax > 0
        ? ' · ' + d.windMax + ' m/s'
        : ''

      return \`
        <div class="day-card">
          <div class="day-name">\${formatDate(d.date)}</div>
          <div class="day-icon">\${WMO[d.code] || '🌡'}</div>
          <div class="day-temp">\${tempHtml}</div>
          <div class="day-label">\${WMO_LABEL[d.code] || ''} \${windHtml}</div>
        </div>
      \`;
    }).join('');
    $('preview').style.display = 'block';

    const origin = window.location.origin;
    const fullQs = new URLSearchParams({ city, units, temp, days });
    const url = \`\${origin}/cal?\${fullQs}\`;
    $('url-box').textContent = url;
    $('result').style.display = 'block';
    $('copy-btn').textContent = 'Copy URL';
    $('copy-btn').className = 'copy-btn';

    $('url-box').onclick = () => copyUrl(url);

  } catch(e) {
    $('error-msg').textContent = e.message;
    $('error-msg').style.display = 'block';
  } finally {
    $('submit-btn').disabled = false;
    $('btn-text').textContent = 'Preview & get URL';
  }
});

function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    $('copy-btn').textContent = 'Copied!';
    $('copy-btn').className = 'copy-btn copied';
    setTimeout(() => {
      $('copy-btn').textContent = 'Copy URL';
      $('copy-btn').className = 'copy-btn';
    }, 2000);
  });
}
$('copy-btn').addEventListener('click', () => copyUrl($('url-box').textContent));

$('city').addEventListener('keydown', e => { if(e.key === 'Enter') $('submit-btn').click() });
</script>
</body>
</html>`;
