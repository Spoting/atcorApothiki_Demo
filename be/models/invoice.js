'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    invoice: DataTypes.STRING,
    invoiceDate: DataTypes.DATE,
    remark: DataTypes.STRING,
    matInDate: {type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    supplier: DataTypes.STRING
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
Invoice.associate = function (models) {
  // associations can be defined here
  Invoice.belongsToMany(models.Item, {
    through: 'InvoiceItems',
    as: 'items',
    foreignKey: 'invoiceId'
  })
};
return Invoice;
};