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
    return queryInterface.bulkInsert('RFMs', [
      {
        taskId: 1,
        RFMCode: 1,
        matsActionDate: '2019-12-04'
      },
      {
        taskId: 1,
        RFMCode: 2,
        matsActionDate: '2019-12-05'
      },
      {
        taskId: 1,
        RFMCode: 3,
        matsActionDate: '2019-12-06'
      },
      {
        taskId: 2,
        RFMCode: 4,
        matsActionDate: '2019-12-07'
      }
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
