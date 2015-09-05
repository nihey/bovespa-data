var yieldScraper = require('../../lib/fii/yields'),
    fiis = require('../../data/fii'),
    fs = require('fs');

var current = 0;
var max = 4;
var wait = function(func) {
  var tryInit = function() {
    if (current < max) {
      ++current;
      func();
      return;
    }
    setTimeout(tryInit, 1000);
  };
  tryInit();
};

var save = function() {
  console.log(fiis);
};

var length = 0;
fiis.forEach(function(fii, index) {
  if (fii.yields) {
    return;
  }
  wait(function() {
    console.log(fii.code)
    yieldScraper(fii.code.substr(0, 4), function(yields, unparsed) {
      --current;
      fiis[index].yields = yields;
      fiis[index].unparsed = unparsed;
      fs.writeFileSync('foo.json', JSON.stringify(fiis));
    });
  });
});
