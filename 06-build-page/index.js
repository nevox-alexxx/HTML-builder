const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const distAssetsFolder = path.join(projectDist, 'assets');

async function createProjectDist() {
  await fs.promises.mkdir(projectDist, { recursive: true });
  console.log('project-dist folder created.');
}

async function buildHTML() {
  try {
    let templateContent = await fs.promises.readFile(templateFile, 'utf8');
    const componentFiles = await fs.promises.readdir(componentsFolder, {
      withFileTypes: true,
    });

    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const tagName = `{{${path.basename(file.name, '.html')}}}`;
        const componentContent = await fs.promises.readFile(
          path.join(componentsFolder, file.name),
          'utf8',
        );
        templateContent = templateContent.replace(
          new RegExp(tagName, 'g'),
          componentContent,
        );
      }
    }

    await fs.promises.writeFile(
      path.join(projectDist, 'index.html'),
      templateContent,
    );
    console.log('index.html created successfully.');
  } catch (err) {
    console.error('Error building HTML:', err.message);
  }
}

async function mergeStyles() {
  try {
    const styleFiles = await fs.promises.readdir(stylesFolder, {
      withFileTypes: true,
    });
    const bundlePath = path.join(projectDist, 'style.css');
    const writeStream = fs.createWriteStream(bundlePath);

    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesFolder, file.name);
        const content = await fs.promises.readFile(filePath, 'utf8');
        writeStream.write(content + '\n');
      }
    }

    writeStream.end();
    console.log('style.css created successfully.');
  } catch (err) {
    console.error('Error merging styles:', err.message);
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
    const items = await fs.promises.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    console.log('Assets copied successfully.');
  } catch (err) {
    console.error('Error copying assets:', err.message);
  }
}

async function buildProject() {
  await createProjectDist();
  await buildHTML();
  await mergeStyles();
  await copyAssets(assetsFolder, distAssetsFolder);
}

buildProject().catch((err) =>
  console.error('Error building project:', err.message),
);
