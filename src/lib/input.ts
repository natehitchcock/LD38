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

export const keys: {[key: string]: boolean} = {};
export const mouse = {
    x: 0,
    y: 0,
    left: false,
    right: false
};
