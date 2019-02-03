const fs = require('fs');
const path = require('path');

const directory = 'images/Outputs';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});

// const dir = 'images';

// fs.readdir(dir, (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join(dir, file), err => {
//       if (err) throw err;
//     });
//   }
// });