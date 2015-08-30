var cheerio = require('cheerio'),
    getPage = require('get-page').string;

module.exports = function(callback) {
  var baseURL = 'http://www.bmfbovespa.com.br/fundos-listados/';
  var url = baseURL + 'fundoslistados.aspx?tipoFundo=imobiliario&idioma=pt-br';
  getPage(url, function(data) {
    var $ = cheerio.load(data);

    var fiisLength = 0;
    var fiis = [];
    $('.tabela.tabFundos tr').each(function() {
      var columns = $(this).children('td');
      // If no data is found, do not create the FII
      if (!columns.length) {
        return;
      }
      ++fiisLength;

      var fii = {
        name: $(columns[0]).find('a').text(),
        fund: $(columns[1]).find('a').text(),
        type: $(columns[2]).find('span').text(),
      };
      getPage(baseURL + $(columns[0]).find('a').attr('href'), function(data) {
        var $ = cheerio.load(data);
        var info = $('.dadosFundos').children();
        fii.code = $(info[1]).find('.Dado').text().trim();
        fii.cnpj = $(info[3]).find('.Dado').text().trim();
        fii.website = $(info[5]).find('.Dado').attr('href');
        fiis.push(fii);

        --fiisLength || callback(fiis);
      });
    });
  })
}
