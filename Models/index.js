//jshint esversion: 8
const {Sequelize, DataTypes} = require('sequelize');

//Database connection with dialect of postgres specifying the database we are using
// const sequelize = new Sequelize(`postgres://ubuntu:de396tsde396ts@database-1.ckk3jg4l5v2l.us-east-2.rds.amazonaws.com/postgres`, {dialect: "postgres"});
  const sequelize = new Sequelize('postgres', 'postgres', 'de396tsde396ts', {
    host: 'database-1.ckk3jg4l5v2l.us-east-2.rds.amazonaws.com',
    port: 5432, // Use the correct port number
    dialect: 'postgres',
    dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For AWS RDS
    },
  },
  });
// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'database-1.ckk3jg4l5v2l.us-east-2.rds.amazonaws.com',
//   port: 5432, // Default PostgreSQL port
//   username: 'postgres',
//   password: 'de396tsde396ts',
//   database: 'postgres',
// });
// const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
//   host: process.env.HOST,
//   dialect: 'postgres',
//   // declaring pool is optional
//   // pool: {
// //   max: dbConfig.pool.max,
// //   min: dbConfig.pool.min,
// //   acquire: dbConfig.pool.acquire,
// //   idle: dbConfig.pool.idle
// // }
// });

//checking if connection is done
    sequelize.authenticate().then(() => {
        console.log(`Database connected`);
    }).catch((err) => {
        console.log(err);
    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

//connecting to model
db.users = require('./userModel') (sequelize, DataTypes);
db.itineraries = require('./itineraryModel') (sequelize, DataTypes);
//exporting the module
module.exports = db;
