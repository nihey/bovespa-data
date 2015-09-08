var fs = require('fs'),
    parse = require('../../lib/history/parse');

// Parses each year's stocks and save them into a JSON file
parse(function(history) {
  var year = history[0].date.split('-')[0];
  var destination = './data/history/yearly/' + year + '.json';
  fs.writeFileSync(destination, JSON.stringify(history));
  console.log('Generated: ', destination);
});
