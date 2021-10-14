'use strict';
let jsonDat = {
  soal:"ini soal",
  pilA : "pilGand",
  pilB : "pilGand",
  pilC : "pilGand",
  pilD : "pilGand",
  pilE : "pilGand",
  pembahasan : "pilGand"
};
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('Soals',[
      {
      dat_soal:JSON.stringify(jsonDat),
      nama_paket:1,
      createdAt:new Date(),
      updatedAt:new Date()
    },
    {
      dat_soal:JSON.stringify(jsonDat),
      nama_paket:2,
      createdAt:new Date(),
      updatedAt:new Date()
    }
    ],{});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Soals', null, {});
  }
};
