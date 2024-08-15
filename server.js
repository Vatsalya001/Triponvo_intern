//jshint esversion: 8
const express = require('express');
const sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
 const db = require('./Models');
 const userRoutes = require ('./Routes/userRoutes');
 const cors = require('cors');
 const passport = require('passport');
 const cookieSession = require('cookie-session');
const oauthSetup = require('./Controllers/oauth');
const fb = require('./Controllers/fb');
const { createApi } = require('unsplash-js');

const unsplashAccessKey = process.env.UNSPLASH_KEY;
const unsplashSecretKey = process.env.UNSPLASH_SECRET;
///const unsplashAPIBaseUrl = 'https://api.unsplash.com';

const unsplash = createApi({
  accessKey: unsplashAccessKey,
  secret: unsplashSecretKey,
});


const session = require('express-session');
//setting up your port
//const PORT = process.env.PORT || 5000;
const PORT = 5000;
/////////////////////////////////////////////////////////////////////////////////////////////
//UPDATE THE ITINERARY MODEL AND DATABASE (LIKE/DISLIKE ++ USER EMAIL)
////////////////////////////////////////////////////////////////////////////////////////////
//assigning the variable app to express
const app = express();

//middleware
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });
app.use(cors({
  origin:"http://localhost:3000",
  methods:"GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(
//  cookieSession({
//    name:"session",
//    keys: [process.env.secretKey],
//    maxAge: 24*60*60*1000,
//  })
//);
app.use(session({
    secret: 'triponvo-secret-Key',
    resave: false ,
    saveUninitialized: true ,
}));

app.use(passport.initialize());
app.use(passport.session());


//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been re sync");
});

//routes for the user API
app.use(userRoutes);

app.get('/search', async (req, res) => {
  const query = req.query.query;

  try {
    const response = await unsplash.search.getPhotos({
      query,
    });

    res.json(response.response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/test', async (req, res) => {
    console.log('WORKING');
    res.send('Working');
});

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
