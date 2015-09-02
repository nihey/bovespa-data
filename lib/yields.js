var getPage = require('get-page').string,
    getBuffer = require('get-page').buffer,
    pdfText = require('pdf-text'),
    cheerio = require('cheerio'),
    pf = require('parse-float'),
    Utils = require('./utils');

module.exports = function(symbol, callback) {
  var url = 'http://www.bmfbovespa.com.br/Fundos-Listados/FundosListadosDetalhe.aspx?Sigla=' +
            symbol + '&tipoFundo=Imobiliario&aba=abaDocumento&idioma=pt-br';

  getPage(url, function(data) {
    var $ = cheerio.load(data);
    var unparsed = {};
    var yields = {};
    var yieldLength = 0;
    var moo = 0;
    $('.tabela tr td a').each(function() {
      var title = $(this).text().toLowerCase();
      if (title.search(/^distribuição\sde\srendimento/) === -1) {
        return;
      }
      ++yieldLength;

      getBuffer($(this).attr('href'), function(buffer) {
        pdfText(buffer, function(err, chunks) {
          // Try to find the monthly yield somehow
          var pdf = chunks.join('');
          var match = pdf.match(/R\$\s?[\,0-9]+/);
          var yield = match && pf(match[0].replace(/R\$\s?/, ''));

          // Associate the yield with the detected month
          var month = Utils.getMonth(title);
          if (!month) {
            month = Utils.toMonth($(this).parent().next().find('span').text());
            unparsed[title + ' ' + Math.random()] = month;
          }
          if (month && yields[month] === undefined) {
            yields[month] = yield;
          }

          --yieldLength || callback(yields, unparsed);
        }.bind(this));
      }.bind(this));
    });
    yieldLength || callback(yields, unparsed);
  });
};
