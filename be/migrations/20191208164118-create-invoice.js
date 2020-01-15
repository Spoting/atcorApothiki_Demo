'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice: {
        type: Sequelize.STRING
      },   
      PN: {
        type: Sequelize.STRING
      },
      atcorPN: {
        type: Sequelize.STRING
      },
      matInDate: {
        type: Sequelize.DATE
      },
      remark: {
        type: Sequelize.STRING
      },
      supplier: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Invoices');
  }
};