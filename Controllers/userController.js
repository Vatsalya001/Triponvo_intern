//jshint esversion: 8
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { getChatGPTResponse } = require('../chatGPT/gpt');

const User = db.users;
const Itinerary = db.itineraries;

const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const data = {
      fullname,
      email,
      password: await bcrypt.hash(password, 10),
    };

    //Finding the the email, if it is already registered
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      //saving the user
      const user = await User.create(data);

      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      res.send({ message: "Successfully Sign Up", alert: true });
    }
  } catch (error) {
    console.log(error);
  }
};


//login authentication

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user

      if (isSame) {
        var token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches with the one in the database
        //go ahead and generate a cookie for the user

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        console.log(
          "--------------------------------LOGGED IN-----------------------------------"
        );
        // return token;

        const dataSend = {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
        };
        console.log(dataSend);
        res.send({
          message: "Login is successfully",
          alert: "success",
          data: dataSend,
        });
      } else {
        return res.status(401).json({ alert: "passwordNotMatch" });
      }
    } else {
      return res.status(404).json({ alert: "emailNotFound" });
    }
  } catch (error) {
    console.log(error);
  }
};



//getitinerary
const getitinerary = async(req, res) => {
  try {
    const { destination, startDate, endDate, numberOfDays, email, options} = req.body;////////////////////////////replace
    //////       FETCH IF ENTRY IS ALREADY PRESENT
    const itinerarycheck = await Itinerary.findOne({
      where: {
        destination: req.body.destination,
        numberOfDays: req.body.numberOfDays,
      },
    });
    if(itinerarycheck){
      const dup_result = JSON.parse(itinerarycheck.jsonResult);
      return res.json({ reply: dup_result });
    }


      const message = "Create personalized itinerary for couple who travel at fast pace based on below trip details Trip Details:Destination:"+destination+",Dates:"+startDate+"for"+numberOfDays+"days. Rule 1 Output must be in JSON list format where each element of list denotes one day and each day is dictionary with keys day_number(not nullable) , itinerary, placename(not nullable) where the place is inside destination and budget where budget's value denotes budget per day per person in US DOllar. Rule 2 Itinerary key's value must be in list format where each element in list describe each Activity or Attraction that traveller must do or visit based on trip details Intra City travel that traveller must do for travelling from one place to another inside one city along with hotel check-in Intercity travel that traveller must do for travelling from one city to another city. Rule 3 Each element in the itinerary key list list must have following keys. Type of element `name` (not nullable), `start_time` in 12 hours format (can be null) `end_time` in 12 hours format (can be null) `description` (not nullable). Rule 4 Attraction or activity description must be 20-30 words and should excite traveller to visit that attraction or activity. Rule 5 Intra city travel description must be of 10-20 words and contain popular and most convenient modes of transportation. Rule 6 Inter city travel description must be of 20-30 words and contain most popular and most convenient mode and time of transportation along with hotel checkin. Rule 7 Itinerary planning must also consider time for meals and lesiure that traveller will have Rule 8 Day 1 should also consider intercity travel and time from source to destination. Rule 9 Day 7 should also consider intercity travel and time from destination to source. Rule 10 No activity or attraction must be visited more than once by traveller. Rule 11 placename must be the place inside Destination. Rule 12 Only give the JSON file and no other words in the asnwer.";//to be edited

      const response = await getChatGPTResponse(message);
      //////SAVE IN THE ITINERARY TABLE
      const jsonResult = JSON.stringify(response);
      const entry = {
        startDate,
        destination,
        numberOfDays,
        jsonResult,
      };

      const itinerary = await Itinerary.create(entry);
      return res.json({ reply: response });

  } catch (error) {
    console.error('Error handling chat request:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
 signup,
 login,
 getitinerary,
};
