'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

/**
 * id
 * coinid
 * userid
 * name
 * timestamp
 */

exports.up = function (db) {
  return db.createTable('favouriteCoins', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    userId: {
      type: 'int',
      foreignKey: {
        name: 'userss_variant_users_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          userId: 'id',
        },
      },
    },
    coinId: {
      type: 'int',
      foreignKey: {
        name: 'coins_variant_coins_id_fk',
        table: 'coins',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          coinId: 'id',
        },
      },
    },
    name: { type: 'string' },
    timestamp: { type: 'timestamp' },
  });
};

exports.down = function (db) {
  return db.dropTable('favouriteCoins');
};

exports._meta = {
  version: 1,
};
