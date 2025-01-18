const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Enter text to write to the file. Type "exit" to finish.');

// stdin = standard input
process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    console.log('DONE!');
    process.exit();
  }

  writeStream.write(input + '\n');
});

// SIGINT = signal interrupt
process.on('SIGINT', () => {
  console.log('DONE!');
  process.exit();
});
