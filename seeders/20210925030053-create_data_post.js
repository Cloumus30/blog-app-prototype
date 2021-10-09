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
    await queryInterface.bulkInsert('Posts',[
      {
      title: 'Post 1',
      body:'<p> Cloudias Hello World </p>',
      geogebra:'https://www.geogebra.org/m/vkutuwmw',
      createdAt:new Date(),
      updatedAt:new Date()
    },
    {
      title: 'Post 2',
      body:'<h1> imani Hello World </h1>',
      geogebra:"https://www.geogebra.org/m/vkutuwmw",
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
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
