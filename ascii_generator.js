function convertToASCII() {
    const fileInput = document.getElementById('fileInput');
    const asciiOutput = document.getElementById('asciiOutput');
    const file = fileInput.files[0];
    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                let width, height;
                const aspectRatio = img.width / img.height;

                if (mode === 'SP') {
                    const MAX_WIDTH = 50;
                    width = MAX_WIDTH;
                    height = Math.round(width / aspectRatio);
                    if (height > 40) {  
                        height = 40;
                        width = Math.round(height * aspectRatio);
                    }
                } else {
                    width = Math.min(img.width, 200);
                    height = Math.round(width / aspectRatio);
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let ascii = '';

                for (let y = 0; y < imageData.height; y++) {
                    for (let x = 0; x < imageData.width; x++) {
                        const idx = (y * imageData.width + x) * 4;
                        const r = imageData.data[idx];
                        const g = imageData.data[idx + 1];
                        const b = imageData.data[idx + 2];
                        const avg = Math.floor((r + g + b) / 3);
                        const char = getCharFromLuminance(avg);
                        ascii += char;
                    }
                    ascii += '\n';
                }

                // Mise à jour de la sortie ASCII et activation de l'aperçu
                asciiOutput.textContent = ascii;
                asciiOutput.classList.add('show'); // Activation de l'aperçu avec fade-in
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        asciiOutput.textContent = "Veuillez sélectionner une image.";
        asciiOutput.classList.add('show'); // Activation de l'aperçu même pour un message d'erreur
    }
}

function getCharFromLuminance(luminance) {
    const chars = ' .:-=+*#%@';
    const charCount = chars.length;
    const charIndex = Math.floor((luminance / 255) * (charCount - 1));
    return chars[charIndex];
}

function copyText() {
    const asciiOutput = document.getElementById('asciiOutput');
    navigator.clipboard.writeText(asciiOutput.textContent).then(() => {
        alert('Texte copié dans le presse-papiers !');
    }, (err) => {
        console.error('Erreur lors de la copie:', err);
    });
}