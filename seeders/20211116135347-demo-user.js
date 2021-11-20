'use strict';

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
   await queryInterface.bulkInsert('Users',[{
     name:"Nisfa Lailatul Azizah",
     username:"nisfalailatul",
     password:"$2a$12$M1VMgHUUx7GT4rKPwZAOpeE1jQsp4wkf5N96BoqUYBDDCqhAcpEfC", //bcrypt round(12)
     createdAt: new Date(),
     updatedAt: new Date()
   }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkInsert('Users',null,{});
  }
};
