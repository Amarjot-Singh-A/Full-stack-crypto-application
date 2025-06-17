const { DateTime } = require('luxon');

// Format a date in a timezone
function getTimestampInZone(zone = 'UTC') {
  return DateTime.now().setZone(zone).toFormat('yyyy-MM-dd HH:mm:ss');
}

module.exports = { getTimestampInZone };