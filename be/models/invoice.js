'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    invoice: {
      type: DataTypes.STRING,
      unique: 'uniqueInvoice',
      allowNull: false
    },
    invoiceDate: DataTypes.DATE,
    remark: DataTypes.STRING,
    matInDate: DataTypes.DATE,
    supplier: DataTypes.STRING
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Invoice.associate = function(models) {
    // associations can be defined here
    Invoice.belongsToMany(models.Item, {
      through: 'InvoiceItems',
      as: 'items',
      foreignKey: 'invoiceId'
    })
  };
  return Invoice;
};