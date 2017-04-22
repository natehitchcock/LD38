document.addEventListener('keyup', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keydown', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('mousedown', e => {
    mouse.left = true;
});

document.addEventListener('mouseup', e => {
    mouse.left = false;
});

const keys = {};
const mouse = {
    x: 0,
    y: 0,
    left: false,
    right: false
};

export default {
    keys,
    mouse
};