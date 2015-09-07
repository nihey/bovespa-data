var fs = require('fs'),
    unzip = require('unzip');

var directory = './data/history/yearly/';
// Search for zip files on yearly history directory and extract them
fs.readdirSync(directory).filter(function(f) {return f.split('.')[1] === 'zip'})
  .forEach(function(file) {
      var path = directory + file;
      fs.createReadStream(path).pipe(unzip.Parse()).on('entry', function(entry) {
        var txt = '.' + path.split('.')[1] + '.txt';
        entry.pipe(fs.createWriteStream(txt));
        console.log('Extracting: ' + txt);
      });
  });
