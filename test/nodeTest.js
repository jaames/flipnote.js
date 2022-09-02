const fs = require('fs').promises;
const flipnote = require('../dist/flipnote.js');

(async () => {
  const file = await fs.readFile('./test/samples/bee.ppm');
  const note = await flipnote.parseSource(file);
  console.log(await note.verify());
})();