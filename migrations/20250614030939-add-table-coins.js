'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable("coins", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    name: { type: "string", notNull: true},
    description: { type: "string"},
    oldPrice: { type: "decimal", defaultValue: "0.00" },
    currentPrice: { type: "decimal", defaultValue: "0.00" },
    timestamp: { type: "timestamp"},
    updatedTimestamp: { type: "timestamp"}
  });
};

exports.down = function(db) {
  return db.dropTable("coins");
};

exports._meta = {
  "version": 1
};
