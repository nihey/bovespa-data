var fs = require('fs');

module.exports = {
  months: {
    'janeiro': 1,
    'fevereiro': 2,
    'março': 3,
    'abril': 4,
    'maio': 5,
    'junho': 6,
    'julho': 7,
    'agosto': 8,
    'setembro': 9,
    'outubro': 10,
    'novembro': 11,
    'dezembro': 12,
  },

  pad: function(string) {
    string = new String(string);
    return string.length === 1 ? '0' + string : string;
  },

  getDate: function(string) {
    if (!string) {
      return null;
    }

    var split = string.toLowerCase().split('/');
    return split[1] + '-' + this.pad(this.months[split[0]]);
  },

  getMonthsRegExp: function() {
    return new RegExp('(' + Object.keys(this.months).join('|') + ')\/[0-9]+');
  },

  getMonth: function(string) {
    if (!string) {
      return null;
    }

    var match = string.toLowerCase().match(this.getMonthsRegExp());
    return this.getDate(match && match[0]);
  },

  toMonth: function(string) {
    if (!string) {
      return null;
    }

    var split = string.split('/');
    return split[2] + '-' + this.pad(split[1]);
  },

  wait: function(functions, callback) {
    var next = function(i) {
      if (typeof functions[i] !== 'function') {
        return callback && callback();
      }

      functions[i](next.bind(this, ++i));
    };

    next(0);
  },

  history: function(extension) {
    var directory = './data/history/yearly/';
    return fs.readdirSync(directory).filter(function(file) {
      return file.split('.')[1] === extension;
    });
  },

  waitHistory: function(extension, callback, looper) {
    looper = looper || 'forEach';
    var directory = './data/history/yearly/';
    return this.wait(this.history(extension)[looper](function(file) {
      return callback(directory + file);
    }));
  }
};
