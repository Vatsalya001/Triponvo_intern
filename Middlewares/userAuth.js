//jshint esversion: 8
const express = require("express");
const db = require("../Models");
//Assigning db.users to User variable
 const User = db.users;

//Function to check if email already exist in the database
 const saveUser = async (req, res, next) => {
 //search the database to see if user exist
 try {
   //checking if email already exist
   const emailcheck = await User.findOne({
     where: {
       email: req.body.email,
     },
   });

   //if email exist in the database respond with a status of 409
   if (emailcheck) {
     return res.status(409).send("Authentication failed");
   }

   next();
 } catch (error) {
   console.log(error);
 }
};

//exporting module
 module.exports = {
 saveUser,
};
