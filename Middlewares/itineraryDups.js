//jshint esversion: 8
const express = require("express");
const db = require("../Models");
//Assigning db.users to User variable
 const Itinerary = db.itineraries;

//Function to check if itinerary already exist in the database
 const saveItinerary = async (req, res, next) => {
 //search the database to see if user exist
 try {
   //checking if Itinerary already exist
   const itinerarycheck = await Itinerary.findOne({
     where: {
       destination: req.body.destination,
       numberOfDays: req.body.numberOfDays,
     },
   });


   if (itinerarycheck) {
     return res.send(itinerarycheck.jsonResult);
   }

   next();
 } catch (error) {
   console.log(error);
 }
};

//exporting module
 module.exports = {
 saveItinerary,
};
