import express from "express";
import db from "../models/index.mjs";

 const User = db.users;

 const saveUser = async (req, res, next) => {
 try {
   const username = await User.findOne({
     where: {
       username: req.body.username,
     },
   });
   if (username) {
     return res.json(409).send("username already taken");
   }

   const emailcheck = await User.findOne({
     where: {
       email: req.body.email,
     },
   });

   if (emailcheck) {
     return res.json(409).send("Authentication failed");
   }

   next();
 } catch (error) {
   console.log(error);
 }
};

 export default {
 saveUser,
};