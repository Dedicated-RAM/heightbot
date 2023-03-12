const fs = require('fs');

const directoryPath = 'image_cache';
const maxFileCount = 15;
const fileExtension = '.png';
const deleteCount = 5;

module.exports = {

    cleanDir : async () => {
            
        fs.readdir(directoryPath, function(err, files) {
            if (err) {
            return console.log('Unable to scan directory: ' + err);
            }
            const pngFiles = files.filter((file) => file.endsWith(fileExtension));
            const pngFileCount = pngFiles.length;
            if (pngFileCount >= maxFileCount) {
            const oldestFiles = pngFiles.sort((a, b) => {
                const aCreationTime = fs.statSync(`${directoryPath}/${a}`).birthtimeMs;
                const bCreationTime = fs.statSync(`${directoryPath}/${b}`).birthtimeMs;
                return aCreationTime - bCreationTime;
            }).slice(0, deleteCount);
            oldestFiles.forEach((file) => {
                fs.unlink(`${directoryPath}/${file}`, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted ${directoryPath}/${file}`);
                }
                });
            });
            }
        });
    }
}

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  const pngFiles = files.filter((file) => file.endsWith(fileExtension));
  const pngFileCount = pngFiles.length;
  if (pngFileCount >= maxFileCount) {
    const oldestFiles = pngFiles.sort((a, b) => {
      const aCreationTime = fs.statSync(`${directoryPath}/${a}`).birthtimeMs;
      const bCreationTime = fs.statSync(`${directoryPath}/${b}`).birthtimeMs;
      return aCreationTime - bCreationTime;
    }).slice(0, deleteCount);
    oldestFiles.forEach((file) => {
      fs.unlink(`${directoryPath}/${file}`, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Deleted ${directoryPath}/${file}`);
        }
      });
    });
  }
});
