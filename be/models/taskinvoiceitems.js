'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskInvoiceItems = sequelize.define('TaskInvoiceItems', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    taskDocItemOutQnt: DataTypes.INTEGER,
    taskDocItemOutDate: DataTypes.DATE,
    taskDocItemPriceInTotal: DataTypes.DECIMAL(7,2)
    // priceOut: DataTypes.DECIMAL(7,2)
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  TaskInvoiceItems.associate = function(models) {
    // associations can be defined here
  };
  return TaskInvoiceItems;
};