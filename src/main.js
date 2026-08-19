import './styles.css';

const TEMPLATE_URL = '/toastmasters-open-house-template.png';
const FLYER_WIDTH = 1003;
const FLYER_HEIGHT = 1568;

const initialValues = {
  club: 'Lakeshore Speakers Club',
  date: 'Saturday, September 12, 2026',
  time: '1:00 PM – 3:00 PM',
  location: 'Toronto Reference Library, 789 Yonge Street',
};

const fields = [
  {
    id: 'club',
    label: 'Club name',
    max: 70,
    hint: 'Shown prominently in the central space. Wraps to 3 lines.',
    placeholder: 'e.g. Lakeshore Speakers Club',
  },
  {
    id: 'date',
    label: 'Open house date',
    max: 35,
    hint: 'Use a friendly format, such as Saturday, September 12, 2026.',
    placeholder: 'e.g. Saturday, September 12, 2026',
  },
  {
    id: 'time',
    label: 'Time',
    max: 30,
    hint: 'Include the time zone when your guests may join online.',
    placeholder: 'e.g. 1:00 PM – 3:00 PM EDT',
  },
  {
    id: 'location',
    label: 'Location',
    max: 70,
    hint: 'Long addresses wrap automatically to 2 lines.',
    placeholder: 'e.g. Toronto Reference Library, 789 Yonge Street',
  },
];

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Toastmasters Flyer Studio home">
      <span class="brand-mark" aria-hidden="true">T</span>
      <span>
        <strong>Flyer Studio</strong>
        <small>Toastmasters Open House</small>
      </span>
    </a>
    <span class="topbar-note"><span class="status-dot"></span> Ready for Vercel</span>
  </header>

  <main>
    <section class="intro" aria-labelledby="page-title">
      <div>
        <p class="eyebrow">Create. Personalize. Invite.</p>
        <h1 id="page-title">Your club’s open house,<br><em>ready to share.</em></h1>
      </div>
      <p class="intro-copy">Add your event details and see them appear instantly on the official flyer. Your design stays in your browser until you download it.</p>
    </section>

    <section class="workspace">
      <aside class="editor-panel" aria-label="Flyer details">
        <div class="panel-heading">
          <span class="step">01</span>
          <div>
            <h2>Event details</h2>
            <p>All four fields appear on your flyer.</p>
          </div>
        </div>

        <form id="flyer-form">
          ${fields.map((field) => `
            <div class="field-group">
              <div class="label-row">
                <label for="${field.id}">${field.label}</label>
                <span class="counter" id="${field.id}-counter">${initialValues[field.id].length} / ${field.max}</span>
              </div>
              <input
                id="${field.id}"
                name="${field.id}"
                type="text"
                value="${initialValues[field.id]}"
                maxlength="${field.max}"
                placeholder="${field.placeholder}"
                autocomplete="off"
                aria-describedby="${field.id}-hint ${field.id}-counter"
                required
              />
              <p class="field-hint" id="${field.id}-hint">${field.hint}</p>
            </div>
          `).join('')}

          <div class="format-note">
            <span aria-hidden="true">Aa</span>
            <p><strong>Smart text fitting</strong>Font size and line breaks adjust automatically within the template’s safe areas.</p>
          </div>

          <div class="actions">
            <button class="button button-primary" type="submit" id="download-button">
              <span>Download PNG</span>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/></svg>
            </button>
            <button class="button button-secondary" type="button" id="reset-button">Reset</button>
          </div>
        </form>
      </aside>

      <section class="preview-panel" aria-labelledby="preview-title">
        <div class="preview-heading">
          <div>
            <span class="step">02</span>
            <h2 id="preview-title">Live preview</h2>
          </div>
          <span class="size-badge">1003 × 1568 px</span>
        </div>
        <div class="canvas-shell" id="canvas-shell">
          <div class="loading-state" id="loading-state"><span></span>Preparing your flyer…</div>
          <canvas id="flyer-canvas" width="1003" height="1568" aria-label="Preview of your personalized Toastmasters open house flyer"></canvas>
        </div>
        <div class="preview-footer">
          <p><span aria-hidden="true">✓</span> High-resolution PNG</p>
          <p><span aria-hidden="true">✓</span> Print & social ready</p>
          <p><span aria-hidden="true">✓</span> No data uploaded</p>
        </div>
      </section>
    </section>
  </main>

  <footer>
    <p>Built for stronger clubs and more confident voices.</p>
    <p>Flyer template artwork remains unchanged.</p>
  </footer>

  <div class="toast" id="toast" role="status" aria-live="polite">Your flyer has been downloaded.</div>
`;

const canvas = document.querySelector('#flyer-canvas');
const ctx = canvas.getContext('2d');
const form = document.querySelector('#flyer-form');
const loadingState = document.querySelector('#loading-state');
const template = new Image();
let templateReady = false;

function valuesFromForm() {
  return Object.fromEntries(fields.map(({ id }) => [id, document.querySelector(`#${id}`).value.trim()]));
}

function wrapAtCurrentSize(content, maxWidth) {
  const words = content.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) {
      lines.push(line);
      line = '';
    }

    if (ctx.measureText(word).width <= maxWidth) {
      line = word;
      continue;
    }

    let fragment = '';
    for (const character of [...word]) {
      const next = fragment + character;
      if (ctx.measureText(next).width > maxWidth && fragment) {
        lines.push(fragment);
        fragment = character;
      } else {
        fragment = next;
      }
    }
    line = fragment;
  }

  if (line) lines.push(line);
  return lines;
}

function fitLines(text, maxWidth, maxLines, fontSize, minFontSize, fontFamily, weight = 700) {
  const content = text || '';
  const hardMinimum = Math.min(12, minFontSize);

  for (let size = fontSize; size >= hardMinimum; size -= 1) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    const lines = wrapAtCurrentSize(content, maxWidth);
    if (lines.length <= maxLines) return { lines, size };
  }

  ctx.font = `${weight} ${hardMinimum}px ${fontFamily}`;
  const lines = wrapAtCurrentSize(content, maxWidth);
  if (lines.length > maxLines) {
    const visibleLines = lines.slice(0, maxLines);
    let lastLine = visibleLines[maxLines - 1] || '';
    while (ctx.measureText(`${lastLine}…`).width > maxWidth && lastLine.length) {
      lastLine = lastLine.slice(0, -1);
    }
    visibleLines[maxLines - 1] = `${lastLine}…`;
    return { lines: visibleLines, size: hardMinimum };
  }

  return { lines, size: hardMinimum };
}

function drawClubName(clubName) {
  if (!clubName) return;
  const family = '"Arial Narrow", "Roboto Condensed", Impact, sans-serif';
  const fitted = fitLines(clubName.toUpperCase(), 770, 3, 66, 34, family, 800);
  const lineHeight = fitted.size * 1.08;
  const blockHeight = fitted.lines.length * lineHeight;
  const centerY = 546;
  let y = centerY - blockHeight / 2 + lineHeight * 0.78;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `800 ${fitted.size}px ${family}`;
  ctx.fillStyle = '#08264c';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.94)';
  ctx.shadowBlur = 10;
  fitted.lines.forEach((line) => {
    ctx.fillText(line, FLYER_WIDTH / 2, y);
    y += lineHeight;
  });
  ctx.restore();

  const dividerWidth = Math.min(330, Math.max(180, fitted.size * 4.8));
  const dividerY = centerY + blockHeight / 2 + 21;
  ctx.save();
  ctx.strokeStyle = '#d59b31';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(FLYER_WIDTH / 2 - dividerWidth / 2, dividerY);
  ctx.lineTo(FLYER_WIDTH / 2 + dividerWidth / 2, dividerY);
  ctx.stroke();
  ctx.fillStyle = '#a50d24';
  ctx.beginPath();
  ctx.arc(FLYER_WIDTH / 2, dividerY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDetail(text, config) {
  if (!text) return;
  const family = '"Arial Narrow", "Roboto Condensed", Arial, sans-serif';
  const fitted = fitLines(text.toUpperCase(), config.width, config.maxLines, config.maxSize, config.minSize, family, 700);
  const lineHeight = fitted.size * 1.12;
  const blockHeight = fitted.lines.length * lineHeight;
  let y = config.centerY - blockHeight / 2 + lineHeight * 0.78;

  ctx.save();
  ctx.font = `700 ${fitted.size}px ${family}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#08264c';
  fitted.lines.forEach((line) => {
    ctx.fillText(line, config.x, y);
    y += lineHeight;
  });
  ctx.restore();
}

function renderFlyer() {
  if (!templateReady) return;
  const values = valuesFromForm();
  ctx.clearRect(0, 0, FLYER_WIDTH, FLYER_HEIGHT);
  ctx.drawImage(template, 0, 0, FLYER_WIDTH, FLYER_HEIGHT);

  drawClubName(values.club);
  drawDetail(values.date, { x: 444, centerY: 797, width: 455, maxLines: 2, maxSize: 32, minSize: 22 });
  drawDetail(values.time, { x: 444, centerY: 943, width: 455, maxLines: 2, maxSize: 34, minSize: 23 });
  drawDetail(values.location, { x: 480, centerY: 1088, width: 420, maxLines: 2, maxSize: 31, minSize: 21 });
}

function updateCounter(input) {
  const field = fields.find(({ id }) => id === input.id);
  const counter = document.querySelector(`#${input.id}-counter`);
  counter.textContent = `${input.value.length} / ${field.max}`;
  counter.classList.toggle('near-limit', input.value.length >= field.max * 0.85);
}

fields.forEach(({ id }) => {
  const input = document.querySelector(`#${id}`);
  input.addEventListener('input', () => {
    updateCounter(input);
    renderFlyer();
  });
});

template.onload = () => {
  templateReady = true;
  loadingState.hidden = true;
  canvas.classList.add('is-ready');
  renderFlyer();
};

template.onerror = () => {
  loadingState.innerHTML = '<strong>Template could not be loaded.</strong><br>Please refresh the page.';
  loadingState.classList.add('error');
};

template.src = TEMPLATE_URL;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity() || !templateReady) return;
  renderFlyer();

  const clubSlug = document.querySelector('#club').value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'toastmasters-club';
  const link = document.createElement('a');
  link.download = `${clubSlug}-open-house.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  const toast = document.querySelector('#toast');
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
});

document.querySelector('#reset-button').addEventListener('click', () => {
  fields.forEach(({ id }) => {
    const input = document.querySelector(`#${id}`);
    input.value = initialValues[id];
    updateCounter(input);
  });
  renderFlyer();
  document.querySelector('#club').focus();
});
