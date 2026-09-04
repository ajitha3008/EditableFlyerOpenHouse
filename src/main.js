import './styles.css';

const OPEN_HOUSE_TEMPLATE_URL = '/toastmasters-open-house-template.png';
const TOASTMASTERS_LOGO_URL = '/toastmasters-international-logo.png';
const OPEN_HOUSE_WIDTH = 1003;
const OPEN_HOUSE_HEIGHT = 1568;
const TESTIMONIAL_SIZE = 1254;
const TESTIMONIAL_PASSWORD = 'aurie26retention';

const openHouseInitial = {
  club: 'Lakeshore Speakers Club',
  date: 'Saturday, September 12, 2026',
  time: '1:00 PM – 3:00 PM',
  location: 'Toronto Reference Library, 789 Yonge Street',
};

const testimonialInitial = {
  testimonial: 'Toastmasters gave me the confidence to find my voice, lead with purpose, and connect with people in a whole new way.',
  participantName: 'Participant Name',
  designation: 'Designation / Toastmasters Role',
};

const openHouseFields = [
  { id: 'club', label: 'Club name', max: 70, hint: 'Shown prominently in the central space. Wraps to 3 lines.', placeholder: 'e.g. Lakeshore Speakers Club' },
  { id: 'date', label: 'Open house date', max: 35, hint: 'Use a friendly format, such as Saturday, September 12, 2026.', placeholder: 'e.g. Saturday, September 12, 2026' },
  { id: 'time', label: 'Time', max: 30, hint: 'Include the time zone when guests may join online.', placeholder: 'e.g. 1:00 PM – 3:00 PM EDT' },
  { id: 'location', label: 'Location', max: 70, hint: 'Long addresses wrap automatically to 2 lines.', placeholder: 'e.g. Toronto Reference Library, 789 Yonge Street' },
];

const testimonialFields = [
  { id: 'testimonial', label: 'Testimonial', max: 220, hint: 'A concise, authentic message works best. Text fits automatically.', placeholder: 'Share the participant’s Toastmasters experience.', multiline: true },
  { id: 'participantName', label: 'Participant name', max: 45, hint: 'Displayed in uppercase beneath the quote.', placeholder: 'e.g. Priya Sharma' },
  { id: 'designation', label: 'Designation / Toastmasters role', max: 65, hint: 'Add a professional title, club role, or both.', placeholder: 'e.g. VP Education · Lakeshore Speakers' },
];

function fieldMarkup(field, values) {
  const describedBy = `${field.id}-hint ${field.id}-counter`;
  const common = `id="${field.id}" name="${field.id}" maxlength="${field.max}" placeholder="${field.placeholder}" autocomplete="off" aria-describedby="${describedBy}" required`;
  const control = field.multiline
    ? `<textarea ${common}>${values[field.id]}</textarea>`
    : `<input ${common} type="text" value="${values[field.id]}">`;
  return `
    <div class="field-group">
      <div class="label-row">
        <label for="${field.id}">${field.label}</label>
        <span class="counter" id="${field.id}-counter">${values[field.id].length} / ${field.max}</span>
      </div>
      ${control}
      <p class="field-hint" id="${field.id}-hint">${field.hint}</p>
    </div>
  `;
}

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Toastmasters Flyer Studio home">
      <span class="brand-mark" aria-hidden="true">T</span>
      <span><strong>Flyer Studio</strong><small>Toastmasters creative tools</small></span>
    </a>
    <span class="topbar-note"><span class="status-dot"></span> Private, browser-based editing</span>
  </header>

  <main>
    <section class="intro" aria-labelledby="page-title">
      <div><p class="eyebrow">Create. Personalize. Share.</p><h1 id="page-title">Your club’s story,<br><em>ready to inspire.</em></h1></div>
      <p class="intro-copy">Choose a flyer, personalize every detail, and download a high-resolution design. Your text and photos stay in your browser.</p>
    </section>

    <nav class="flyer-tabs" role="tablist" aria-label="Flyer type">
      <button class="flyer-tab is-active" type="button" role="tab" id="open-house-tab" aria-selected="true" aria-controls="open-house-view" data-tab="open-house">
        <span class="tab-icon" aria-hidden="true">01</span><span><strong>Open House</strong><small>Event invitation</small></span>
      </button>
      <button class="flyer-tab" type="button" role="tab" id="testimonial-tab" aria-selected="false" aria-controls="testimonial-view" data-tab="testimonial" tabindex="-1">
        <span class="tab-icon" aria-hidden="true">02</span><span><strong>Testimonials</strong><small>Password protected</small></span>
      </button>
    </nav>

    <section class="workspace flyer-view" id="open-house-view" role="tabpanel" aria-labelledby="open-house-tab" data-view="open-house">
      <aside class="editor-panel" aria-label="Open house flyer details">
        <div class="panel-heading"><span class="step">01</span><div><h2>Event details</h2><p>All four fields appear on your flyer.</p></div></div>
        <form id="open-house-form">
          ${openHouseFields.map((field) => fieldMarkup(field, openHouseInitial)).join('')}
          <div class="format-note"><span aria-hidden="true">Aa</span><p><strong>Smart text fitting</strong>Font size and line breaks adjust automatically within the template’s safe areas.</p></div>
          <div class="actions">
            <button class="button button-primary" type="submit"><span>Download PNG</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/></svg></button>
            <button class="button button-secondary" type="button" id="open-house-reset">Reset</button>
          </div>
        </form>
      </aside>
      <section class="preview-panel" aria-labelledby="open-house-preview-title">
        <div class="preview-heading"><div><span class="step">02</span><h2 id="open-house-preview-title">Live preview</h2></div><span class="size-badge">1003 × 1568 px</span></div>
        <div class="canvas-shell portrait-canvas">
          <div class="loading-state" id="open-house-loading"><span></span>Preparing your flyer…</div>
          <canvas id="open-house-canvas" width="1003" height="1568" aria-label="Preview of your personalized Toastmasters open house flyer"></canvas>
        </div>
        <div class="preview-footer"><p><span aria-hidden="true">✓</span> High-resolution PNG</p><p><span aria-hidden="true">✓</span> Print & social ready</p><p><span aria-hidden="true">✓</span> No data uploaded</p></div>
      </section>
    </section>

    <section class="workspace flyer-view" id="testimonial-view" role="tabpanel" aria-labelledby="testimonial-tab" data-view="testimonial" hidden>
      <aside class="editor-panel" aria-label="Testimonial flyer details">
        <div class="panel-heading testimonial-heading"><span class="step">01</span><div><h2>Participant story</h2><p>Personalize the portrait and testimonial.</p></div></div>
        <form id="testimonial-form">
          <div class="field-group">
            <div class="label-row"><label for="participant-photo">Participant photo</label><span class="optional-label">JPG, PNG or WebP</span></div>
            <label class="photo-picker" for="participant-photo">
              <span class="photo-picker-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 16.5V19h16v-2.5M12 4v10m0-10 4 4m-4-4L8 8"/></svg></span>
              <span><strong id="photo-picker-title">Choose a portrait</strong><small id="photo-file-name">The image will be centred and cropped to a circle.</small></span>
            </label>
            <input class="visually-hidden" id="participant-photo" type="file" accept="image/png,image/jpeg,image/webp">
            <div class="photo-tools" id="photo-tools" hidden>
              <label for="photo-zoom">Photo zoom</label><input id="photo-zoom" type="range" min="100" max="190" value="100" aria-label="Photo zoom"><button class="text-button" id="remove-photo" type="button">Remove</button>
            </div>
          </div>
          ${testimonialFields.map((field) => fieldMarkup(field, testimonialInitial)).join('')}
          <div class="format-note testimonial-note"><span aria-hidden="true">“</span><p><strong>Designed to fit</strong>The testimonial and portrait are composed automatically to match the supplied design.</p></div>
          <div class="actions">
            <button class="button button-primary" type="submit"><span>Download PNG</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/></svg></button>
            <button class="button button-secondary" type="button" id="testimonial-reset">Reset</button>
          </div>
        </form>
      </aside>
      <section class="preview-panel" aria-labelledby="testimonial-preview-title">
        <div class="preview-heading"><div><span class="step">02</span><h2 id="testimonial-preview-title">Live preview</h2></div><span class="size-badge">1254 × 1254 px</span></div>
        <div class="canvas-shell square-canvas"><canvas class="is-ready" id="testimonial-canvas" width="1254" height="1254" aria-label="Preview of your personalized Toastmasters testimonial flyer"></canvas></div>
        <div class="preview-footer"><p><span aria-hidden="true">✓</span> Editable portrait</p><p><span aria-hidden="true">✓</span> Social-ready square</p><p><span aria-hidden="true">✓</span> No data uploaded</p></div>
      </section>
    </section>
  </main>

  <footer><p>Built for stronger clubs and more confident voices.</p><p>Your edits and photos stay on this device.</p></footer>

  <div class="access-dialog" id="testimonial-gate" hidden>
    <button class="dialog-backdrop" type="button" aria-label="Close password dialog" data-close-gate></button>
    <section class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="gate-title" aria-describedby="gate-description">
      <button class="dialog-close" type="button" aria-label="Close" data-close-gate>×</button>
      <span class="dialog-lock" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"/></svg>
      </span>
      <p class="eyebrow">Restricted flyer</p>
      <h2 id="gate-title">Unlock Testimonials</h2>
      <p id="gate-description">Enter the password to open the testimonial flyer editor.</p>
      <form id="testimonial-gate-form">
        <label for="testimonial-password">Password</label>
        <input id="testimonial-password" type="password" autocomplete="current-password" required>
        <p class="password-error" id="password-error" role="alert"></p>
        <div class="dialog-actions">
          <button class="button button-primary" type="submit">Unlock editor</button>
          <button class="button button-secondary" type="button" data-close-gate>Cancel</button>
        </div>
      </form>
    </section>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const openHouseCanvas = document.querySelector('#open-house-canvas');
const openHouseCtx = openHouseCanvas.getContext('2d');
const testimonialCanvas = document.querySelector('#testimonial-canvas');
const testimonialCtx = testimonialCanvas.getContext('2d');
const openHouseTemplate = new Image();
const toastmastersLogo = new Image();
let openHouseTemplateReady = false;
let toastmastersLogoReady = false;
let participantImage = null;
let participantImageUrl = '';
let activeFlyer = 'open-house';
let testimonialUnlocked = false;

function valuesFromFields(fields) {
  return Object.fromEntries(fields.map(({ id }) => [id, document.querySelector(`#${id}`).value.trim()]));
}

function wrapText(ctx, content, maxWidth) {
  const paragraphs = String(content || '').split(/\n/);
  const lines = [];
  paragraphs.forEach((paragraph, paragraphIndex) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
      } else {
        if (line) lines.push(line);
        line = word;
        while (ctx.measureText(line).width > maxWidth && line.length > 1) {
          let breakAt = line.length - 1;
          while (breakAt > 1 && ctx.measureText(line.slice(0, breakAt)).width > maxWidth) breakAt -= 1;
          lines.push(line.slice(0, breakAt));
          line = line.slice(breakAt);
        }
      }
    }
    if (line) lines.push(line);
    if (!words.length && paragraphIndex < paragraphs.length - 1) lines.push('');
  });
  return lines;
}

function fitLines(ctx, text, maxWidth, maxLines, maxSize, minSize, family, weight = 700) {
  for (let size = maxSize; size >= minSize; size -= 1) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { lines, size };
  }
  ctx.font = `${weight} ${minSize}px ${family}`;
  const lines = wrapText(ctx, text, maxWidth);
  if (lines.length <= maxLines) return { lines, size: minSize };
  const visible = lines.slice(0, maxLines);
  let last = visible[maxLines - 1] || '';
  while (ctx.measureText(`${last}…`).width > maxWidth && last.length) last = last.slice(0, -1);
  visible[maxLines - 1] = `${last}…`;
  return { lines: visible, size: minSize };
}

function drawOpenHouseClubName(clubName) {
  if (!clubName) return;
  const family = '"Arial Narrow", "Roboto Condensed", Impact, sans-serif';
  const fitted = fitLines(openHouseCtx, clubName.toUpperCase(), 770, 3, 66, 34, family, 800);
  const lineHeight = fitted.size * 1.08;
  const blockHeight = fitted.lines.length * lineHeight;
  const centerY = 546;
  let y = centerY - blockHeight / 2 + lineHeight * .78;
  openHouseCtx.save();
  openHouseCtx.textAlign = 'center';
  openHouseCtx.font = `800 ${fitted.size}px ${family}`;
  openHouseCtx.fillStyle = '#08264c';
  openHouseCtx.shadowColor = 'rgba(255,255,255,.94)';
  openHouseCtx.shadowBlur = 10;
  fitted.lines.forEach((line) => { openHouseCtx.fillText(line, OPEN_HOUSE_WIDTH / 2, y); y += lineHeight; });
  openHouseCtx.restore();
  const dividerWidth = Math.min(330, Math.max(180, fitted.size * 4.8));
  const dividerY = centerY + blockHeight / 2 + 21;
  openHouseCtx.save();
  openHouseCtx.strokeStyle = '#d59b31';
  openHouseCtx.lineWidth = 2;
  openHouseCtx.beginPath();
  openHouseCtx.moveTo(OPEN_HOUSE_WIDTH / 2 - dividerWidth / 2, dividerY);
  openHouseCtx.lineTo(OPEN_HOUSE_WIDTH / 2 + dividerWidth / 2, dividerY);
  openHouseCtx.stroke();
  openHouseCtx.fillStyle = '#a50d24';
  openHouseCtx.beginPath(); openHouseCtx.arc(OPEN_HOUSE_WIDTH / 2, dividerY, 5, 0, Math.PI * 2); openHouseCtx.fill();
  openHouseCtx.restore();
}

function drawOpenHouseDetail(text, config) {
  if (!text) return;
  const family = '"Arial Narrow", "Roboto Condensed", Arial, sans-serif';
  const fitted = fitLines(openHouseCtx, text.toUpperCase(), config.width, config.maxLines, config.maxSize, config.minSize, family, 700);
  const lineHeight = fitted.size * 1.12;
  let y = config.centerY - (fitted.lines.length * lineHeight) / 2 + lineHeight * .78;
  openHouseCtx.save();
  openHouseCtx.font = `700 ${fitted.size}px ${family}`;
  openHouseCtx.textAlign = 'left';
  openHouseCtx.fillStyle = '#08264c';
  fitted.lines.forEach((line) => { openHouseCtx.fillText(line, config.x, y); y += lineHeight; });
  openHouseCtx.restore();
}

function renderOpenHouse() {
  if (!openHouseTemplateReady) return;
  const values = valuesFromFields(openHouseFields);
  openHouseCtx.clearRect(0, 0, OPEN_HOUSE_WIDTH, OPEN_HOUSE_HEIGHT);
  openHouseCtx.drawImage(openHouseTemplate, 0, 0, OPEN_HOUSE_WIDTH, OPEN_HOUSE_HEIGHT);
  drawOpenHouseClubName(values.club);
  drawOpenHouseDetail(values.date, { x: 444, centerY: 797, width: 455, maxLines: 2, maxSize: 32, minSize: 22 });
  drawOpenHouseDetail(values.time, { x: 444, centerY: 943, width: 455, maxLines: 2, maxSize: 34, minSize: 23 });
  drawOpenHouseDetail(values.location, { x: 480, centerY: 1088, width: 420, maxLines: 2, maxSize: 31, minSize: 21 });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawLetterSpacedText(ctx, text, centerX, y, spacing) {
  const characters = [...text];
  const totalWidth = characters.reduce((sum, character) => sum + ctx.measureText(character).width, 0) + spacing * (characters.length - 1);
  let x = centerX - totalWidth / 2;
  characters.forEach((character) => { ctx.fillText(character, x, y); x += ctx.measureText(character).width + spacing; });
}

function drawDots(ctx, startX, startY, columns, rows, gap, color, fadeDirection = 1) {
  ctx.save();
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      ctx.globalAlpha = .06 + .24 * (fadeDirection > 0 ? column / columns : 1 - column / columns);
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(startX + column * gap, startY + row * gap, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

function drawToastmastersLockup(ctx) {
  if (!toastmastersLogoReady) return;
  const logoSize = 178;
  const logoX = 360;
  const logoY = 43;

  ctx.save();
  ctx.drawImage(toastmastersLogo, logoX, logoY, logoSize, logoSize);

  ctx.strokeStyle = '#f4c54e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(559, 75);
  ctx.lineTo(559, 190);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = '800 43px Arial, Helvetica, sans-serif';
  ctx.fillText('TOASTMASTERS', 589, 130);

  ctx.font = '400 22px Arial, Helvetica, sans-serif';
  drawLetterSpacedText(ctx, 'INTERNATIONAL', 753, 177, 5.3);
  ctx.restore();
}

function drawTestimonialBackground(ctx) {
  const navyGradient = ctx.createLinearGradient(0, 0, TESTIMONIAL_SIZE, 900);
  navyGradient.addColorStop(0, '#052f50'); navyGradient.addColorStop(.58, '#06233d'); navyGradient.addColorStop(1, '#07365a');
  ctx.fillStyle = navyGradient; ctx.fillRect(0, 0, TESTIMONIAL_SIZE, TESTIMONIAL_SIZE);
  const redGradient = ctx.createLinearGradient(0, 700, TESTIMONIAL_SIZE, TESTIMONIAL_SIZE);
  redGradient.addColorStop(0, '#9d0b20'); redGradient.addColorStop(.5, '#bd1027'); redGradient.addColorStop(1, '#8d071c');
  ctx.fillStyle = redGradient;
  ctx.beginPath(); ctx.moveTo(0, 350); ctx.bezierCurveTo(100, 600, 310, 740, 570, 845); ctx.bezierCurveTo(850, 958, 1050, 990, 1254, 825); ctx.lineTo(1254, 1254); ctx.lineTo(0, 1254); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#f1c44f'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-12, 321); ctx.bezierCurveTo(92, 584, 315, 733, 577, 837); ctx.bezierCurveTo(860, 951, 1061, 972, 1262, 806); ctx.stroke();
  ctx.strokeStyle = 'rgba(8,55,91,.8)'; ctx.lineWidth = 17;
  ctx.beginPath(); ctx.moveTo(-12, 344); ctx.bezierCurveTo(92, 600, 304, 754, 571, 860); ctx.stroke();
  drawDots(ctx, 1000, 10, 15, 25, 17, '#1e6590', 1);
  drawDots(ctx, 0, 934, 19, 20, 17, '#5b0617', -1);
}

function drawPhotoPlaceholder(ctx, centerX, centerY, radius) {
  const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
  gradient.addColorStop(0, '#f6f6f7'); gradient.addColorStop(1, '#cfd1d5');
  ctx.fillStyle = gradient; ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.fillStyle = '#aeb0b5';
  ctx.beginPath(); ctx.arc(centerX, centerY - 42, radius * .34, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(centerX - radius * .72, centerY + radius); ctx.bezierCurveTo(centerX - radius * .62, centerY + radius * .35, centerX - radius * .3, centerY + radius * .18, centerX, centerY + radius * .18); ctx.bezierCurveTo(centerX + radius * .3, centerY + radius * .18, centerX + radius * .62, centerY + radius * .35, centerX + radius * .72, centerY + radius); ctx.closePath(); ctx.fill();
}

function drawParticipantPhoto(ctx) {
  const centerX = 286;
  const centerY = 742;
  const radius = 205;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(centerX, centerY, radius + 17, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.clip();
  if (participantImage) {
    const zoom = Number(document.querySelector('#photo-zoom').value) / 100;
    const sourceSize = Math.min(participantImage.naturalWidth, participantImage.naturalHeight) / zoom;
    const sourceX = (participantImage.naturalWidth - sourceSize) / 2;
    const sourceY = (participantImage.naturalHeight - sourceSize) / 2;
    ctx.drawImage(participantImage, sourceX, sourceY, sourceSize, sourceSize, centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else {
    drawPhotoPlaceholder(ctx, centerX, centerY, radius);
  }
  ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}

function drawTestimonialCard(ctx) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.24)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 16; ctx.fillStyle = '#fff';
  roundedRect(ctx, 310, 438, 824, 650, 55); ctx.fill();
  ctx.beginPath(); ctx.moveTo(725, 1070); ctx.lineTo(706, 1176); ctx.lineTo(838, 1081); ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawTestimonialText(ctx, values) {
  const family = 'Arial, Helvetica, sans-serif';
  ctx.save(); ctx.fillStyle = '#a20d25'; ctx.font = '800 108px Georgia, serif'; ctx.fillText('“', 507, 594);
  const quoteFit = fitLines(ctx, values.testimonial, 500, 6, 45, 31, family, 400);
  const quoteLineHeight = quoteFit.size * 1.28;
  ctx.fillStyle = '#101114'; ctx.font = `400 ${quoteFit.size}px ${family}`; ctx.textAlign = 'left';
  let quoteY = 615;
  quoteFit.lines.forEach((line) => { ctx.fillText(line, 568, quoteY); quoteY += quoteLineHeight; });
  ctx.fillStyle = '#a20d25'; ctx.font = `700 ${Math.max(35, quoteFit.size)}px Georgia, serif`;
  ctx.fillText('”', 568 + Math.min(470, ctx.measureText(quoteFit.lines.at(-1) || '').width + 8), quoteY - quoteLineHeight + 2);
  ctx.strokeStyle = '#e4ac32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(568, 928);
  ctx.lineTo(690, 928);
  ctx.stroke();
  const nameFit = fitLines(ctx, values.participantName.toUpperCase(), 510, 2, 40, 27, 'Arial, sans-serif', 800);
  ctx.fillStyle = '#062d4e'; ctx.font = `800 ${nameFit.size}px Arial, sans-serif`;
  let nameY = 988;
  nameFit.lines.forEach((line) => { ctx.fillText(line, 568, nameY); nameY += nameFit.size * 1.08; });
  const roleFit = fitLines(ctx, values.designation, 510, 2, 27, 19, family, 400);
  ctx.fillStyle = '#15161a'; ctx.font = `400 ${roleFit.size}px ${family}`;
  let roleY = Math.max(1032, nameY + 3);
  roleFit.lines.forEach((line) => { ctx.fillText(line, 568, roleY); roleY += roleFit.size * 1.14; });
  ctx.restore();
}

function renderTestimonial() {
  const values = valuesFromFields(testimonialFields);
  testimonialCtx.clearRect(0, 0, TESTIMONIAL_SIZE, TESTIMONIAL_SIZE);
  drawTestimonialBackground(testimonialCtx);
  drawToastmastersLockup(testimonialCtx);
  testimonialCtx.save();
  testimonialCtx.font = '800 92px "Arial Black", Arial, sans-serif';
  testimonialCtx.textAlign = 'left';
  const titleFirst = 'TOASTI';
  const titleSecond = 'MONIES';
  const titleFirstWidth = testimonialCtx.measureText(titleFirst).width;
  const titleWidth = titleFirstWidth + testimonialCtx.measureText(titleSecond).width;
  const titleStartX = (TESTIMONIAL_SIZE - titleWidth) / 2;
  testimonialCtx.fillStyle = '#fff'; testimonialCtx.fillText(titleFirst, titleStartX, 323);
  testimonialCtx.fillStyle = '#b41028'; testimonialCtx.fillText(titleSecond, titleStartX + titleFirstWidth - 1, 323);
  testimonialCtx.strokeStyle = '#e5b43a'; testimonialCtx.lineWidth = 2; testimonialCtx.beginPath(); testimonialCtx.moveTo(179, 370); testimonialCtx.lineTo(267, 370); testimonialCtx.moveTo(1031, 370); testimonialCtx.lineTo(1125, 370); testimonialCtx.stroke();
  testimonialCtx.fillStyle = '#f3c755'; testimonialCtx.font = '800 29px Arial, sans-serif'; drawLetterSpacedText(testimonialCtx, 'STRONG CLUBS  •  STRONGER TOGETHER', 653, 382, 4.2); testimonialCtx.restore();
  drawTestimonialCard(testimonialCtx);
  drawParticipantPhoto(testimonialCtx);
  drawTestimonialText(testimonialCtx, values);
  testimonialCtx.save(); testimonialCtx.fillStyle = '#fff'; testimonialCtx.font = '800 38px Arial, sans-serif'; drawLetterSpacedText(testimonialCtx, 'CGD TEAM', 1073, 1158, 2.3); testimonialCtx.fillStyle = '#f6cf61'; testimonialCtx.font = '800 27px Arial, sans-serif'; drawLetterSpacedText(testimonialCtx, 'DISTRICT 86', 1092, 1199, 2.2); testimonialCtx.font = '800 19px Arial, sans-serif'; drawLetterSpacedText(testimonialCtx, '2026-2027', 1092, 1233, 2); testimonialCtx.restore();
}

function updateCounter(input, field) {
  const counter = document.querySelector(`#${input.id}-counter`);
  counter.textContent = `${input.value.length} / ${field.max}`;
  counter.classList.toggle('near-limit', input.value.length >= field.max * .85);
}

function bindFields(fields, render) {
  fields.forEach((field) => {
    const input = document.querySelector(`#${field.id}`);
    input.addEventListener('input', () => { updateCounter(input, field); render(); });
  });
}

function resetFields(fields, initialValues, render) {
  fields.forEach((field) => {
    const input = document.querySelector(`#${field.id}`);
    input.value = initialValues[field.id];
    updateCounter(input, field);
  });
  render();
  document.querySelector(`#${fields[0].id}`).focus();
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Your flyer has been downloaded.');
}

function slugify(value, fallback) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || fallback;
}

function switchFlyer(nextFlyer) {
  activeFlyer = nextFlyer;
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    const isActive = tab.dataset.tab === nextFlyer;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  document.querySelectorAll('[data-view]').forEach((view) => { view.hidden = view.dataset.view !== nextFlyer; });
  if (nextFlyer === 'testimonial') renderTestimonial();
}

function closeTestimonialGate() {
  document.querySelector('#testimonial-gate').hidden = true;
  document.body.classList.remove('dialog-open');
  document.querySelector('#password-error').textContent = '';
  document.querySelector('#testimonial-tab').focus();
}

function requestFlyer(nextFlyer) {
  if (nextFlyer !== 'testimonial' || testimonialUnlocked) {
    switchFlyer(nextFlyer);
    return;
  }

  const gate = document.querySelector('#testimonial-gate');
  const passwordInput = document.querySelector('#testimonial-password');
  gate.hidden = false;
  document.body.classList.add('dialog-open');
  passwordInput.value = '';
  document.querySelector('#password-error').textContent = '';
  window.requestAnimationFrame(() => passwordInput.focus());
}

bindFields(openHouseFields, renderOpenHouse);
bindFields(testimonialFields, renderTestimonial);

document.querySelectorAll('[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => requestFlyer(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = activeFlyer === 'open-house' ? 'testimonial' : 'open-house';
    requestFlyer(next);
    if (next !== 'testimonial' || testimonialUnlocked) document.querySelector(`[data-tab="${next}"]`).focus();
  });
});

document.querySelector('#testimonial-gate-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const passwordInput = document.querySelector('#testimonial-password');
  if (passwordInput.value === TESTIMONIAL_PASSWORD) {
    testimonialUnlocked = true;
    closeTestimonialGate();
    switchFlyer('testimonial');
    document.querySelector('#testimonial-tab').focus();
    return;
  }

  document.querySelector('#password-error').textContent = 'Incorrect password. Please try again.';
  passwordInput.select();
});

document.querySelectorAll('[data-close-gate]').forEach((button) => button.addEventListener('click', closeTestimonialGate));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.querySelector('#testimonial-gate').hidden) closeTestimonialGate();
});

openHouseTemplate.onload = () => {
  openHouseTemplateReady = true;
  document.querySelector('#open-house-loading').hidden = true;
  openHouseCanvas.classList.add('is-ready');
  renderOpenHouse();
};

openHouseTemplate.onerror = () => {
  const loading = document.querySelector('#open-house-loading');
  loading.innerHTML = '<strong>Template could not be loaded.</strong><br>Please refresh the page.';
  loading.classList.add('error');
};

openHouseTemplate.src = OPEN_HOUSE_TEMPLATE_URL;

toastmastersLogo.onload = () => {
  toastmastersLogoReady = true;
  renderTestimonial();
};

toastmastersLogo.onerror = () => {
  toastmastersLogoReady = false;
  showToast('The Toastmasters logo could not be loaded.');
};

toastmastersLogo.src = TOASTMASTERS_LOGO_URL;

document.querySelector('#open-house-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity() || !openHouseTemplateReady) return;
  renderOpenHouse();
  downloadCanvas(openHouseCanvas, `${slugify(document.querySelector('#club').value, 'toastmasters-club')}-open-house.png`);
});

document.querySelector('#testimonial-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  renderTestimonial();
  downloadCanvas(testimonialCanvas, `${slugify(document.querySelector('#participantName').value, 'participant')}-testimonial.png`);
});

document.querySelector('#open-house-reset').addEventListener('click', () => resetFields(openHouseFields, openHouseInitial, renderOpenHouse));

function clearParticipantPhoto() {
  if (participantImageUrl) URL.revokeObjectURL(participantImageUrl);
  participantImageUrl = '';
  participantImage = null;
  document.querySelector('#participant-photo').value = '';
  document.querySelector('#photo-tools').hidden = true;
  document.querySelector('#photo-picker-title').textContent = 'Choose a portrait';
  document.querySelector('#photo-file-name').textContent = 'The image will be centred and cropped to a circle.';
  renderTestimonial();
}

document.querySelector('#testimonial-reset').addEventListener('click', () => {
  resetFields(testimonialFields, testimonialInitial, renderTestimonial);
  document.querySelector('#photo-zoom').value = '100';
  clearParticipantPhoto();
});

document.querySelector('#participant-photo').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) return;
  if (participantImageUrl) URL.revokeObjectURL(participantImageUrl);
  participantImageUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    participantImage = image;
    document.querySelector('#photo-tools').hidden = false;
    document.querySelector('#photo-picker-title').textContent = 'Change portrait';
    document.querySelector('#photo-file-name').textContent = file.name;
    renderTestimonial();
  };
  image.onerror = () => {
    clearParticipantPhoto();
    showToast('That image could not be opened. Please try another file.');
  };
  image.src = participantImageUrl;
});

document.querySelector('#photo-zoom').addEventListener('input', renderTestimonial);
document.querySelector('#remove-photo').addEventListener('click', clearParticipantPhoto);

renderTestimonial();
