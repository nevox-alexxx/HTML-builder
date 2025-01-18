const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading the directory:', err.message);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err.message);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.basename(file, path.extname(file));
        const fileExtension = path.extname(file).slice(1);
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      }
    });
  });
});
