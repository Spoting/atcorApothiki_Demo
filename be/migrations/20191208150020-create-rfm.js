'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RFMs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RFMCode: {
        type: Sequelize.STRING
      },
      matsActionDate: {
        type: Sequelize.DATE
      },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RFMs');
  }
};

