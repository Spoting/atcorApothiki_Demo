'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskItemMovements = sequelize.define('TaskItemMovements', {
    matOut: DataTypes.INTEGER,
    matRet: DataTypes.INTEGER,
    matActionDate: DataTypes.DATE
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  TaskItemMovements.associate = function(models) {
    // associations can be defined here
  };
  return TaskItemMovements;
};