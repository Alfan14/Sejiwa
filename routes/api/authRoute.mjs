import express from "express";
import cors from 'cors';
import { getDatabase } from "../../db/conn.mjs";
import jwt        from 'jsonwebtoken';
import bcrypt     from 'bcryptjs';
import authenticateJWT from '../../middleware/authenticationJWT.mjs';
import dotenv from 'dotenv'

const router = express.Router();
router.use(express.json());
router.use(cors());

// Secret Key
const SECRET_KEY = process.env.SECRET_KEY ;

// Login Page
router.post('/login', async (req, res) => {
    try {
        const db = await getDatabase();
        let collection = await db.collection("users");

        const { email, password } = req.body;  

        if (!SECRET_KEY) {
            console.error(" SECRET_KEY is undefined! Make sure .env is loaded.");
            return res.status(500).send("Server error: Missing SECRET_KEY");
        }

        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid credentials');
        }

        console.log("SIGNING SECRET:", process.env.SECRET_KEY); 

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { algorithm: "HS256", expiresIn: '1h' });

        console.log("Generated Token:", token);

        res.json({ token });
        console.log("Received data:", req.body);
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).send('Error while processing the request');
    }
});

// Sign Up
router.post('/signup', async(req, res) => {
    try{
        const db = await getDatabase();
        let collection = await db.collection("users");

        const { email, password , role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);

        const newUser = { id: collection.length + 1, email, password: hashedPassword , role };

        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        const result = await collection.insertOne(newUser);

        if (result.insertedId) {
            const token = jwt.sign({ id: result.insertedId, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        }
        else {
            res.status(500).send('Error creating user');
        }
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).send('Error while processing the request');
    }

});
// Getting users
router.get("/me", authenticateJWT, async (req, res) => {
    try {
        console.log(" Decoded User:", req.user); 

        const db = await getDatabase();
        const collection = db.collection("users");

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send("Unauthorized"); 
        }

        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);

    } catch (err) {
        console.error(" Error during /auth/me:", err);
        res.status(500).send("Error while processing the request");
    }
});
  
export default router;