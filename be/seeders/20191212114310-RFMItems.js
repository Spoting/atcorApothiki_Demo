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
    return queryInterface.bulkInsert('RFMItems', [
      {
        rfmId: 1,
        itemId: 1,
        matOut: 10,
      },
      {
        rfmId: 1,
        itemId: 2,
        matOut: 20,
      },
      {
        rfmId: 2,
        itemId: 1,
        matOut: 5,
      },
      {
        rfmId: 2,
        itemId: 2,
        matOut: 5,
      },
      {
        rfmId: 3,
        itemId: 3,
        matOut: 20,
      },
      {
        rfmId: 4,
        itemId: 3,
        matOut: 20,
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
