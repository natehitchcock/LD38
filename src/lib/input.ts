document.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
    keys[e.key] = false;
});

document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
    keys[e.key] = true;
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
