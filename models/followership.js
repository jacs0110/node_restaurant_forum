'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followership = sequelize.define('Followership', {
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {});
  Followership.associate = function(models) {
    // associations can be defined here
  };
  return Followership;
};