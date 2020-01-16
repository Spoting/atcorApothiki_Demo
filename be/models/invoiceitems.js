'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvoiceItems = sequelize.define('InvoiceItems', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    matInQnt: DataTypes.INTEGER,
    priceIn: DataTypes.DECIMAL(7,2),
    availability: DataTypes.INTEGER,
    task_related: DataTypes.STRING,
    rfm_related: DataTypes.STRING
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  InvoiceItems.associate = function(models) {
    // associations can be defined here
    InvoiceItems.belongsToMany(models.TaskItems, {
      through: 'TaskInvoiceItems',
      as: 'invoiceItemTaskItems',
      foreignKey: 'invoiceItemId',
  })
  };
  return InvoiceItems;
};