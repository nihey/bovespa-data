var fs = require('fs'),
    readline = require('readline'),
    Utils = require('../../lib/utils');

// Parse different types of records
var parse = {
  '00': function(line) {return false},

  '01': function(line) {
    // File parsing manual:
    //
    // http://www.bmfbovespa.com.br/pt-br/download/SeriesHistoricas_Layout.pdf
    return {
      date: line.slice(2, 6) + '-' + line.slice(6, 8) + '-' + line.slice(8, 10),
      bdi: line.slice(10, 12),
      code: line.slice(12, 24).trim(),
      marketType: line.slice(24, 27),
      issuer: line.slice(27, 39).trim(),
      type: line.slice(39, 49).trim(),
      deadline: line.slice(49, 52).trim(),
      currency: line.slice(52, 56).trim(),
      prices: {
        opening: line.slice(56, 69),
        max: line.slice(69, 82),
        min: line.slice(82, 95),
        mean: line.slice(95, 108),
        last: line.slice(108, 121),
        bid: line.slice(121, 134),
        ask: line.slice(134, 147),
      },
      exchanges: parseInt(line.slice(147, 152)),
      exchanged: parseInt(line.slice(152, 170)),
      volume: parseInt(line.slice(170, 188)),
    };
  },

  '99': function(line) {return false;},
};

// Parse each txt file into a JSON file
var directory = './data/history/yearly/';
Utils.wait(
  fs.readdirSync(directory).filter(function(f) {return f.split('.')[1] === 'txt'})
    .map(function(file) {
      return function(next) {
        var path = directory + file;
        var reader = readline.createInterface({input: fs.createReadStream(path)});

        // Collect the year's history over each line
        var history = [];
        reader.on('line', function(line) {
          var type = line.slice(0, 2);
          var parsed = parse[type](line);
          if (parsed) {
            history.push(parsed);
          }
        });

        // Save everything into a file when finished
        reader.on('close', function() {
          var destination = directory + file.split('.')[0] + '.json';
          fs.writeFileSync(destination, JSON.stringify(history));
          console.log('Parsed: ' + destination);
          next();
        });
      }
    })
);
