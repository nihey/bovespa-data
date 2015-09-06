var getBuffer = require('get-page').buffer,
    Stream = require('stream').Transform,
    fs = require('fs'),
    mkdirp = require('mkdirp');

// Base directory where the scraped content will be dropped
var directory = './data/history/yearly/';
mkdirp(directory);

// Create a 'let' behavior for each iteration
var loop = function(i) {
  // History download URL from http://www.bmfbovespa.com.br/pt-br/cotacoes-historicas/FormSeriesHistoricas.asp
  var url = 'http://www.bmfbovespa.com.br/InstDados/SerHist/';
  url += 'COTAHIST_A' + i + '.zip';
  getBuffer(url, function(buffer) {
    // Save the zip file locally
    var filePath = directory + i + '.zip';
    fs.writeFileSync(filePath, buffer);
    console.log('Downloaded: ' + filePath);
  });
};

// Execute the loop
var currentYear = new Date().getFullYear();
for (var i = 1986; i < currentYear; i++) loop(i);
