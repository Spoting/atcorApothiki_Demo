'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('InvoiceItems', [
      {
        invoiceId: 1,
        itemId: 1,
        totalDocMatInQnt: 10,
        priceIn: 0.2,
      },
      {
        invoiceId: 1,
        itemId: 2,
        totalDocMatInQnt: 20,
        priceIn: 0.3,
      },
      {
        invoiceId: 2,
        itemId: 1,
        totalDocMatInQnt: 5,
        priceIn: 0.4,
      },
      {
        invoiceId: 2,
        itemId: 2,
        totalDocMatInQnt: 10,
        priceIn: 0.15,
      },
      {
        invoiceId: 2,
        itemId: 3,
        totalDocMatInQnt: 30,
        priceIn: 0.5,
      },
      {
        invoiceId: 3,
        itemId: 3,
        totalDocMatInQnt: 10,
        priceIn: 0.6,
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
