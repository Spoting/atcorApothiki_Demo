'use strict';
module.exports = (sequelize, DataTypes) => {
  const RFM = sequelize.define('RFM', {
    RFMCode: DataTypes.INTEGER,
    matsActionDate: DataTypes.DATE
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  RFM.associate = function(models) {
    // associations can be defined here
    RFM.belongsToMany(models.Item, {
      through: 'RFMItems',
      as: 'items',
      foreignKey: 'rfmId',
  })
  };
  return RFM;
};
