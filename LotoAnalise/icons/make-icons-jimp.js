// Gera icon-192.png e icon-512.png com Jimp e fontes bitmap embutidas
// Uso:
//   npm install jimp
//   node make-icons-jimp.js "JB Analise Loto" "#8BC34A" "#ffffff"

const JimpNS = require('jimp');
const Jimp = JimpNS.Jimp; // class
const path = require('path');

const TEXT = process.argv[2] || 'JB Analise Loto';
let BG = process.argv[3] || '#8BC34A';
let FG = process.argv[4] || '#ffffff';

function validColor(c){ return typeof c === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c); }
if (!validColor(BG)) BG = '#8BC34A';
if (!validColor(FG)) FG = '#ffffff';

(async () => {
  await makeIcon(192);
  await makeIcon(512);
  console.log('Concluído.');
})();

async function makeIcon(size){
  const img = new Jimp({ width: size, height: size, color: JimpNS.cssColorToHex ? JimpNS.cssColorToHex(BG) : 0xffffffff });

  // círculo sutil
  const overlay = new Jimp(size, size, 0x00000000);
  const radius = Math.floor(size*0.42);
  const cx = Math.floor(size/2), cy = Math.floor(size/2);
  const shade = shadeColor(BG, -12);
  const shadeRGBA = (JimpNS.cssColorToHex ? JimpNS.cssColorToHex(shade) : 0xff000000);
  overlay.scan(0,0,size,size,(x,y,idx)=>{
    const dx = x - cx, dy = y - cy;
    if (dx*dx + dy*dy <= radius*radius) {
      overlay.bitmap.data[idx+0] = (shadeRGBA>>24)&0xFF; // R
      overlay.bitmap.data[idx+1] = (shadeRGBA>>16)&0xFF; // G
      overlay.bitmap.data[idx+2] = (shadeRGBA>>8)&0xFF;  // B
      overlay.bitmap.data[idx+3] = 255;                  // A
    }
  });
  img.composite(overlay,0,0);

  // Texto: usa fonte bitmap que mais se aproxima do tamanho
  const font = await chooseFont(size, FG);
  const text = 'JB'; // monograma com iniciais
  const w = JimpNS.measureText(font, text);
  const h2 = JimpNS.measureTextHeight(font, text, size);
  img.print(font, Math.floor((size - w)/2), Math.floor((size - h2)/2), text);

  const out = path.join(__dirname, `icon-${size}.png`);
  await img.writeAsync(out);
  console.log('✓ Gerado', out);
}

function shadeColor(col, amt){
  if (!validColor(col)) return col;
  const n = parseInt(col.slice(1), 16);
  let r = (n >> 16) + amt;
  let g = ((n >> 8) & 0xFF) + amt;
  let b = (n & 0xFF) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1)}`;
}

async function chooseFont(size, fg){
  // Seleciona tamanho de fonte bitmap conforme ícone
  const white = fg.toLowerCase() === '#ffffff';
  const palette = white
    ? [JimpNS.FONT_SANS_128_WHITE, JimpNS.FONT_SANS_64_WHITE, JimpNS.FONT_SANS_32_WHITE]
    : [JimpNS.FONT_SANS_128_BLACK, JimpNS.FONT_SANS_64_BLACK, JimpNS.FONT_SANS_32_BLACK];
  for (const f of palette){
    try { return await JimpNS.loadFont(f); } catch {}
  }
  // fallback
  return await JimpNS.loadFont(white ? JimpNS.FONT_SANS_32_WHITE : JimpNS.FONT_SANS_32_BLACK);
}
