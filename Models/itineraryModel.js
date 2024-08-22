//jshint esversion: 8
module.exports = (sequelize, DataTypes) => {
   const Itinerary = sequelize.define( "itinerary", {
       startDate: {
           type: DataTypes.STRING,
           allowNull: false
       },
       destination: {
           type: DataTypes.STRING,
           allowNull: false
       },
       numberOfDays: {
           type: DataTypes.STRING,
           allowNull: false
       },
       jsonResult: {
            type: DataTypes.STRING,
           allowNull: false
       },
   }, {timestamps: true}, );
   return Itinerary;
};
