const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fs.promises
  .mkdir(copyFolderPath, { recursive: true })
  .then(() => {
    console.log('Folder created successfully');
    return fs.promises.readdir(folderPath, { withFileTypes: true });
  })
  .then((files) => {
    files.forEach((file) => {
      const srcPath = path.join(folderPath, file.name);
      const destPath = path.join(copyFolderPath, file.name);

      fs.promises
        .copyFile(srcPath, destPath)
        .then(() => console.log(`Copied: ${file.name}`))
        .catch((err) =>
          console.error(`Error copying file ${file.name}:`, err.message),
        );

      if (file.isFile()) {
        console.log('File:', file.name);
      }
    });
  })
  .catch((err) => {
    console.error('Error reading the folder:', err.message);
  });
