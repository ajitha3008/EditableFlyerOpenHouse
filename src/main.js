import './styles.css';

const OPEN_HOUSE_TEMPLATE_URL = '/toastmasters-open-house-template.png';
const TOASTMASTERS_LOGO_URL = '/toastmasters-international-logo.png';
const CERTIFICATE_TEMPLATE_URL = '/toastimonies-certificate-template.png';
const OPEN_HOUSE_WIDTH = 1003;
const OPEN_HOUSE_HEIGHT = 1568;
const TESTIMONIAL_SIZE = 1254;
const CERTIFICATE_WIDTH = 1463;
const CERTIFICATE_HEIGHT = 1075;
const MULTI_MONIES_WIDTH = 2550;
const MULTI_MONIES_HEIGHT = 3300;
const TESTIMONIAL_PASSWORD = 'aurie26retention';
const MULTI_MONIES_PASSWORD = 'chrismonies';
const PROTECTED_FLYERS = new Set(['testimonial', 'certificate', 'multi-monies']);
const BRAND_HEADING_FONT = '"Montserrat", "Arial Black", Arial, sans-serif';
const BRAND_BODY_FONT = '"Source Sans 3", "Source Sans Pro", Arial, sans-serif';
const brandFontsReady = document.fonts
  ? Promise.all([
    document.fonts.load('800 92px "Montserrat"'),
    document.fonts.load('400 45px "Source Sans 3"'),
  ])
  : Promise.resolve();

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

const certificateInitial = {
  certificateName: 'Participant Name',
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

const certificateFields = [
  { id: 'certificateName', label: 'Participant name', max: 50, hint: 'This is the only content changed on the certificate.', placeholder: 'e.g. Priya Sharma' },
];

function createMultiEntries() {
  return Array.from({ length: 8 }, (_, index) => ({
    comment: 'Share this participant’s Toastmasters experience and the impact it has made.',
    name: `Participant ${index + 1}`,
    designation: 'Toastmasters Member',
    image: null,
    imageUrl: '',
    fileName: '',
    zoom: 100,
    tilt: (Math.random() < .5 ? -1 : 1) * (.45 + Math.random() * .85) * Math.PI / 180,
  }));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

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
      <button class="flyer-tab" type="button" role="tab" id="certificate-tab" aria-selected="false" aria-controls="certificate-view" data-tab="certificate" tabindex="-1">
        <span class="tab-icon" aria-hidden="true">03</span><span><strong>Certificates</strong><small>Password protected</small></span>
      </button>
      <button class="flyer-tab" type="button" role="tab" id="multi-monies-tab" aria-selected="false" aria-controls="multi-monies-view" data-tab="multi-monies" tabindex="-1">
        <span class="tab-icon" aria-hidden="true">04</span><span><strong>Multi Monies</strong><small>Password protected</small></span>
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
        <div class="preview-heading"><div><span class="step">01</span><h2 id="open-house-preview-title">Live preview</h2></div><span class="size-badge">1003 × 1568 px</span></div>
        <div class="canvas-shell portrait-canvas">
          <div class="loading-state" id="open-house-loading"><span></span>Preparing your flyer…</div>
          <canvas id="open-house-canvas" width="1003" height="1568" aria-label="Preview of your personalized Toastmasters open house flyer"></canvas>
        </div>
        <div class="preview-footer"><p><span aria-hidden="true">✓</span> High-resolution PNG</p><p><span aria-hidden="true">✓</span> Print & social ready</p><p><span aria-hidden="true">✓</span> No data uploaded</p></div>
      </section>
    </section>

    <section class="workspace flyer-view" id="testimonial-view" role="tabpanel" aria-labelledby="testimonial-tab" data-view="testimonial" hidden>
      <aside class="editor-panel" aria-label="Testimonial flyer details">
        <div class="panel-heading testimonial-heading"><span class="step">02</span><div><h2>Participant story</h2><p>Personalize the portrait and testimonial.</p></div></div>
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

    <section class="workspace flyer-view" id="certificate-view" role="tabpanel" aria-labelledby="certificate-tab" data-view="certificate" hidden>
      <aside class="editor-panel" aria-label="Certificate details">
        <div class="panel-heading certificate-heading"><span class="step">03</span><div><h2>Certificate recipient</h2><p>Only the participant name is editable.</p></div></div>
        <form id="certificate-form">
          ${certificateFields.map((field) => fieldMarkup(field, certificateInitial)).join('')}
          <div class="format-note certificate-note"><span aria-hidden="true">✦</span><p><strong>Original artwork preserved</strong>The supplied design, signatures, borders, logos, and wording remain unchanged.</p></div>
          <div class="actions">
            <button class="button button-primary" type="submit"><span>Download Certificate</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/></svg></button>
            <button class="button button-secondary" type="button" id="certificate-reset">Reset</button>
          </div>
        </form>
      </aside>
      <section class="preview-panel" aria-labelledby="certificate-preview-title">
        <div class="preview-heading"><div><span class="step">03</span><h2 id="certificate-preview-title">Live preview</h2></div><span class="size-badge">1463 × 1075 px</span></div>
        <div class="canvas-shell landscape-canvas">
          <div class="loading-state" id="certificate-loading"><span></span>Preparing your certificate…</div>
          <canvas id="certificate-canvas" width="1463" height="1075" aria-label="Preview of the personalized Toastimonies certificate of participation"></canvas>
        </div>
        <div class="preview-footer"><p><span aria-hidden="true">✓</span> Original signatures</p><p><span aria-hidden="true">✓</span> Editable recipient</p><p><span aria-hidden="true">✓</span> High-resolution PNG</p></div>
      </section>
    </section>

    <section class="workspace flyer-view multi-monies-view" id="multi-monies-view" role="tabpanel" aria-labelledby="multi-monies-tab" data-view="multi-monies" hidden>
      <aside class="editor-panel multi-editor-panel" aria-label="Multi Monies participant details">
        <div class="panel-heading multi-heading"><span class="step">04</span><div><h2>Multi Monies stories</h2><p>Create up to eight participant bubbles.</p></div></div>
        <form id="multi-monies-form">
          <div class="field-group">
            <div class="label-row"><label for="bubble-count">Number of bubbles</label><span class="optional-label">Maximum 8</span></div>
            <select id="bubble-count" name="bubble-count" aria-describedby="bubble-count-hint">
              ${Array.from({ length: 8 }, (_, index) => `<option value="${index + 1}"${index === 1 ? ' selected' : ''}>${index + 1} ${index === 0 ? 'bubble' : 'bubbles'}</option>`).join('')}
            </select>
            <p class="field-hint" id="bubble-count-hint">Participant editors and preview bubbles update instantly.</p>
          </div>
          <div class="speaker-editors" id="speaker-editors"></div>
          <div class="format-note multi-note"><span aria-hidden="true">8×</span><p><strong>U.S. Letter output</strong>Downloads at 2550 × 3300 pixels. Every selected participant must have a photo.</p></div>
          <div class="actions">
            <button class="button button-primary" type="submit"><span>Download Multi Monies</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/></svg></button>
            <button class="button button-secondary" type="button" id="multi-monies-reset">Reset</button>
          </div>
        </form>
      </aside>
      <section class="preview-panel" aria-labelledby="multi-monies-preview-title">
        <div class="preview-heading"><div><span class="step">04</span><h2 id="multi-monies-preview-title">Live preview</h2></div><span class="size-badge">2550 × 3300 px · U.S. Letter</span></div>
        <div class="canvas-shell letter-canvas"><canvas class="is-ready" id="multi-monies-canvas" width="2550" height="3300" aria-label="Preview of the Multi Monies U.S. Letter participant flyer"></canvas></div>
        <div class="preview-footer"><p><span aria-hidden="true">✓</span> Up to 8 bubbles</p><p><span aria-hidden="true">✓</span> Editable portraits</p><p><span aria-hidden="true">✓</span> 300 DPI letter size</p></div>
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
const certificateCanvas = document.querySelector('#certificate-canvas');
const certificateCtx = certificateCanvas.getContext('2d');
const multiMoniesCanvas = document.querySelector('#multi-monies-canvas');
const multiMoniesCtx = multiMoniesCanvas.getContext('2d');
const openHouseTemplate = new Image();
const toastmastersLogo = new Image();
const certificateTemplate = new Image();
let openHouseTemplateReady = false;
let toastmastersLogoReady = false;
let certificateTemplateReady = false;
let participantImage = null;
let participantImageUrl = '';
let activeFlyer = 'open-house';
let multiBubbleCount = 2;
let multiEntries = createMultiEntries();
const unlockedProtectedFlyers = new Set();
let pendingFlyer = 'testimonial';

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

function fitCompleteTextBlock(ctx, text, maxWidth, maxHeight, maxSize, family, weight = 400, lineHeightRatio = 1.28) {
  const hardMinimum = 12;
  for (let size = maxSize; size >= hardMinimum; size -= 1) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = size * lineHeightRatio;
    if (lines.length * lineHeight <= maxHeight) return { lines, size, lineHeight };
  }

  ctx.font = `${weight} ${hardMinimum}px ${family}`;
  return {
    lines: wrapText(ctx, text, maxWidth),
    size: hardMinimum,
    lineHeight: hardMinimum * lineHeightRatio,
  };
}

function drawOpenHouseClubName(clubName) {
  if (!clubName) return;
  const family = BRAND_HEADING_FONT;
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
  const family = BRAND_BODY_FONT;
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

  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(559, 75);
  ctx.lineTo(559, 190);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = `800 43px ${BRAND_HEADING_FONT}`;
  ctx.fillText('TOASTMASTERS', 589, 130);

  ctx.font = `500 22px ${BRAND_HEADING_FONT}`;
  drawLetterSpacedText(ctx, 'INTERNATIONAL', 753, 177, 5.3);
  ctx.restore();
}

function drawTestimonialBackground(ctx) {
  ctx.fillStyle = '#004165';
  ctx.fillRect(0, 0, TESTIMONIAL_SIZE, TESTIMONIAL_SIZE);
  ctx.fillStyle = '#772432';
  ctx.beginPath(); ctx.moveTo(0, 350); ctx.bezierCurveTo(100, 600, 310, 740, 570, 845); ctx.bezierCurveTo(850, 958, 1050, 990, 1254, 825); ctx.lineTo(1254, 1254); ctx.lineTo(0, 1254); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#F2DF74'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-12, 321); ctx.bezierCurveTo(92, 584, 315, 733, 577, 837); ctx.bezierCurveTo(860, 951, 1061, 972, 1262, 806); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,65,101,.9)'; ctx.lineWidth = 17;
  ctx.beginPath(); ctx.moveTo(-12, 344); ctx.bezierCurveTo(92, 600, 304, 754, 571, 860); ctx.stroke();
  drawDots(ctx, 1000, 10, 15, 25, 17, '#A9B2B1', 1);
  drawDots(ctx, 0, 934, 19, 20, 17, '#A9B2B1', -1);
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
  roundedRect(ctx, 310, 438, 824, 700, 55); ctx.fill();
  ctx.beginPath(); ctx.moveTo(725, 1120); ctx.lineTo(706, 1210); ctx.lineTo(845, 1131); ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawTestimonialText(ctx, values) {
  const family = BRAND_BODY_FONT;
  ctx.save(); ctx.fillStyle = '#772432'; ctx.font = `800 108px ${family}`; ctx.fillText('“', 507, 594);
  const quoteFit = fitCompleteTextBlock(ctx, values.testimonial, 500, 285, 45, family, 400);
  const quoteLineHeight = quoteFit.lineHeight;
  ctx.fillStyle = '#101114'; ctx.font = `400 ${quoteFit.size}px ${family}`; ctx.textAlign = 'left';
  let quoteY = 615;
  quoteFit.lines.forEach((line) => { ctx.fillText(line, 568, quoteY); quoteY += quoteLineHeight; });
  const finalQuoteLineWidth = ctx.measureText(quoteFit.lines.at(-1) || '').width;
  ctx.fillStyle = '#772432'; ctx.font = `700 ${Math.max(35, quoteFit.size)}px ${family}`;
  ctx.fillText('”', 568 + finalQuoteLineWidth + 14, quoteY - quoteLineHeight + 2);
  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(568, 928);
  ctx.lineTo(690, 928);
  ctx.stroke();
  const nameFit = fitLines(ctx, values.participantName.toUpperCase(), 510, 2, 40, 27, BRAND_HEADING_FONT, 800);
  ctx.fillStyle = '#004165'; ctx.font = `800 ${nameFit.size}px ${BRAND_HEADING_FONT}`;
  const nameLineHeight = nameFit.size * 1.08;
  const nameStartY = 982;
  let nameY = nameStartY;
  nameFit.lines.forEach((line) => { ctx.fillText(line, 568, nameY); nameY += nameLineHeight; });
  const roleFit = fitLines(ctx, values.designation, 510, 2, 27, 19, family, 400);
  ctx.fillStyle = '#15161a'; ctx.font = `400 ${roleFit.size}px ${family}`;
  const lastNameBaseline = nameStartY + Math.max(0, nameFit.lines.length - 1) * nameLineHeight;
  let roleY = lastNameBaseline + roleFit.size * 1.2 + 14;
  roleFit.lines.forEach((line) => { ctx.fillText(line, 568, roleY); roleY += roleFit.size * 1.14; });
  ctx.restore();
}

function renderTestimonial() {
  const values = valuesFromFields(testimonialFields);
  testimonialCtx.clearRect(0, 0, TESTIMONIAL_SIZE, TESTIMONIAL_SIZE);
  drawTestimonialBackground(testimonialCtx);
  drawToastmastersLockup(testimonialCtx);
  testimonialCtx.save();
  testimonialCtx.font = `800 92px ${BRAND_HEADING_FONT}`;
  testimonialCtx.textAlign = 'left';
  const titleFirst = 'TOASTI';
  const titleSecond = 'MONIES';
  const titleFirstWidth = testimonialCtx.measureText(titleFirst).width;
  const titleWidth = titleFirstWidth + testimonialCtx.measureText(titleSecond).width;
  const titleStartX = (TESTIMONIAL_SIZE - titleWidth) / 2;
  testimonialCtx.fillStyle = '#fff'; testimonialCtx.fillText(titleFirst, titleStartX, 323);
  testimonialCtx.save();
  testimonialCtx.fillStyle = '#772432';
  testimonialCtx.strokeStyle = '#F2DF74';
  testimonialCtx.lineWidth = 3;
  testimonialCtx.lineJoin = 'round';
  testimonialCtx.shadowColor = 'rgba(242,223,116,.42)';
  testimonialCtx.shadowBlur = 10;
  testimonialCtx.strokeText(titleSecond, titleStartX + titleFirstWidth - 1, 323);
  testimonialCtx.fillText(titleSecond, titleStartX + titleFirstWidth - 1, 323);
  testimonialCtx.restore();
  testimonialCtx.strokeStyle = '#F2DF74'; testimonialCtx.lineWidth = 2; testimonialCtx.beginPath(); testimonialCtx.moveTo(179, 370); testimonialCtx.lineTo(267, 370); testimonialCtx.moveTo(1031, 370); testimonialCtx.lineTo(1125, 370); testimonialCtx.stroke();
  testimonialCtx.fillStyle = '#F2DF74'; testimonialCtx.font = `800 29px ${BRAND_HEADING_FONT}`; drawLetterSpacedText(testimonialCtx, 'STRONG CLUBS  •  STRONGER TOGETHER', 653, 382, 4.2); testimonialCtx.restore();
  drawTestimonialCard(testimonialCtx);
  drawParticipantPhoto(testimonialCtx);
  drawTestimonialText(testimonialCtx, values);
  testimonialCtx.save(); testimonialCtx.fillStyle = '#fff'; testimonialCtx.font = `800 35px ${BRAND_HEADING_FONT}`; drawLetterSpacedText(testimonialCtx, 'CGD TEAM', 1080, 1180, 2.2); testimonialCtx.fillStyle = '#F2DF74'; testimonialCtx.font = `800 24px ${BRAND_HEADING_FONT}`; drawLetterSpacedText(testimonialCtx, 'DISTRICT 86', 1092, 1213, 2); testimonialCtx.font = `800 17px ${BRAND_HEADING_FONT}`; drawLetterSpacedText(testimonialCtx, '2026-2027', 1092, 1241, 1.8); testimonialCtx.restore();
}

function renderCertificate() {
  if (!certificateTemplateReady) return;
  const { certificateName } = valuesFromFields(certificateFields);
  certificateCtx.clearRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
  certificateCtx.drawImage(certificateTemplate, 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

  // Stretch a clean strip of the original paper texture over only the template name.
  // Everything else—including both signatures—remains untouched source artwork.
  certificateCtx.drawImage(certificateTemplate, 470, 474, 900, 18, 470, 493, 900, 108);

  if (!certificateName) return;
  const nameFamily = BRAND_HEADING_FONT;
  const nameFit = fitLines(certificateCtx, certificateName.toUpperCase(), 830, 1, 78, 28, nameFamily, 500);
  certificateCtx.save();
  certificateCtx.fillStyle = '#082b5b';
  certificateCtx.font = `500 ${nameFit.size}px ${nameFamily}`;
  certificateCtx.textAlign = 'center';
  certificateCtx.textBaseline = 'alphabetic';
  certificateCtx.fillText(nameFit.lines[0] || '', 927, 580);
  certificateCtx.restore();
}

function drawMultiMoniesBackground(ctx) {
  ctx.fillStyle = '#004165';
  ctx.fillRect(0, 0, MULTI_MONIES_WIDTH, MULTI_MONIES_HEIGHT);

  ctx.fillStyle = '#772432';
  ctx.beginPath();
  ctx.moveTo(0, 820);
  ctx.bezierCurveTo(330, 1380, 860, 1710, 1430, 1940);
  ctx.bezierCurveTo(1940, 2140, 2280, 2130, MULTI_MONIES_WIDTH, 1810);
  ctx.lineTo(MULTI_MONIES_WIDTH, MULTI_MONIES_HEIGHT);
  ctx.lineTo(0, MULTI_MONIES_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(-20, 755);
  ctx.bezierCurveTo(320, 1335, 870, 1665, 1445, 1895);
  ctx.bezierCurveTo(1945, 2095, 2270, 2090, MULTI_MONIES_WIDTH + 20, 1745);
  ctx.stroke();

  ctx.strokeStyle = '#004165';
  ctx.lineWidth = 34;
  ctx.beginPath();
  ctx.moveTo(-20, 805);
  ctx.bezierCurveTo(320, 1380, 855, 1715, 1425, 1945);
  ctx.stroke();

  drawDots(ctx, 2070, 10, 29, 36, 20, '#A9B2B1', 1);
  drawDots(ctx, 0, 2580, 35, 36, 22, '#A9B2B1', -1);
}

function drawMultiMoniesHeader(ctx) {
  ctx.save();
  if (toastmastersLogoReady) ctx.drawImage(toastmastersLogo, 665, 62, 300, 300);

  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(1015, 115);
  ctx.lineTo(1015, 320);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = `800 78px ${BRAND_HEADING_FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText('TOASTMASTERS', 1070, 220);
  ctx.font = `500 41px ${BRAND_HEADING_FONT}`;
  drawLetterSpacedText(ctx, 'INTERNATIONAL', 1400, 304, 10);

  ctx.font = `800 174px ${BRAND_HEADING_FONT}`;
  const titleFirst = 'TOASTI';
  const titleSecond = 'MONIES';
  const firstWidth = ctx.measureText(titleFirst).width;
  const totalWidth = firstWidth + ctx.measureText(titleSecond).width;
  const startX = (MULTI_MONIES_WIDTH - totalWidth) / 2;
  ctx.fillStyle = '#fff';
  ctx.fillText(titleFirst, startX, 540);
  ctx.save();
  ctx.fillStyle = '#772432';
  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(242,223,116,.42)';
  ctx.shadowBlur = 18;
  ctx.strokeText(titleSecond, startX + firstWidth - 2, 540);
  ctx.fillText(titleSecond, startX + firstWidth - 2, 540);
  ctx.restore();

  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(360, 642);
  ctx.lineTo(560, 642);
  ctx.moveTo(1990, 642);
  ctx.lineTo(2190, 642);
  ctx.stroke();
  ctx.fillStyle = '#F2DF74';
  ctx.font = `800 54px ${BRAND_HEADING_FONT}`;
  drawLetterSpacedText(ctx, 'STRONG CLUBS  •  STRONGER TOGETHER', MULTI_MONIES_WIDTH / 2, 660, 8);
  ctx.restore();
}

function drawMultiParticipantPhoto(ctx, entry, centerX, centerY, radius) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.24)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
  if (entry.image) {
    const sourceSize = Math.min(entry.image.naturalWidth, entry.image.naturalHeight) / (entry.zoom / 100);
    const sourceX = (entry.image.naturalWidth - sourceSize) / 2;
    const sourceY = (entry.image.naturalHeight - sourceSize) / 2;
    ctx.drawImage(entry.image, sourceX, sourceY, sourceSize, sourceSize, centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else {
    drawPhotoPlaceholder(ctx, centerX, centerY, radius);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function traceSmoothBlob(ctx, x, y, width, height, lobes = 12, variation = .08) {
  const points = Array.from({ length: lobes }, (_, index) => {
    const angle = (Math.PI * 2 * index) / lobes;
    const ripple = 1 + variation * Math.sin(index * 4.7 + lobes);
    return {
      x: x + width / 2 + Math.cos(angle) * width * .49 * ripple,
      y: y + height / 2 + Math.sin(angle) * height * .48 * ripple,
    };
  });
  const midpoint = (first, second) => ({ x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 });
  const firstMidpoint = midpoint(points.at(-1), points[0]);
  ctx.beginPath();
  ctx.moveTo(firstMidpoint.x, firstMidpoint.y);
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const nextMidpoint = midpoint(point, next);
    ctx.quadraticCurveTo(point.x, point.y, nextMidpoint.x, nextMidpoint.y);
  });
  ctx.closePath();
}

function traceStarburst(ctx, x, y, width, height, points = 18) {
  ctx.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const angle = -Math.PI / 2 + (Math.PI * index) / points;
    const radius = index % 2 === 0 ? 1 : .79;
    const pointX = x + width / 2 + Math.cos(angle) * width * .5 * radius;
    const pointY = y + height / 2 + Math.sin(angle) * height * .5 * radius;
    if (index === 0) ctx.moveTo(pointX, pointY);
    else ctx.lineTo(pointX, pointY);
  }
  ctx.closePath();
}

function fillAndOutlineBubble(ctx) {
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,65,101,.28)';
  ctx.lineWidth = 5;
  ctx.stroke();
}

function drawMultiBubbleShape(ctx, bubbleIndex, x, y, width, height) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.22)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 15;

  switch (bubbleIndex) {
    case 0:
      ctx.beginPath();
      ctx.moveTo(x + width * .62, y + height - 36);
      ctx.lineTo(x + width * .62, y + height + Math.min(42, height * .09));
      ctx.lineTo(x + width * .7, y + height - 30);
      ctx.closePath();
      fillAndOutlineBubble(ctx);
      roundedRect(ctx, x, y, width, height, Math.min(55, height * .1));
      fillAndOutlineBubble(ctx);
      break;
    case 1:
      ctx.beginPath();
      ctx.moveTo(x + width * .2, y + height * .69);
      ctx.lineTo(x + width * .07, y + height * .95);
      ctx.lineTo(x + width * .34, y + height * .8);
      ctx.closePath();
      fillAndOutlineBubble(ctx);
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      fillAndOutlineBubble(ctx);
      break;
    case 2:
      traceSmoothBlob(ctx, x, y, width, height, 16, .09);
      fillAndOutlineBubble(ctx);
      [
        { radius: 18, offsetX: 0, offsetY: height * .91 },
        { radius: 10, offsetX: 24, offsetY: height * .955 },
        { radius: 5, offsetX: 40, offsetY: height * .985 },
      ].forEach(({ radius, offsetX, offsetY }) => {
        ctx.beginPath();
        ctx.arc(x + width * .73 + offsetX, y + offsetY, radius, 0, Math.PI * 2);
        fillAndOutlineBubble(ctx);
      });
      break;
    case 3:
      traceStarburst(ctx, x, y, width, height, 19);
      fillAndOutlineBubble(ctx);
      break;
    case 4:
      ctx.beginPath();
      ctx.moveTo(x + width - 72, y + height * .39);
      ctx.lineTo(x + width + 18, y + height * .5);
      ctx.lineTo(x + width - 72, y + height * .61);
      ctx.closePath();
      fillAndOutlineBubble(ctx);
      roundedRect(ctx, x, y, width - 35, height, Math.min(85, height * .18));
      fillAndOutlineBubble(ctx);
      break;
    case 5:
      ctx.beginPath();
      ctx.moveTo(x + width * .18, y);
      ctx.quadraticCurveTo(x, y, x, y + height * .24);
      ctx.lineTo(x, y + height * .68);
      ctx.quadraticCurveTo(x, y + height, x + width * .26, y + height);
      ctx.lineTo(x + width * .48, y + height);
      ctx.lineTo(x + width * .57, y + height + Math.min(58, height * .13));
      ctx.lineTo(x + width * .66, y + height);
      ctx.lineTo(x + width * .79, y + height);
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height * .72);
      ctx.lineTo(x + width, y + height * .25);
      ctx.quadraticCurveTo(x + width, y, x + width * .8, y);
      ctx.closePath();
      fillAndOutlineBubble(ctx);
      break;
    case 6:
      ctx.beginPath();
      ctx.moveTo(x + 48, y);
      ctx.lineTo(x + width - 75, y);
      ctx.lineTo(x + width, y + 72);
      ctx.lineTo(x + width, y + height - 55);
      ctx.lineTo(x + width - 58, y + height);
      ctx.lineTo(x + width * .36, y + height);
      ctx.lineTo(x + width * .22, y + height + Math.min(58, height * .13));
      ctx.lineTo(x + width * .25, y + height);
      ctx.lineTo(x + 58, y + height);
      ctx.lineTo(x, y + height - 62);
      ctx.lineTo(x, y + 52);
      ctx.closePath();
      fillAndOutlineBubble(ctx);
      break;
    default:
      ctx.beginPath();
      ctx.moveTo(x + width * .7, y + height * .79);
      ctx.quadraticCurveTo(x + width * .79, y + height + 12, x + width * .86, y + height + 15);
      ctx.quadraticCurveTo(x + width * .8, y + height * .89, x + width * .68, y + height * .87);
      ctx.closePath();
      fillAndOutlineBubble(ctx);
      traceSmoothBlob(ctx, x, y, width, height, 11, .13);
      fillAndOutlineBubble(ctx);
      break;
  }
  ctx.restore();
}

function drawMultiBubble(ctx, entry, bubbleIndex, x, y, width, height, columns) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(entry.tilt);
  ctx.translate(-(x + width / 2), -(y + height / 2));
  drawMultiBubbleShape(ctx, bubbleIndex, x, y, width, height);

  const photoRadius = columns === 1 ? Math.min(245, height * .25) : Math.min(150, height * .28);
  const photoSide = columns === 2
    ? (x < MULTI_MONIES_WIDTH / 2 ? 'left' : 'right')
    : (bubbleIndex % 2 === 0 ? 'left' : 'right');
  const photoCenterX = photoSide === 'left' ? x + 8 : x + width - 8;
  const photoCenterY = y + height / 2;
  drawMultiParticipantPhoto(ctx, entry, photoCenterX, photoCenterY, photoRadius);

  const horizontalInsetRatios = [.05, .2, .13, .18, .08, .1, .11, .15];
  const verticalInsetRatios = [.08, .17, .13, .18, .1, .12, .12, .15];
  const shapeInsetX = width * horizontalInsetRatios[bubbleIndex];
  const shapeInsetY = height * verticalInsetRatios[bubbleIndex];
  const photoSafeLeft = photoSide === 'left' ? x + photoRadius + 78 : x + 58;
  const photoSafeRight = photoSide === 'left' ? x + width - 58 : x + width - photoRadius - 78;
  const safeLeft = Math.max(photoSafeLeft, x + shapeInsetX);
  const safeRight = Math.min(photoSafeRight, x + width - shapeInsetX);
  const safeTop = y + shapeInsetY;
  const safeBottom = y + height - shapeInsetY;
  const safeWidth = Math.max(180, safeRight - safeLeft);
  const safeHeight = Math.max(180, safeBottom - safeTop);
  const attributionHeight = Math.min(118, safeHeight * .34);
  const dividerY = safeBottom - attributionHeight;
  const commentTop = safeTop + 16;
  const commentBottom = dividerY - 22;
  const commentHeight = Math.max(75, commentBottom - commentTop);
  const maxCommentSize = columns === 1 ? 55 : 34;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const quoteSize = columns === 1 ? 56 : 34;
  const quoteReserve = quoteSize * 1.5;
  const commentTextWidth = Math.max(140, safeWidth - quoteReserve - 24);
  const commentFit = fitCompleteTextBlock(ctx, entry.comment, commentTextWidth, commentHeight, maxCommentSize, BRAND_BODY_FONT, 400, 1.2);
  const commentBlockHeight = commentFit.lines.length * commentFit.lineHeight;
  const commentCenterX = (safeLeft + safeRight) / 2;
  const firstLineY = commentTop + (commentHeight - commentBlockHeight) / 2 + commentFit.lineHeight / 2;
  let commentY = firstLineY;
  ctx.fillStyle = '#15161a';
  ctx.font = `400 ${commentFit.size}px ${BRAND_BODY_FONT}`;
  commentFit.lines.forEach((line) => {
    ctx.fillText(line, commentCenterX, commentY, commentTextWidth);
    commentY += commentFit.lineHeight;
  });

  const firstLine = commentFit.lines[0] || '';
  const lastLine = commentFit.lines.at(-1) || '';
  const lastLineY = firstLineY + Math.max(0, commentFit.lines.length - 1) * commentFit.lineHeight;
  ctx.font = `400 ${commentFit.size}px ${BRAND_BODY_FONT}`;
  const firstLineWidth = Math.min(ctx.measureText(firstLine).width, commentTextWidth);
  const lastLineWidth = Math.min(ctx.measureText(lastLine).width, commentTextWidth);
  ctx.fillStyle = '#772432';
  ctx.font = `800 ${quoteSize}px ${BRAND_BODY_FONT}`;
  const quoteWidth = Math.max(ctx.measureText('“').width, ctx.measureText('”').width);
  const quoteGap = Math.max(3, commentFit.size * .12);
  const openingQuoteX = Math.max(
    safeLeft + quoteWidth / 2 + 4,
    commentCenterX - firstLineWidth / 2 - quoteGap - quoteWidth / 2,
  );
  const closingQuoteX = Math.min(
    safeRight - quoteWidth / 2 - 4,
    commentCenterX + lastLineWidth / 2 + quoteGap + quoteWidth / 2,
  );
  const quoteLift = Math.min(quoteSize * .12, commentFit.lineHeight * .12);
  ctx.fillText('“', openingQuoteX, firstLineY - quoteLift);
  ctx.fillText('”', closingQuoteX, lastLineY - quoteLift);

  ctx.strokeStyle = '#F2DF74';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const dividerWidth = Math.min(150, safeWidth * .27);
  ctx.moveTo(commentCenterX - dividerWidth / 2, dividerY);
  ctx.lineTo(commentCenterX + dividerWidth / 2, dividerY);
  ctx.stroke();

  const nameFit = fitLines(ctx, entry.name.toUpperCase(), safeWidth - 20, 1, columns === 1 ? 43 : 31, 17, BRAND_HEADING_FONT, 800);
  ctx.fillStyle = '#004165';
  ctx.font = `800 ${nameFit.size}px ${BRAND_HEADING_FONT}`;
  ctx.fillText(nameFit.lines[0] || '', commentCenterX, dividerY + attributionHeight * .38, safeWidth - 20);

  const roleFit = fitLines(ctx, entry.designation, safeWidth - 20, 1, columns === 1 ? 28 : 21, 13, BRAND_BODY_FONT, 400);
  ctx.fillStyle = '#15161a';
  ctx.font = `400 ${roleFit.size}px ${BRAND_BODY_FONT}`;
  ctx.fillText(roleFit.lines[0] || '', commentCenterX, dividerY + attributionHeight * .74, safeWidth - 20);
  ctx.restore();
  ctx.restore();
}

function renderMultiMonies() {
  multiMoniesCtx.clearRect(0, 0, MULTI_MONIES_WIDTH, MULTI_MONIES_HEIGHT);
  drawMultiMoniesBackground(multiMoniesCtx);
  drawMultiMoniesHeader(multiMoniesCtx);

  const columns = multiBubbleCount <= 2 ? 1 : 2;
  const rows = Math.ceil(multiBubbleCount / columns);
  const horizontalMargin = columns === 1 ? 285 : 170;
  const columnGap = 110;
  const rowGap = 72;
  const contentTop = 780;
  const contentBottom = 2930;
  const cardWidth = columns === 1
    ? MULTI_MONIES_WIDTH - horizontalMargin * 2
    : (MULTI_MONIES_WIDTH - horizontalMargin * 2 - columnGap) / 2;
  const cardHeight = (contentBottom - contentTop - rowGap * (rows - 1)) / rows;

  multiEntries.slice(0, multiBubbleCount).forEach((entry, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const isUnpairedLastCard = columns === 2 && index === multiBubbleCount - 1 && multiBubbleCount % 2 === 1;
    const x = isUnpairedLastCard
      ? (MULTI_MONIES_WIDTH - cardWidth) / 2
      : horizontalMargin + column * (cardWidth + columnGap);
    const y = contentTop + row * (cardHeight + rowGap);
    drawMultiBubble(multiMoniesCtx, entry, index, x, y, cardWidth, cardHeight, columns);
  });

  multiMoniesCtx.save();
  multiMoniesCtx.fillStyle = '#fff';
  multiMoniesCtx.font = `800 58px ${BRAND_HEADING_FONT}`;
  drawLetterSpacedText(multiMoniesCtx, 'CGD TEAM', 2160, 3095, 4);
  multiMoniesCtx.fillStyle = '#F2DF74';
  multiMoniesCtx.font = `800 41px ${BRAND_HEADING_FONT}`;
  drawLetterSpacedText(multiMoniesCtx, 'DISTRICT 86', 2190, 3160, 4);
  multiMoniesCtx.font = `800 29px ${BRAND_HEADING_FONT}`;
  drawLetterSpacedText(multiMoniesCtx, '2026-2027', 2190, 3212, 3);
  multiMoniesCtx.restore();
}

function multiEditorMarkup(entry, index, isOpen) {
  const number = index + 1;
  return `
    <details class="speaker-editor" data-speaker="${index}"${isOpen ? ' open' : ''}>
      <summary><span>Participant ${number}</span><small>Photo, story and attribution</small></summary>
      <div class="speaker-editor-body">
        <div class="field-group">
          <div class="label-row"><label for="multi-photo-${index}">Participant photo</label><span class="optional-label">Required · JPG, PNG or WebP</span></div>
          <label class="photo-picker compact-photo-picker" for="multi-photo-${index}">
            <span class="photo-picker-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 16.5V19h16v-2.5M12 4v10m0-10 4 4m-4-4L8 8"/></svg></span>
            <span><strong id="multi-photo-title-${index}">${entry.image ? 'Change portrait' : 'Choose a portrait'}</strong><small id="multi-photo-name-${index}">${escapeHtml(entry.fileName || 'Centred and cropped to a circle.')}</small></span>
          </label>
          <input class="visually-hidden" id="multi-photo-${index}" type="file" accept="image/png,image/jpeg,image/webp">
          <div class="photo-tools" id="multi-photo-tools-${index}"${entry.image ? '' : ' hidden'}>
            <label for="multi-zoom-${index}">Photo zoom</label><input id="multi-zoom-${index}" type="range" min="100" max="190" value="${entry.zoom}" aria-label="Participant ${number} photo zoom"><button class="text-button" id="multi-remove-${index}" type="button">Remove</button>
          </div>
        </div>
        <div class="field-group">
          <div class="label-row"><label for="multi-comment-${index}">Testimonial</label><span class="counter" id="multi-comment-counter-${index}">${entry.comment.length} / 260</span></div>
          <textarea id="multi-comment-${index}" maxlength="260" required>${escapeHtml(entry.comment)}</textarea>
          <p class="field-hint">All 260 characters are fitted into this participant’s bubble.</p>
        </div>
        <div class="field-group">
          <div class="label-row"><label for="multi-name-${index}">Participant name</label><span class="counter">${entry.name.length} / 45</span></div>
          <input id="multi-name-${index}" type="text" maxlength="45" value="${escapeHtml(entry.name)}" required>
        </div>
        <div class="field-group">
          <div class="label-row"><label for="multi-designation-${index}">Designation / role</label><span class="counter">${entry.designation.length} / 65</span></div>
          <input id="multi-designation-${index}" type="text" maxlength="65" value="${escapeHtml(entry.designation)}" required>
        </div>
      </div>
    </details>
  `;
}

function clearMultiPhoto(index) {
  const entry = multiEntries[index];
  if (entry.imageUrl) URL.revokeObjectURL(entry.imageUrl);
  entry.imageUrl = '';
  entry.fileName = '';
  entry.image = null;
  entry.zoom = 100;
  const fileInput = document.querySelector(`#multi-photo-${index}`);
  if (fileInput) fileInput.value = '';
  const tools = document.querySelector(`#multi-photo-tools-${index}`);
  if (tools) tools.hidden = true;
  const title = document.querySelector(`#multi-photo-title-${index}`);
  const fileName = document.querySelector(`#multi-photo-name-${index}`);
  if (title) title.textContent = 'Choose a portrait';
  if (fileName) fileName.textContent = 'Centred and cropped to a circle.';
  renderMultiMonies();
}

function renderMultiEditors() {
  const container = document.querySelector('#speaker-editors');
  const previouslyOpen = new Set(
    [...container.querySelectorAll('details[open]')].map((details) => Number(details.dataset.speaker)),
  );
  container.innerHTML = multiEntries
    .slice(0, multiBubbleCount)
    .map((entry, index) => multiEditorMarkup(entry, index, previouslyOpen.has(index) || (previouslyOpen.size === 0 && index === 0)))
    .join('');

  multiEntries.slice(0, multiBubbleCount).forEach((entry, index) => {
    const comment = document.querySelector(`#multi-comment-${index}`);
    const name = document.querySelector(`#multi-name-${index}`);
    const designation = document.querySelector(`#multi-designation-${index}`);
    const zoom = document.querySelector(`#multi-zoom-${index}`);
    const photo = document.querySelector(`#multi-photo-${index}`);

    comment.addEventListener('input', () => {
      entry.comment = comment.value;
      const counter = document.querySelector(`#multi-comment-counter-${index}`);
      counter.textContent = `${comment.value.length} / 260`;
      counter.classList.toggle('near-limit', comment.value.length >= 221);
      renderMultiMonies();
    });
    name.addEventListener('input', () => { entry.name = name.value; name.closest('.field-group').querySelector('.counter').textContent = `${name.value.length} / 45`; renderMultiMonies(); });
    designation.addEventListener('input', () => { entry.designation = designation.value; designation.closest('.field-group').querySelector('.counter').textContent = `${designation.value.length} / 65`; renderMultiMonies(); });
    zoom.addEventListener('input', () => { entry.zoom = Number(zoom.value); renderMultiMonies(); });
    document.querySelector(`#multi-remove-${index}`).addEventListener('click', () => clearMultiPhoto(index));

    photo.addEventListener('change', () => {
      const [file] = photo.files;
      if (!file) return;
      if (entry.imageUrl) URL.revokeObjectURL(entry.imageUrl);
      entry.imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        entry.image = image;
        entry.fileName = file.name;
        document.querySelector(`#multi-photo-tools-${index}`).hidden = false;
        document.querySelector(`#multi-photo-title-${index}`).textContent = 'Change portrait';
        document.querySelector(`#multi-photo-name-${index}`).textContent = file.name;
        renderMultiMonies();
      };
      image.onerror = () => {
        clearMultiPhoto(index);
        showToast('That image could not be opened. Please try another file.');
      };
      image.src = entry.imageUrl;
    });
  });
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

function downloadCanvas(canvas, filename, message = 'Your flyer has been downloaded.') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast(message);
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
  if (nextFlyer === 'certificate') renderCertificate();
  if (nextFlyer === 'multi-monies') renderMultiMonies();
}

function closeTestimonialGate() {
  document.querySelector('#testimonial-gate').hidden = true;
  document.body.classList.remove('dialog-open');
  document.querySelector('#password-error').textContent = '';
  document.querySelector(`[data-tab="${pendingFlyer}"]`).focus();
}

function requestFlyer(nextFlyer) {
  if (!PROTECTED_FLYERS.has(nextFlyer) || unlockedProtectedFlyers.has(nextFlyer)) {
    switchFlyer(nextFlyer);
    return;
  }

  pendingFlyer = nextFlyer;
  const gate = document.querySelector('#testimonial-gate');
  const passwordInput = document.querySelector('#testimonial-password');
  const flyerLabel = nextFlyer === 'certificate' ? 'Certificates' : nextFlyer === 'multi-monies' ? 'Multi Monies' : 'Testimonials';
  document.querySelector('#gate-title').textContent = `Unlock ${flyerLabel}`;
  document.querySelector('#gate-description').textContent = `Enter the password to open the ${flyerLabel.toLowerCase()} editor.`;
  gate.hidden = false;
  document.body.classList.add('dialog-open');
  passwordInput.value = '';
  document.querySelector('#password-error').textContent = '';
  window.requestAnimationFrame(() => passwordInput.focus());
}

bindFields(openHouseFields, renderOpenHouse);
bindFields(testimonialFields, renderTestimonial);
bindFields(certificateFields, renderCertificate);
renderMultiEditors();

document.querySelectorAll('[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => requestFlyer(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll('[data-tab]')];
    const currentIndex = tabs.findIndex((candidate) => candidate.dataset.tab === activeFlyer);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(currentIndex + direction + tabs.length) % tabs.length].dataset.tab;
    requestFlyer(next);
    if (!PROTECTED_FLYERS.has(next) || unlockedProtectedFlyers.has(next)) document.querySelector(`[data-tab="${next}"]`).focus();
  });
});

document.querySelector('#testimonial-gate-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const passwordInput = document.querySelector('#testimonial-password');
  const expectedPassword = pendingFlyer === 'multi-monies' ? MULTI_MONIES_PASSWORD : TESTIMONIAL_PASSWORD;
  if (passwordInput.value === expectedPassword) {
    if (pendingFlyer === 'multi-monies') {
      unlockedProtectedFlyers.add('multi-monies');
    } else {
      unlockedProtectedFlyers.add('testimonial');
      unlockedProtectedFlyers.add('certificate');
    }
    const unlockedFlyer = pendingFlyer;
    closeTestimonialGate();
    switchFlyer(unlockedFlyer);
    document.querySelector(`[data-tab="${unlockedFlyer}"]`).focus();
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
  renderMultiMonies();
};

toastmastersLogo.onerror = () => {
  toastmastersLogoReady = false;
  showToast('The Toastmasters logo could not be loaded.');
};

toastmastersLogo.src = TOASTMASTERS_LOGO_URL;

certificateTemplate.onload = () => {
  certificateTemplateReady = true;
  document.querySelector('#certificate-loading').hidden = true;
  certificateCanvas.classList.add('is-ready');
  renderCertificate();
};

certificateTemplate.onerror = () => {
  const loading = document.querySelector('#certificate-loading');
  loading.innerHTML = '<strong>Certificate template could not be loaded.</strong><br>Please refresh the page.';
  loading.classList.add('error');
};

certificateTemplate.src = CERTIFICATE_TEMPLATE_URL;

document.querySelector('#open-house-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity() || !openHouseTemplateReady) return;
  await brandFontsReady;
  renderOpenHouse();
  downloadCanvas(openHouseCanvas, `${slugify(document.querySelector('#club').value, 'toastmasters-club')}-open-house.png`);
});

document.querySelector('#testimonial-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  await brandFontsReady;
  renderTestimonial();
  downloadCanvas(testimonialCanvas, `${slugify(document.querySelector('#participantName').value, 'participant')}-testimonial.png`);
});

document.querySelector('#certificate-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity() || !certificateTemplateReady) return;
  await brandFontsReady;
  renderCertificate();
  downloadCanvas(certificateCanvas, `${slugify(document.querySelector('#certificateName').value, 'participant')}-toastimonies-certificate.png`, 'Your certificate has been downloaded.');
});

document.querySelector('#multi-monies-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const missingPhotoIndex = multiEntries.slice(0, multiBubbleCount).findIndex((entry) => !entry.image);
  if (missingPhotoIndex !== -1) {
    const editor = document.querySelector(`[data-speaker="${missingPhotoIndex}"]`);
    const picker = editor.querySelector('.photo-picker');
    editor.open = true;
    picker.classList.add('has-error');
    picker.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => picker.classList.remove('has-error'), 2600);
    showToast(`Add a photo for Participant ${missingPhotoIndex + 1} before downloading.`);
    return;
  }
  await brandFontsReady;
  renderMultiMonies();
  downloadCanvas(multiMoniesCanvas, 'multi-monies-us-letter.png', 'Your Multi Monies flyer has been downloaded.');
});

document.querySelector('#open-house-reset').addEventListener('click', () => resetFields(openHouseFields, openHouseInitial, renderOpenHouse));
document.querySelector('#certificate-reset').addEventListener('click', () => resetFields(certificateFields, certificateInitial, renderCertificate));

document.querySelector('#bubble-count').addEventListener('change', (event) => {
  multiBubbleCount = Number(event.target.value);
  renderMultiEditors();
  renderMultiMonies();
});

document.querySelector('#multi-monies-reset').addEventListener('click', () => {
  multiEntries.forEach((entry) => {
    if (entry.imageUrl) URL.revokeObjectURL(entry.imageUrl);
  });
  multiEntries = createMultiEntries();
  multiBubbleCount = 2;
  document.querySelector('#bubble-count').value = '2';
  renderMultiEditors();
  renderMultiMonies();
  document.querySelector('#bubble-count').focus();
});

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
renderMultiMonies();
brandFontsReady.then(() => {
  renderOpenHouse();
  renderTestimonial();
  renderCertificate();
  renderMultiMonies();
});
