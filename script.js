'use strict';

/*Temel Ayarlar */
const maxScale = 3;
const scaleStep = 0.001;
const width = 400;
const height = 400;
const newHeartInterval = 250;

/*Göz Renginden İlham Alınmış Renk Paleti */
const colourList = [
  "rgba(244, 200, 122, 0.85)",  // golden-light → açık
  "rgba(209, 166, 70, 0.85)",   // amber-gold → orta
  "rgba(141, 148, 64, 0.85)",   // olive-green → zeytine yakın
  "rgba(166, 110, 44, 0.85)",   // cinnamon → tarçın
  "rgba(92, 58, 46, 0.85)"      // deep-brown → en koyu
];


/*Kalp Çizim Fonksiyonu */
function drawHeart(ctx, x, y, w, h, color) {
  const topCurveHeight = h * 0.3;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - w / 2, y, x - w / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - w / 2, y + (h + topCurveHeight) / 2, x, y + (h + topCurveHeight) / 2, x, y + h);
  ctx.bezierCurveTo(x, y + (h + topCurveHeight) / 2, x + w / 2, y + (h + topCurveHeight) / 2, x + w / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

/*Kalp Nesnesi */
class Heart {
  constructor(scale = 0, color = '#f4c87a') {
    this.scale = scale;
    this.color = color;
    this.x = width / 2;
    this.h = height * scale;
    this.y = height / 2 - (this.h !== 0 ? this.h / 2 : 0);
    this.increment = scaleStep;
  }

  step() {
    this.scale += this.increment;
    this.increment += 0.00005;
    this.h = height * this.scale;
    this.y = height / 2 - (this.h !== 0 ? this.h / 2 : 0);
  }

  draw(ctx) {
    if (this.scale === 0) return;
    drawHeart(ctx, this.x, this.y, this.h, this.h, this.color);
  }
}

/*Renk Döngüsü */
class ColourWheel {
  constructor(colors) {
    this.colors = colors;
    this.index = 0;
  }

  next() {
    const color = this.colors[this.index];
    this.index = (this.index + 1) % this.colors.length;
    return color;
  }
}

/*Animasyonu Başlat */
window.addEventListener('load', () => {
  const canvas = document.getElementById("animation");
  const context = canvas.getContext("2d");
  const colours = new ColourWheel(colourList);
  let hearts = [];

  // İlk arka plan
  context.fillStyle = 'rgba(0, 0, 0, 0.03)';
  context.fillRect(0, 0, width, height);

  let lastTime = 0;

  (function animation(time) {
    requestAnimationFrame(animation);

    hearts.forEach(h => h.step());
    hearts = hearts.filter(h => h.scale <= maxScale * 1.5);

    if (time - lastTime >= newHeartInterval) {
      lastTime = time;
      hearts.push(new Heart(0, colours.next()));
    }

    hearts.sort((a, b) => b.scale - a.scale);
    hearts.forEach(h => h.draw(context));
  })(0);
});
