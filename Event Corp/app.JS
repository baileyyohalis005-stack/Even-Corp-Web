// Nav burger
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Nav scroll shadow
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.boxShadow =
    window.scrollY > 40 ? '0 4px 24px rgba(0,0,0,.35)' : 'none';
});

// Scroll reveal para how-steps
const howSteps = document.querySelectorAll('.how-step');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });
howSteps.forEach(s => revealObs.observe(s));

// Stagger reveal for cards
const revealCards = document.querySelectorAll('.prob-card, .testi-card-info, .role-card-info, .pricing-card');
revealCards.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = `opacity .5s ${i * 0.07}s, transform .5s ${i * 0.07}s`;
});
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
revealCards.forEach(el => cardObs.observe(el));

// Live Gold animation
function animateLG() {
  const fill = document.getElementById('lgFill');
  const cur = parseFloat(fill.style.width);
  if (cur >= 98) { fill.style.width = '50%'; return; }
  fill.style.width = Math.min(cur + 9, 98) + '%';
}

// Wizard AI demo
const WIZ_REPLIES = [
  "✨ Propongo un concepto <strong>Bohemian Luxe</strong> — tonos terracota, blanco marfil, verde salvia. Flores silvestres y velas flotantes. Catering farm-to-table con estaciones interactivas.",
  "🎵 Para ese ambiente: cuarteto de cuerdas en recepción + DJ lounge after 10PM. Proveedor recomendado: Generación.Live (★ 4.9, disponible tu fecha).",
  "📋 Contrato listo en The Vault — cláusula de cancelación 48h, depósito 30% al firmar, recargo nocturno 15%. ¿Lo genero ahora?",
  "💰 Presupuesto estimado para 120 personas: <strong>$18,400 – $22,000</strong> con los servicios que describes. Visible en Live Gold al detalle."
];
let wizIdx = 0;

function sendWiz(e) {
  if (e.key !== 'Enter') return;
  const inp = document.getElementById('wizInput');
  const msgs = document.getElementById('wizMsgs');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  msgs.innerHTML += `<div class="wz-user">${txt}</div>`;
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    msgs.innerHTML += `<div class="wz-ai">${WIZ_REPLIES[wizIdx % WIZ_REPLIES.length]}</div>`;
    wizIdx++;
    msgs.scrollTop = msgs.scrollHeight;
  }, 650);
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-drawer a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});


/* ============================================================
   LANGUAGE TOGGLE
============================================================ */
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;

  // Toggle buttons
  document.getElementById('btnES').classList.toggle('active', lang === 'es');
  document.getElementById('btnEN').classList.toggle('active', lang === 'en');

  // Update all elements with data-es / data-en
  document.querySelectorAll('[data-es]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (!txt) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = txt;
    } else {
      el.innerHTML = txt;
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update mobile drawer links too
  document.querySelectorAll('.mobile-drawer a[data-es]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
}

/* ============================================================
   QR CODE (using qrcode.js via CDN)
============================================================ */
let qrGenerated = false;
const QR_URL = window.location.href.split('#')[0];

function openQR() {
  document.getElementById('qrOverlay').classList.add('open');
  document.getElementById('qrUrl').textContent = QR_URL;
  if (!qrGenerated) generateQR();
}

function closeQR() {
  document.getElementById('qrOverlay').classList.remove('open');
}

function closeQROutside(e) {
  if (e.target === document.getElementById('qrOverlay')) closeQR();
}

function generateQR() {
  const canvas = document.getElementById('qrCanvas');
  const size = 220;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Load qrcode library dynamically
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  script.onload = () => {
    // Clear canvas approach — use div instead
    const tmp = document.createElement('div');
    tmp.style.display = 'none';
    document.body.appendChild(tmp);

    new QRCode(tmp, {
      text: QR_URL,
      width: size,
      height: size,
      colorDark: '#1B2B5E',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.H
    });

    // Copy generated image to canvas
    setTimeout(() => {
      const img = tmp.querySelector('img');
      if (img) {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
        };
        if (img.complete) ctx.drawImage(img, 0, 0, size, size);
      }
      document.body.removeChild(tmp);
    }, 200);
  };
  document.head.appendChild(script);
  qrGenerated = true;

  // Update modal text if lang is EN
  if (currentLang === 'en') {
    document.querySelectorAll('#qrModal [data-es]').forEach(el => {
      const txt = el.getAttribute('data-en');
      if (txt) el.innerHTML = txt;
    });
  }
}

function downloadQR() {
  const canvas = document.getElementById('qrCanvas');
  const link = document.createElement('a');
  link.download = 'eventcorp-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Keyboard ESC closes QR
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQR();
});
