// Generate PWA icons from headshot using canvas
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateIcon(size, outputPath) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Navy background
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, size, size);
    
    // Gold border circle
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    
    ctx.beginPath();
    ctx.arc(cx, cy, r + size * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = '#c9a84c';
    ctx.fill();
    
    // Clip circle for headshot
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    
    try {
        const img = await loadImage(path.join(__dirname, 'headshot.jpg'));
        const aspect = img.width / img.height;
        let sw = r * 2, sh = r * 2;
        if (aspect > 1) { sw = sh * aspect; } else { sh = sw / aspect; }
        ctx.drawImage(img, cx - sw/2, cy - sh/2, sw, sh);
    } catch(e) {
        // Fallback: gold initials
        ctx.fillStyle = '#c9a84c';
        ctx.font = `bold ${size * 0.3}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MB', cx, cy);
    }
    
    const buf = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buf);
    console.log(`Generated ${outputPath} (${size}x${size})`);
}

(async () => {
    await generateIcon(192, path.join(__dirname, 'icon-192.png'));
    await generateIcon(512, path.join(__dirname, 'icon-512.png'));
})();
