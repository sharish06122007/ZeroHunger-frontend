const { Jimp } = require('jimp');

async function removeWhiteBackground() {
  const img = await Jimp.read('src/assets/images/logo.jpg');
  
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    
    // If it's very close to white, make it transparent
    if (red > 240 && green > 240 && blue > 240) {
      this.bitmap.data[idx + 3] = 0; // Alpha
    }
  });

  await img.write('src/assets/images/logo.png');
  console.log('Successfully saved transparent logo.png');
}

removeWhiteBackground().catch(console.error);
