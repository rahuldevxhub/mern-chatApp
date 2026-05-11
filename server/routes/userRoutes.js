import express from "express";
import {
  checkAuth,
  hello,
  login,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";
const router = express.Router();

router.get("/", hello, (req, res) => {
  res.send("hellw budy");
});

router.post("/signup", signup);

router.post("/login", login);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
