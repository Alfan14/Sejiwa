import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { defaults } from "pg";
import db from "../models/index.mjs";

const SECRET_KEY = process.env.SECRET_KEY;

const User = db.users;

const register = async (req, res) => {
  try {
    const { username, email, password, role, profile_picture } = req.body;
    const data = {
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      profile_picture
    };

    const user = await User.create(data);

    if (user) {
      let token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    

    const refreshToken = jwt.sign(
      { id: user.id },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful.",
      token: token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const refreshtoken = async (req, res) => {
  const refreshToken = req.body.refresh_token; 

  if (!refreshToken) {
    return res.status(401).json({ message: "Access Denied. No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY);

    if (!decoded.id) {
      return res.status(400).json({ message: "Invalid refresh token payload." });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const newtoken = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ access_token: newtoken }); 
  } catch (error) {
    console.error("Refresh token error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Refresh token expired. Please login again." });
    }
    return res.status(400).json({ message: "Invalid refresh token." });
  }
};

export default {
  register,
  login,
  refreshtoken,
};
