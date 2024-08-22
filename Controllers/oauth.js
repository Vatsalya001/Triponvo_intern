//jshint esversion: 8
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const db = require("../Models");
const bcrypt = require("bcrypt");

const User = db.users;


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

authUser = async (request, accessToken, refreshToken, profile, done) => {
    console.log(profile);
    const fullname = profile.displayName;
    const email = profile.emails[0].value;
    const emailcheck = await User.findOne({
      where: {
        email: email,
      },
    });
    if(emailcheck){
      console.log("current user is ", emailcheck);
      done(null, emailcheck);
    } else{
      var password = generateRandomString(8);  //generate a random password via js
      const data = {
        fullname,
        email,
        password: await bcrypt.hash(password, 10),
      };
      const user = await User.create(data);
      console.log("New user is ", user);
      done(null, user);
    }
    return done(null, profile);
  };
//Use "GoogleStrategy" as the Authentication Strategy
passport.use(new GoogleStrategy({
    clientID:     '1069184975667-opvem2ud98ljjp22jp63uje2ms7146i9.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://api.triponvo.com/auth/google/callback",
    passReqToCallback   : true
  }, authUser));


passport.serializeUser( (user, done) => {
    console.log(`\n------> Serialize User:`);
    console.log(user);
     // The USER object is the "authenticated user" from the done() in authUser function.
     // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

    done(null, user);
} );


passport.deserializeUser((user, done) => {
        console.log(`\n------- Deserialized User:`);
        console.log(user);
        // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
        // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

        done (null, user);
}) ;



// passport.deserializeUser((id, done) => {
//         console.log(`\n------- Deserialized User:`);
//         const user = User.findOne({
//           where: {
//             id: id,
//           },
//         });
//         console.log(user);
//         // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
//         // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
//         done (null, user);
//
// }) ;
// passport.serializeUser( (user, done) => {
//     console.log(`\n------> Serialize User:`);
//     console.log(user);
//      // The USER object is the "authenticated user" from the done() in authUser function.
//      // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.
//
//     done(null, user.id);
// } );
// passport.deserializeUser(function(id, done){
//   const user = User.findOne({
//     where: {
//       id: id,
//     },
//   }, (err, user)=>{
//     done(err, user);
//   });
//
//
// });
// const googleAuth = ()=>{
//   window.open(
//     `http://localhost:5000/auth/google/callback`,
//     "_self"
//   );
// };
