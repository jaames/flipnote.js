(async () => {

  const note = await flipnote.parseSource('samples/mrjohn.ppm');

  console.log('Test note:', note.getTitle());

  console.table(note.meta);

  const isValid = await note.verify();

  console.log('Is signature valid:', isValid);

  window.note = note;

})();