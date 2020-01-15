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

   return queryInterface.bulkInsert('Tasks', [
     {
       sysName:'ESP',
       taskName: 'task1',
       endItem: 'endItem1',
       completed: false
     },
     {
      sysName:'ESP',
      taskName: 'task2',
      endItem: 'endItem2',
      completed: false
    },
    {
      sysName:'ESP',
      taskName: 'task3',
      endItem: 'endItem2',
      completed: true
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
