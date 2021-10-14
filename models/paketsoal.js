'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaketSoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PaketSoal.init({
    nama_paket: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaketSoal',
  });
  return PaketSoal;
};