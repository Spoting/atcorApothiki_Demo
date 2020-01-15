'use strict';
module.exports = (sequelize, DataTypes) => {
  const RFMItems = sequelize.define('RFMItems', {
    matOut: DataTypes.INTEGER,
    matReturn: DataTypes.INTEGER,
    usedBy: DataTypes.STRING
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  RFMItems.associate = function(models) {
    // associations can be defined here
  };
  return RFMItems;
};