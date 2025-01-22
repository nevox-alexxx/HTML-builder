const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function clearFolder(folder) {
  try {
    const files = await fs.promises.readdir(folder);
    for (const file of files) {
      const filePath = path.join(folder, file);
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error clearing folder:', err.message);
    }
  }
}

async function copyFiles() {
  try {
    await fs.promises.mkdir(copyFolderPath, { recursive: true });
    await clearFolder(copyFolderPath);
    const files = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      const srcPath = path.join(folderPath, file.name);
      const destPath = path.join(copyFolderPath, file.name);
      if (file.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
        console.log(`Copied: ${file.name}`);
      }
    }
    console.log('Copy completed successfully!');
  } catch (err) {
    console.error('Error during copying:', err.message);
  }
}

copyFiles();
