const categories = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten'
];

const colors = [
    "#4e79a7",
    "#f28e2c",
    "#76b7b2",
    "#e15759",
    "#59a14f",
    "#edc949",
    "#af7aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ab"
];

const canvasSize = 300;
let currentRotation = 0;
const minRotation = 14 * 360;
const maxRotation = 18 * 360;
const minDuration = 6_000;
const maxDuration = 12_000;

const root = document.querySelector('#root');
const el = getCanvas(root, canvasSize);
const pointer = getCanvas(root, canvasSize);
pointer.style.pointerEvents = 'none';
drawPointer(pointer);

createWheel(el, categories, colors);
el.addEventListener('click', () => {
    spin(el, minRotation, maxRotation);
});

function spin(canvas, min, max) {
    const rotation = Math.floor(Math.random() * (max - min + 1)) + min;
    const r = canvas.width / 2;
    // const ctx = canvas.getContext('2d');
    // ctx.translate(r, r);
    // ctx.rotate(rotation * Math.PI / 180);
    // ctx.translate(-r, -r);    

    const keyframes = [
        { transform: `rotate(${currentRotation}deg)` },
        { transform: `rotate(${0.9 * rotation}deg)`, offset: 0.8, easing: 'ease-out' },
        { transform: `rotate(${rotation}deg)` }
    ];

    const timing = {
        duration: Math.random() * (maxDuration - minDuration) + minDuration,
        iterations: 1,
        easing: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        fill: 'forwards'
    };

    currentRotation = rotation % 360;
    canvas.animate(keyframes, timing);

    return rotation;
}

function getCanvas(root, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.position = 'absolute';
    root.appendChild(canvas);
    return canvas;
}

function createWheel(canvas, categories, colors) {
    const pct = 100 / categories.length;
    for (let i = 0; i < categories.length; i++) {
        const start = Math.round(i * pct);
        const end = Math.round((i + 1) * pct);
        const color = colors[i % colors.length];
        const label = categories[i];
        drawArc(canvas, start, end, color);
        addLabel(canvas, label, start, end);
    }
}

function drawPointer(canvas) {
    const r = canvas.width / 2;
    const ctx = canvas.getContext('2d');
    const p1 = { x: 2 * r + 10, y: r - 10 };
    const p2 = { x: 1.75 * r, y: r };
    const p3 = { x: 2 * r + 10, y: r + 10 };
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawArc(canvas, from, to, color) {
    const r = canvas.width / 2;
    const start = 2 * Math.PI * from / 100;
    const end = 2 * Math.PI * to / 100;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r, start, end);
    // uncomment to outline arcs
    // ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

function calcCenter(r, from, to) {
    const aa = (from + to) / 2;
    const x = r + Math.cos(aa) * (r / 2);
    const y = r + Math.sin(aa) * (r / 2);
    return { x, y };
}

function addLabel(canvas, label, from, to) {
    const r = canvas.width / 2;
    const start = 2 * Math.PI * from / 100;
    const end = 2 * Math.PI * to / 100;
    const ctx = canvas.getContext('2d');
    const center = calcCenter(r, start, end);

    // ctx.font = `${canvasSize / 4}px Arial`;
    // const size = ctx.measureText(label);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    // ctx.font = `${size.width * 16 / r}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(start + (end - start) / 2);
    ctx.fillText(label, 0, 0, r);
    ctx.restore();
}