const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'test-plates');
const jsonOutput = path.join(imagesDir, 'testImages.json');
const mapOutput = path.join(__dirname, 'imageMap.ts');

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('❌ Klasör okunamadı:', err);
    process.exit(1);
  }

  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  // ✅ 1. JSON dosyasını yaz
  fs.writeFileSync(jsonOutput, JSON.stringify(imageFiles, null, 2));
  console.log('✅ testImages.json oluşturuldu.');

  // ✅ 2. imageMap.ts dosyasını oluştur
  const importLines = imageFiles.map((file, index) =>
    `const img${index} = require('./assets/test-plates/${file}');`
  ).join('\n');

  const exportLines = `export const imageMap: Record<string, any> = {\n` +
    imageFiles.map((file, index) =>
      `  "${file}": img${index},`
    ).join('\n') +
    `\n};`;

  fs.writeFileSync(mapOutput, `${importLines}\n\n${exportLines}\n`);
  console.log('✅ imageMap.ts oluşturuldu.');
});
