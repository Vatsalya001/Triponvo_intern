//jshint esversion: 8
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require("../Models");
const bcrypt = require("bcrypt");

require('dotenv').config();
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

passport.use(new FacebookStrategy({
    clientID: '963118758106441',
    clientSecret: '9a96a5e1faf017a5a4d35b5a1251527d',
    callbackURL: "https://api.triponvo.com/auth/facebook/callback",
    profileFields: ['displayName', 'email'],
  },
  async function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
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
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  const user = User.findOne({
    where: {
      id: id,
    },
  }, (err, user)=>{
    done(err, user);
  });


});
