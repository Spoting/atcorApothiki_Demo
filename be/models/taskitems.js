'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskItems = sequelize.define('TaskItems', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    totalMatOut: DataTypes.INTEGER,
    totalMatRet: DataTypes.INTEGER
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  TaskItems.associate = function (models) {
    // associations can be defined here
    TaskItems.hasMany(models.TaskItemMovements, {
      foreignKey: 'taskItemId',
      as: 'taskItemMovements'
    }),
      TaskItems.belongsToMany(models.InvoiceItems, {
        through: 'TaskInvoiceItems',
        as: 'taskItemInvoiceItems',
        foreignKey: 'taskItemId',
      })
  };
  return TaskItems;
};