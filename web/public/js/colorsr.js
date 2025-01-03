/* ***
PhasorZ + Hans3w | By ClusterBR (arcbrth@gmail.com) (c) 2025 | Compiled and deployed implementing MS-GitHub Wfs
*** */

const MAX_COLORS = 20000;
var NUM_COLORS = 1000;

function getRandomColorValue() {
    return Math.floor(Math.random() * 256);
}
function generateRandomColor() {
    const r = getRandomColorValue();
    const g = getRandomColorValue();
    const b = getRandomColorValue();
    return { r, g, b, rgb: `RGB(${r}, ${g}, ${b})`, hex: rgbToHex(r, g, b) };
}
function rgbToHex(r, g, b) {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
function renderRandomColors() {
    const paletteCONTAINER = document.getElementById('palette-container');
    const msgeAreaINPUT = document.getElementById('message-area');

    for (let i = 0; i < NUM_COLORS; i++) {
        const { rgb, hex } = generateRandomColor();
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = rgb;

        const colorCode = document.createElement('span');
        colorCode.classList.add('color-code');
        colorCode.textContent = rgb;

        const hexCode = document.createElement('span');
        hexCode.classList.add('hex-code');
        hexCode.textContent = hex;

        colorBox.appendChild(colorCode);
        colorBox.appendChild(hexCode);
        paletteCONTAINER.appendChild(colorBox);

        colorBox.addEventListener('click', () => {
            const colorText = `${rgb} ${hex}`;
            navigator.clipboard.writeText(colorText).then(() => {
                msgeAreaINPUT.textContent = `Stored to clipboard: ${rgb}, ${hex}`;
                msgeAreaINPUT.style.display = 'block';
                setTimeout(() => {
                    msgeAreaINPUT.style.display = 'none';
                }, 10000); //-- 10 seconds
            }).catch(err => {
                console.error('Failed to get color code', err);
            });
        });
    }
}

function generate() {
    const totalColors = document.getElementById('totalColors').value;
    const btnGenerate = document.getElementById('btnGenerate');
    
    NUM_COLORS = totalColors;
    if(NUM_COLORS >=1 && NUM_COLORS <= MAX_COLORS) {
        btnGenerate.disabled = 'disabled';
        const paletteCONTAINER = document.getElementById('palette-container');
        while (paletteCONTAINER.firstChild) { paletteCONTAINER.removeChild(paletteCONTAINER.firstChild); }    
        renderRandomColors();        
    } else {
        alert("Type a value between 1 and " + MAX_COLORS);
    }
    btnGenerate.disabled = false;
}

document.addEventListener('DOMContentLoaded', (event) => {    
    document.getElementById('totalColors').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            generate();
        }
    });

    renderRandomColors();
    document.getElementById('totalColors').value = NUM_COLORS;
});

