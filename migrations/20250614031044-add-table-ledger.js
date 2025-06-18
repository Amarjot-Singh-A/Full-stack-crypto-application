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
  return db.createTable('ledger', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    userId: {
      type: 'int',
      foreignKey: {
        name: 'users_variant_users_id_fk',
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
    transactionId: {
      type: 'int',
      foreignKey: {
        name: 'transaction_variant_transaction_id_fk',
        table: 'transactions',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          transactionId: 'id',
        },
      },
    },
    balance: { type: 'decimal', defaultValue: '0.00' },
    timestamp: { type: 'timestamp' },
  });
};

exports.down = function (db) {
  return db.dropTable('ledger');
};

exports._meta = {
  version: 1,
};
