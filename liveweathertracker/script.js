const $ = id => document.getElementById(id);

function tickClock(){
  const now = new Date();
  $('clock').textContent = now.toLocaleTimeString([], {weekday:'short', hour:'2-digit', minute:'2-digit'});
}
tickClock();
setInterval(tickClock, 30000);

function conditionInfo(code){
  const map = {
    0:  {label:'Clear sky', icon:'sun'},
    1:  {label:'Mostly clear', icon:'sun-cloud'},
    2:  {label:'Partly cloudy', icon:'sun-cloud'},
    3:  {label:'Overcast', icon:'cloud'},
    45: {label:'Fog', icon:'fog'},
    48: {label:'Depositing fog', icon:'fog'},
    51: {label:'Light drizzle', icon:'rain'},
    53: {label:'Drizzle', icon:'rain'},
    55: {label:'Dense drizzle', icon:'rain'},
    56: {label:'Freezing drizzle', icon:'rain'},
    57: {label:'Freezing drizzle', icon:'rain'},
    61: {label:'Light rain', icon:'rain'},
    63: {label:'Rain', icon:'rain'},
    65: {label:'Heavy rain', icon:'rain'},
    66: {label:'Freezing rain', icon:'rain'},
    67: {label:'Freezing rain', icon:'rain'},
    71: {label:'Light snow', icon:'snow'},
    73: {label:'Snow', icon:'snow'},
    75: {label:'Heavy snow', icon:'snow'},
    77: {label:'Snow grains', icon:'snow'},
    80: {label:'Rain showers', icon:'rain'},
    81: {label:'Rain showers', icon:'rain'},
    82: {label:'Violent showers', icon:'rain'},
    85: {label:'Snow showers', icon:'snow'},
    86: {label:'Snow showers', icon:'snow'},
    95: {label:'Thunderstorm', icon:'storm'},
    96: {label:'Thunderstorm, hail', icon:'storm'},
    99: {label:'Thunderstorm, hail', icon:'storm'},
  };
  return map[code] || {label:'—', icon:'cloud'};
}

const ICONS = {
  sun: `<circle cx="24" cy="24" r="9" stroke="currentColor" stroke-width="2"/>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="24" y1="4" x2="24" y2="9"/><line x1="24" y1="39" x2="24" y2="44"/>
        <line x1="4" y1="24" x2="9" y2="24"/><line x1="39" y1="24" x2="44" y2="24"/>
        <line x1="10" y1="10" x2="13.5" y2="13.5"/><line x1="34.5" y1="34.5" x2="38" y2="38"/>
        <line x1="38" y1="10" x2="34.5" y2="13.5"/><line x1="13.5" y1="34.5" x2="10" y2="38"/>
        </g>`,
  'sun-cloud': `<circle cx="18" cy="16" r="7" stroke="currentColor" stroke-width="2"/>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="2" x2="18" y2="5"/><line x1="4" y1="16" x2="7" y2="16"/>
        <line x1="7.5" y1="5.5" x2="9.5" y2="7.5"/></g>
        <path d="M14 34h20a7 7 0 0 0 1-13.9A10 10 0 0 0 15.5 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>`,
  cloud: `<path d="M12 34h22a8 8 0 0 0 1-15.9A11 11 0 0 0 14 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>`,
  fog: `<g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="8" y1="18" x2="40" y2="18"/><line x1="4" y1="24" x2="44" y2="24"/>
        <line x1="10" y1="30" x2="38" y2="30"/></g>`,
  rain: `<path d="M12 26h22a8 8 0 0 0 1-15.9A11 11 0 0 0 14 16" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="16" y1="34" x2="14" y2="41"/><line x1="24" y1="34" x2="22" y2="41"/><line x1="32" y1="34" x2="30" y2="41"/></g>`,
  snow: `<path d="M12 24h22a8 8 0 0 0 1-15.9A11 11 0 0 0 14 14" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="16" y1="34" x2="16" y2="42"/><line x1="12.5" y1="38" x2="19.5" y2="38"/>
        <line x1="32" y1="34" x2="32" y2="42"/><line x1="28.5" y1="38" x2="35.5" y2="38"/></g>`,
  storm: `<path d="M12 22h22a8 8 0 0 0 1-15.9A11 11 0 0 0 14 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <path d="M25 30l-6 9h7l-5 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>`,
};

function setIcon(svgEl, key){
  svgEl.innerHTML = ICONS[key] || ICONS.cloud;
}

function fmtDay(iso){
  return new Date(iso + 'T00:00:00').toLocaleDateString([], {weekday:'short'});
}
function fmtHour(iso){
  return new Date(iso).toLocaleTimeString([], {hour:'numeric'});
}

async function geocode(name){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if(!data.results || !data.results.length) throw new Error('No matching city found');
  return data.results[0];
}

async function fetchWeather(lat, lon){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=8`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Weather lookup failed');
  return res.json();
}

function renderHourly(hourly, nowIso){
  const times = hourly.time, temps = hourly.temperature_2m;
  let startIdx = times.findIndex(t => t >= nowIso);
  if(startIdx < 0) startIdx = 0;
  const n = 24;
  const slice = temps.slice(startIdx, startIdx + n);
  const timeSlice = times.slice(startIdx, startIdx + n);

  const min = Math.min(...slice), max = Math.max(...slice);
  const range = (max - min) || 1;
  const w = 900, h = 140, padL = 6, padR = 6, padT = 20, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const step = plotW / (slice.length - 1);

  const pts = slice.map((t,i) => {
    const x = padL + i*step;
    const y = padT + plotH - ((t - min)/range)*plotH;
    return [x,y];
  });

  const path = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  let svg = `<path d="${path}" fill="none" stroke="#7C9AE8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  pts.forEach((p,i) => {
    svg += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.5" fill="#E7A94C"/>`;
    if(i % 3 === 0){
      svg += `<text x="${p[0].toFixed(1)}" y="${h-8}" fill="#5E6E8E" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">${fmtHour(timeSlice[i])}</text>`;
      svg += `<text x="${p[0].toFixed(1)}" y="${(p[1]-10).toFixed(1)}" fill="#93A4C2" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">${Math.round(slice[i])}°</text>`;
    }
  });
  $('hourlyChart').innerHTML = svg;
}

function renderDaily(daily){
  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const span = (allMax - allMin) || 1;

  const rows = daily.time.map((iso, i) => {
    const lo = daily.temperature_2m_min[i], hi = daily.temperature_2m_max[i];
    const leftPct = ((lo - allMin)/span) * 100;
    const widthPct = Math.max(((hi - lo)/span) * 100, 4);
    const info = conditionInfo(daily.weather_code[i]);
    const label = i===0 ? 'Today' : fmtDay(iso);
    return `<div class="day-row">
      <div class="day-name">${label}</div>
      <svg class="day-icon" viewBox="0 0 48 48" fill="none">${ICONS[info.icon]}</svg>
      <div class="range-track"><div class="range-fill" style="left:${leftPct}%;width:${widthPct}%"></div></div>
      <div class="day-minmax"><span class="lo">${Math.round(lo)}°</span><span class="hi">${Math.round(hi)}°</span></div>
    </div>`;
  }).join('');
  $('dailyList').innerHTML = rows;
}

async function loadCity(name){
  const status = $('status');
  status.className = 'status';
  status.textContent = 'Searching…';
  try{
    const place = await geocode(name);
    status.textContent = 'Loading forecast…';
    const weather = await fetchWeather(place.latitude, place.longitude);

    const cur = weather.current;
    const info = conditionInfo(cur.weather_code);
    const todayHi = weather.daily.temperature_2m_max[0];
    const todayLo = weather.daily.temperature_2m_min[0];

    $('placeName').textContent = [place.name, place.admin1].filter(Boolean).join(', ');
    $('placeSub').textContent = place.country || '';
    $('tempBig').innerHTML = Math.round(cur.temperature_2m) + '<sup>°</sup>';
    setIcon($('condIcon'), info.icon);
    $('condLabel').textContent = info.label;
    $('condRange').textContent = `H: ${Math.round(todayHi)}°  L: ${Math.round(todayLo)}°`;
    $('mFeels').textContent = Math.round(cur.apparent_temperature) + '°';
    $('mHumidity').textContent = cur.relative_humidity_2m + '%';
    $('mWind').textContent = Math.round(cur.wind_speed_10m) + ' km/h';

    renderHourly(weather.hourly, cur.time);
    renderDaily(weather.daily);

    $('hero').classList.add('show');
    $('belowHero').style.display = 'block';
    status.textContent = '';
  }catch(err){
    status.className = 'status error';
    status.textContent = err.message || 'Something went wrong';
  }
}

$('searchBtn').addEventListener('click', () => {
  const v = $('cityInput').value.trim();
  if(v) loadCity(v);
});
$('cityInput').addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    const v = $('cityInput').value.trim();
    if(v) loadCity(v);
  }
});

// Default city on load
$('cityInput').value = 'Delhi';
loadCity('Delhi');
