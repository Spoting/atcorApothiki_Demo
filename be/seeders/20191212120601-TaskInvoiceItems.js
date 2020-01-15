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
    return queryInterface.bulkInsert('TaskInvoiceItems', [
      {
        taskId: 1,
        invoiceItemId: 1,
        taskDocItemOutQnt: 10,
        taskDocItemOutDate: '2019-12-10'
      },
      {
        taskId: 1,
        invoiceItemId: 3,
        taskDocItemOutQnt: 5,
        taskDocItemOutDate: '2019-12-10'
      },
      {
        taskId: 1,
        invoiceItemId: 2,
        taskDocItemOutQnt: 10,
        taskDocItemOutDate: '2019-12-10'
      },
      {
        taskId: 1,
        invoiceItemId: 4,
        taskDocItemOutQnt: 5,
        taskDocItemOutDate: '2019-12-10'
      },
      {
        taskId: 1,
        invoiceItemId: 5,
        taskDocItemOutQnt: 20,
        taskDocItemOutDate: '2019-12-10'
      },
      {
        taskId: 2,
        invoiceItemId: 5,
        taskDocItemOutQnt: 10,
        taskDocItemOutDate: '2019-12-10'
      },
      {
        taskId: 2,
        invoiceItemId: 6,
        taskDocItemOutQnt: 10,
        taskDocItemOutDate: '2019-12-10'
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
