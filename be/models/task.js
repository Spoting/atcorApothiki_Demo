'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    sysName: DataTypes.STRING,
    taskName: {
      type: DataTypes.STRING,
      unique: 'uniqueTaskName',
      allowNull: false
    },
    endItem: DataTypes.STRING,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dateCompleted: DataTypes.DATE,
    contract: DataTypes.STRING,
    PO: DataTypes.STRING
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Task.associate = function (models) {
    // associations can be defined here
    Task.hasMany(models.RFM, {
      foreignKey: 'taskId',
      as: 'RFMs'
    }),
    // Task.belongsToMany(models.InvoiceItems, {
    //   through: 'TaskInvoiceItems',
    //   as: 'invoiceItems',
    //   foreignKey: 'taskId',
    // })
    Task.belongsToMany(models.Item, {
      through: 'TaskItems',
      as: 'items',
      foreignKey: 'taskId',
    })
  };
  return Task;
};