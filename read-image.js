const readImage = (img, canvas) => {
    const width = img.width;
    const height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height)
    const binaryData = imageData.data;

    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
            const index = (y * width + x) * 4;
            const r = binaryData[index];
            const g = binaryData[index + 1];
            const b = binaryData[index + 2];
            const a = binaryData[index + 3];
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

const example = () => {
    const img = new Image();
    img.onload = () => {
        const canvas = document.getElementById('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        readImage(img, canvas);
    }
    img.src = './bg.jpg';
}

example();