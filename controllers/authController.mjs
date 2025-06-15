import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { defaults } from "pg";
import db from "../models/index.mjs";

  // Calling a secret key
const SECRET_KEY = process.env.SECRET_KEY ;


  // Assigning users to the variable User
const User = db.users;

  //  signing a user up
  //  hashing users password before its saved to the database with bcrypt
const register = async (req, res) => {
 try {
   const { username, email, password , role } = req.body;
   const data = {
     username,
     email,
     password: await bcrypt.hash(password, 10),
     role
   };
   // saving the user
   const user = await User.create(data);

   if (user) {
     let token = jwt.sign({ id: user.id },SECRET_KEY, {
       expiresIn: 1 * 24 * 60 * 60 * 1000,
     });

     res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
     console.log("user", JSON.stringify(user, null, 2));
     console.log(token);
     //send users details
     return res.status(201).send(user);
   } else {
     return res.status(409).send("Details are not correct");
   }
 } catch (error) {
   console.log(error);
 }
};

  //  login authentication
const login = async (req, res) => {
 try {
const { email, password } = req.body;

  //  find a user by their email
   const user = await User.findOne({
     where: {
     email: email
   } 
     
   });

   // if user email is found, compare password with bcrypt
   if (user) {
     const isSame = await bcrypt.compare(password, user.password);

    //  if password is the same
    //  generate token with the user's id and the secretKey in the env file

     if (isSame) {
       let token = jwt.sign({ id: user.id,username: user.username, email: user.email, role: user.role }, SECRET_KEY, {
        expiresIn: '1d',
        });

       //if password matches wit the one in the database
       //go ahead and generate a cookie for the user
       res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
       console.log("user", JSON.stringify(user, null, 2));
       console.log(token);
       //send user data
       return res.status(200).send(token);
     } else {
       return res.status(401).send("Authentication failed");
     }
   } else {
     return res.status(401).send("Authentication failed");
   }
 } catch (error) {
   console.log(error);
 }
};

export default {
 register,
 login,
};
