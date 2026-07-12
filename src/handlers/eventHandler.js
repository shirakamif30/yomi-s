const fs = require('fs');
const path = require('path');

module.exports = function(client) {
  var eventsPath = path.join(__dirname, '..', 'events');
  var eventFiles = fs.readdirSync(eventsPath).filter(function(file) {
    return file.endsWith('.js');
  });

  for (var file of eventFiles) {
    var filePath = path.join(eventsPath, file);
    var event = require(filePath);
    if (event.once) {
      client.once(event.name, function() {
        var args = Array.prototype.slice.call(arguments);
        event.execute.apply(null, args);
      });
    } else {
      client.on(event.name, function() {
        var args = Array.prototype.slice.call(arguments);
        event.execute.apply(null, args);
      });
    }
  }
};
