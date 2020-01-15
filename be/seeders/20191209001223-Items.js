

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
    //  let fakeItems = [];
    //  for (i = 0; i < 2000; i++) {
    //    let item = {
    //      atcorId: i,
    //      name: 'item/' + i,
    //      nsn: 'nsn/' + i,
    //      totalStock: 0,
    //      category: 'αναλωσιμο',
    //      unit: 'number',
    //    }
    //    fakeItems.push(item);
    //  }
    //  return queryInterface.bulkInsert('Items', fakeItems);
    function leftFillNum(num, targetLength) {
      return num.toString().padStart(6/*targetLength*/, 0);
    }

    return queryInterface.bulkInsert('Items', [
      {
        atcorId: 00001,
        atcorNo: leftFillNum(1),
        name: 'βιδες',
        unit: 'number',
        totalStock: 0,
        category: 'αναλωσιμο',
      },
      {
        atcorId: 00002,
        atcorNo: leftFillNum(2),
        name: 'σωληνας',
        unit: 'meters',
        totalStock: 0,
        category: 'αναλωσιμο'
      },
      {
        atcorId: 00003,
        atcorNo: leftFillNum(3),
        name: 'κολλα',
        unit: 'kilos',
        totalStock: 0,
        category: 'αναλωσιμο'
      },
      {
        atcorId: 00005,
        atcorNo: leftFillNum(5),
        name: 'σκοινι',
        unit: 'meters',
        totalStock: 0,
        category: 'αναλωσιμο'
      },
      {
        atcorId: 7,
        atcorNo: leftFillNum(7),
        name: 'σκληρο σφυρι',
        unit: 'number',
        totalStock: 0,
        category: 'εργαλειο'
      },
      {
        atcorId: 8,
        atcorNo: leftFillNum(8),
        name: 'γραναζια',
        unit: 'number',
        totalStock: 0,
        category: 'αναλωσιμο'
      },
      {
        atcorId: 10,
        atcorNo: leftFillNum(10),
        unit: 'kilos',
        totalStock: 0,
        category: 'εργαλειο'
      },
      {
        atcorId: 11,
        atcorNo: leftFillNum(11),
        unit: 'number',
        totalStock: 0,
        category: 'αναλωσιμο'
      },
      {
        atcorId: 14,
        atcorNo: leftFillNum(14),
        unit: 'kilos',
        totalStock: 0,
        category: 'εργαλειο'
      },
      {
        atcorId: 15,
        atcorNo: leftFillNum(15),
        unit: 'kilos',
        totalStock: 0,
        category: 'αναλωσιμο'
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
