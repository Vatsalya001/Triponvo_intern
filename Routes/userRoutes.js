//jshint esversion: 8
const express = require('express');
const userController = require('../Controllers/userController');
const { signup, login, getitinerary } = userController;
const userAuth = require('../Middlewares/userAuth');
const itineraryDups = require('../Middlewares/itineraryDups');
const verifyToken = require("../Middlewares/verifyToken");
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../Models");
const session = require('express-session');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('../Controllers/oauth');
const router = express.Router();
const User = db.users;
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
//signup endpoint
//passing the middleware function to the signup
router.post('/register', userAuth.saveUser, signup);

//login route
router.post('/login', login );

router.post('/getitinerary',itineraryDups.saveItinerary, getitinerary);
//////////////////////////////////////////////////////////////////////////////////////////////////////
// router.get('/dashboard', verifyToken.authenticateToken, (req, res) => {
//   res.send('Protected Dashboard');
// });
//////////////////////////////////////////////////////////////////////////////////////////////////////

let count = 1;
showlogs = (req, res, next) => {
    console.log("\n==============================");
    console.log(`------------>  ${count++}`);

    console.log(`\n req.session.passport -------> `);
    console.log(req.session.passport);

    console.log(`\n req.user -------> `);
    console.log(req.user);

    console.log("\n Session and Cookie");
    console.log(`req.session.id -------> ${req.session.id}`) ;
    console.log(`req.session.cookie -------> `) ;
    console.log(req.session.cookie) ;

    console.log("===========================================\n");

    next();
};

router.use(showlogs);
router.get('/auth/login/success', (req,res)=>{
  console.log(req.user);
  if (req.user) {
    const dataSend = {
      id : req.user.id,
      fullname: req.user.displayName,
      email: req.user.emails[0].value,
    };
    res.send({
      message: "Login is successfully",
      alert: "success",
      data: dataSend,
    });
  }
  else res.status(400).json({
    message : "User Not Authenticated",
   user : null
 });
});
/////////////////////////////////////////////////////////////////////
router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
/////////////////////////////////////////////////////////////////////////
// https://triponvo.com/auth/google/callback



//http://localhost:3000/googleauth
// router.get('/auth/google/callback',
//     passport.authenticate( 'google', {
//         successRedirect: 'http://localhost:5000/auth/login/success',
//         failureRedirect: '/login'
// }));

///////////////////////////////////////////////////////////////////////
router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'https://triponvo.com/login',
    }),
    function (req, res) {
        console.log('reached here');
        res.redirect('https://triponvo.com/googleauth');
    }
);

const checkAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};
///////////////////////////////////////////////////////////////////////////////////////
// router.get("/googleauth", (req, res) => {
//   console.log(req.user);
//     res.send(`Welcome ${req.user.email}`);
// });

//router.get("/login", (req, res) => {
//    res.send("login page");
//});


// const generateRandomString = (length) => {
//   let result = '';
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };
///////////////////////////////////////////////////////////////////////////////////////////////
//router.get('/dashboard', verifyToken.requireAuth, async(req, res)=>{
//  console.log('------------------------------DASHBOARD PAGE---------------------------------');
//  try {
    /////////////////update password if user is registered by google oauth
    // const user = verifyToken.checkUser;
    // if(user){
    //   console.log(user);
    //   const emailcheck = await User.findOne({
    //     where: {
    //       email: email,
    //     },
    //   });
    //   const fullname = "ddadad"; //////////check for the full name of the logged in user
    //   if(!emailcheck){
    //     var password = generateRandomString(8);  //generate a random password via js
    //     const data = {
    //       fullname,
    //       email,
    //       password: await bcrypt.hash(password, 10),
    //     };
    //     const user = await User.create(data);
    //   }
//      console.log("DASHBOARD PAGE");
    // }
    // console.log(req.user);
    // var fullname = req.user.displayName;
    // var email = req.user.emails[0].value;
    // var email = req.user.email;
    // res.send("dashboard page"+fullname);
  //} catch (error) {
  //  console.log(error);
  //}
//});
//////////////////////////////////////////////////////////////////////////////////////
// router.get("/dashboard", checkAuthenticated, async (req, res) => {
//   try {
//     console.log(req.user);
//     var fullname = req.user.displayName;
//     var email = req.user.emails[0].value;
//
//     const emailcheck = await User.findOne({
//       where: {
//         email: email,
//       },
//     });
//
//     if(!emailcheck){
//       var password = generateRandomString(8);  //generate a random password via js
//       const data = {
//         fullname,
//         email,
//         password: await bcrypt.hash(password, 10),
//       };
//       const user = await User.create(data);
//     }
//
//     res.send("dashboard page"+fullname);
//   } catch (error) {
//     console.log(error);
//   }
// });
const generateRandomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.post("/logout", (req,res) => {
  res.cookie('jwt', '', {maxAge: 1});
  console.log(`----> User Logged out`);
  res.redirect('/');
});

router.post("/forgotPassword", async (req, res)=>{
  const user = verifyToken.checkUser;
  const receiver = [
    {
      email: user.email,
    },
  ];
  //sgmail.setApiKey(process.env.sendgridApiKey);
  const newPassword = generateRandomString(6);
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = {
    email: 'royvatsalya26022003@gmail.com',
    name: 'Triponvo'
  };
  try {
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receiver,
      subject: `Triponvo Password Update`,
      textContent: `Your new Triponvo Password is ${newPassword}`,
    });
    console.log('Email Sent');
    return res.json({message: 'Email Sent'});
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
  User.update(
  { password: bcrypt.hash(password, 10) },
  {
    where: {
      email: receiver,
    },
  }
);

});

//////////////////////////////////////////////////////////////////////////////////
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('0000000000000000000000000000000000000000000000000000000000000000');
    res.redirect('https://triponvo.com/fbauth');
  });






module.exports = router;
