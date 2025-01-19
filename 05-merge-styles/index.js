const fs = require('fs');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectFolder, 'bundle.css');

fs.promises
  .readdir(styleFolder, { withFileTypes: true })
  .then((files) => {
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );
    const promises = cssFiles.map((file) => {
      const filePath = path.join(styleFolder, file.name);
      return fs.promises.readFile(filePath, 'utf8');
    });

    return Promise.all(promises);
  })
  .then((contents) => {
    const bundleContent = contents.join('\n');
    return fs.promises.writeFile(bundlePath, bundleContent);
  })
  .then(() => {
    console.log('Styles merged into bundle.css');
  })
  .catch((err) => {
    console.error('Error processing styles:', err.message);
  });
