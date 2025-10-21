// Gera icon-192.png e icon-512.png usando PureImage (sem dependências nativas)
// Uso:
//   npm init -y (se ainda não houver package.json)
//   npm install pureimage
//   node make-icons.js "JB Analise Loto" "#8BC34A" "#ffffff"
// Parâmetros: [TEXTO] [COR_FUNDO] [COR_TEXTO]

const fs = require('fs');
const path = require('path');
const PImage = require('pureimage');

const TEXT = process.argv[2] || 'Loto';
let BG = process.argv[3] || '#2196f3';
let FG = process.argv[4] || '#ffffff';

function validColor(c){ return typeof c === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c); }
if (!validColor(BG)) BG = '#8BC34A';
if (!validColor(FG)) FG = '#ffffff';

const outDir = __dirname;

async function makeIcon(size) {
  const img = PImage.make(size, size);
  const ctx = img.getContext('2d');

  // fundo
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, size, size);

  // círculo sutil
  ctx.fillStyle = shade(BG, -12);
  ctx.beginPath();
  ctx.arc(size/2, size/2, Math.floor(size*0.42), 0, Math.PI*2);
  ctx.fill();

  // Tentativa de usar fonte local opcional (se existir). Caso contrário, desenha monograma vetorial.
  const fontPath = path.join(__dirname, 'AppFont-Bold.ttf');
  if (fs.existsSync(fontPath)) {
    try {
      const fontSize = Math.floor(size * 0.24);
      const font = PImage.registerFont(fontPath, 'AppFont');
      await new Promise(res => font.load(() => res()));
      ctx.fillStyle = FG;
      ctx.font = `${fontSize}px AppFont`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(TEXT, size/2, size/2);
    } catch {
      drawMonogram(ctx, size, FG, TEXT);
    }
  } else {
    drawMonogram(ctx, size, FG, TEXT);
  }

  const outPath = path.join(outDir, `icon-${size}.png`);
  await PImage.encodePNGToStream(img, fs.createWriteStream(outPath));
  console.log('✓ Gerado', outPath);
}

function shade(col, amt) {
  if (!validColor(col)) return col;
  // col '#rrggbb'
  const n = parseInt(col.slice(1), 16);
  let r = (n >> 16) + amt;
  let g = ((n >> 8) & 0xff) + amt;
  let b = (n & 0xff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

(async () => {
  await makeIcon(192);
  await makeIcon(512);
})();

function drawMonogram(ctx, size, color, text) {
  const s = size;
  const pad = Math.floor(s * 0.18);
  const stroke = Math.max(6, Math.floor(s * 0.10));
  const midY = s / 2;
  const leftX = pad;
  const rightX = s - pad;
  const centerX = s / 2;

  ctx.fillStyle = color;

  // Normaliza para duas letras (iniciais)
  const t = (text || '').trim();
  const letters = t.length ? t.split(/\s+/).map(w => w[0]).join('').slice(0,2).toUpperCase() : 'JB';

  // Desenha 'J' à esquerda
  // haste
  const jWidth = stroke;
  const jHeight = Math.floor(s * 0.48);
  ctx.fillRect(leftX + Math.floor(s*0.10), midY - Math.floor(jHeight*0.6), jWidth, jHeight);
  // base
  ctx.fillRect(leftX + Math.floor(s*0.10) - Math.floor(stroke*0.8), midY + Math.floor(jHeight*0.1), Math.floor(stroke*2.2), stroke);
  // curva esquerda (semicírculo)
  ctx.beginPath();
  ctx.arc(leftX + Math.floor(s*0.10), midY + Math.floor(jHeight*0.1) + Math.floor(stroke/2), Math.floor(stroke*0.8), Math.PI/2, Math.PI*1.5);
  ctx.fill();

  // Desenha 'B' à direita
  const bX = centerX + Math.floor(s*0.06);
  const bStemW = stroke;
  const bStemH = Math.floor(s * 0.52);
  const bTop = midY - Math.floor(bStemH*0.6);
  ctx.fillRect(bX, bTop, bStemW, bStemH);
  const r = Math.floor(stroke * 0.95);
  const cy1 = bTop + Math.floor(bStemH * 0.28);
  const cy2 = bTop + Math.floor(bStemH * 0.72);
  const cx = bX + r + Math.floor(stroke*0.6);
  // dois círculos (bojos)
  ctx.beginPath(); ctx.arc(cx, cy1, r, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy2, r, 0, Math.PI*2); ctx.fill();
  // recortes para formar o 'B' (usa cor de fundo clara da base do cartão)
  ctx.fillStyle = '#fbfbfd';
  ctx.beginPath(); ctx.arc(cx - Math.floor(r*0.3), cy1, Math.floor(r*0.55), 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx - Math.floor(r*0.3), cy2, Math.floor(r*0.55), 0, Math.PI*2); ctx.fill();
}
