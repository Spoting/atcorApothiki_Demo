'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    atcorId: {
      type: DataTypes.INTEGER(8),//.ZEROFILL,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    atcorNo: {
      type: DataTypes.STRING,
      // allowNull: false,
      unique: 'uniqueAtcorNo'
    },
    name: DataTypes.STRING,
    totalStock: DataTypes.INTEGER,
    nsn: {
      type: DataTypes.STRING,
      unique: 'uniqueNSN'
    },
    category: DataTypes.STRING,
    material: DataTypes.STRING,
    unit: DataTypes.STRING,
    location: DataTypes.STRING,
    dexion: DataTypes.STRING,
    dexion2: DataTypes.STRING
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Item.associate = function (models) {
    // associations can be defined here
    Item.belongsToMany(models.RFM, {
      through: 'RFMItems',
      as: 'RFMs',
      foreignKey: 'itemId'
    }),

      Item.belongsToMany(models.Invoice, {
        through: 'InvoiceItems',
        as: 'invoices',
        foreignKey: 'itemId'
      }),
      Item.belongsToMany(models.Task, {
        through: 'TaskItems',
        as: 'tasks',
        foreignKey: 'itemId',
      })
  };
  return Item;
};