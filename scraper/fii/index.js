var fiiScraper = require('../../lib/fii');

fiiScraper(function(fiis) {
  console.log(JSON.stringify(fiis));
});
