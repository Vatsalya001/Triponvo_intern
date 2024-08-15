//jshint esversion: 11
const jwt = require('jsonwebtoken');
const db = require("../Models");
//Assigning db.users to User variable
 const User = db.users;


const requireAuth = async(req, res, next)=>{
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'triponvo-secret-Key', (err, decodedToken)=>{
      if(err){
        console.log(err);
        //check for oauth
        if (req.isAuthenticated()) {
          next();
        }
        res.redirect('/login');
      } else{
        console.log(decodedToken);
        next();
      }
    });
  }
  else{
    res.redirect('/login');
  }
};


//check current user
const checkUser = (req, res, next)=>{
  try{
    if(token){
      jwt.verify(token, 'triponvo-secret-Key',async (err, decodedToken)=>{
        if(err){
          console.log(err);
          if (req.isAuthenticated()) {
            const user = req.user;
            return user;
            // next();
          }
          // next();
        } else{
          console.log(decodedToken);
          const user = await User.findOne({
            where: {
              id: decodedToken.id,
            },
          });
          return user;
        }
      });
    }
    // else{
    //   next();
    // }

  }
  catch(error){
    console.log(error);
  }
};


module.exports = {
  requireAuth,
  checkUser,
};
// const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library');
//
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//
//
// const verifyToken = (req, res, next) => {
//   console.log('----------------------------OAUTH+JWT----------------------------------');
//
//   const jwtToken = req.headers.authorization?.split(' ')[1];
//   const oauthAccessToken = req.headers['x-oauth-access-token']; // You may use any custom header for the OAuth access token.
//
//   if (!jwtToken || !oauthAccessToken) {
//     console.log('----------------------------OAUTH+JWT UNAUTHORIZED----------------------------------');
//
//     return res.status(401).json({ message: 'Authentication required' });
//   }
//
//   try {
//     // Verify JWT token
//     const jwtPayload = jwt.verify(jwtToken, process.env.secretKey);
//     const userIdFromJwt = jwtPayload.id;
//
//     // Verify OAuth access token
//     client.verifyIdToken({
//       idToken: oauthAccessToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     })
//       .then((ticket) => {
//         const payload = ticket.getPayload();
//         const userIdFromOAuth = payload.sub;
//
//         // Check if the user ID from JWT and OAuth matches
//         if (userIdFromJwt === userIdFromOAuth) {
//           // Authentication successful, user is authorized to access the dashboard route.
//           req.userId = userIdFromJwt; // Save the user ID in the request for further processing if needed.
//           console.log('----------------------------OAUTH+JWT----------------------------------');
//           next();
//         } else {
//           return res.status(403).json({ message: 'Forbidden' });
//         }
//       })
//       .catch((err) => {
//         return res.status(401).json({ message: 'Invalid OAuth token' });
//       });
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid JWT token' });
//   }
// };
// module.exports = {
// verifyToken,
// };
// module.exports = verifyToken;
//////////////////////////////////////////////////////////////////////////////////////////////
// const jwt = require("jsonwebtoken");
// const User = require("../Models/userModel");
//
// const verifyToken = (req, res, next) => {
//   console.log('RUNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');
//   const authorizationHeader = req.headers.authorization;
//   console.log('RUNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');
//   if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//     const token = authorizationHeader.split(' ')[1];
//
//     jwt.verify(token, process.env.secretKey, (err, decode) => {
//       console.log('RUNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');
//       if (err) {
//         // Token is invalid or expired
//         req.user = undefined;
//         next(); // Continue to the next middleware
//       } else {
//         // Token is valid, try to find the user in the database
//         User.findOne({
//           where: {
//             id: decode.id
//           }
//         })
//           .then((user) => {
//             console.log('------------------------------VERIFY TOKEN--------------------------');
//             if (!user) {
//               req.user = undefined;
//             } else {
//               req.user = user;
//             }
//             next(); // Continue to the next middleware
//           })
//           .catch((err) => {
//             console.error('Error finding user:', err);
//             res.status(500).send({ message: 'Error finding user' });
//           });
//       }
//     });
//   } else {
//     // No authorization header or incorrect format
//     req.user = undefined;
//     next(); // Continue to the next middleware
//   }
// };
//
// module.exports = verifyToken;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
