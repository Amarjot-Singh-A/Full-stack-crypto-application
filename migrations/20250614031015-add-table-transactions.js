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
  return db.createTable('transactions', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    paymentId: {
      type: 'int',
      foreignKey: {
        name: 'paymentMethod_variant_paymentMethod_id_fk',
        table: 'paymentMethod',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: {
          paymentId: 'id',
        },
      },
    },
    notes: { type: 'string' },
    amount: { type: 'decimal', defaultValue: '0.00' },
    timestamp: { type: 'timestamp' },
  });
};

exports.down = function (db) {
  return db.dropTable('transactions');
};

exports._meta = {
  version: 1,
};
