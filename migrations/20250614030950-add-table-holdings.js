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

exports.up = function (db) {
  return db.createTable('holdings', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    userId: {
      type: 'int',
      foreignKey: {
        name: 'user_variant_user_id_fk',
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
        name: 'coin_variant_coin_id_fk',
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
    quantity: { type: 'decimal', defaultValue: '0.00' },
  });
};

exports.down = function (db) {
  return db.dropTable('holdings');
};

exports._meta = {
  version: 1,
};
