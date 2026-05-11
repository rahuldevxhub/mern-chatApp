import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import userModel from "../modals/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
        error
      });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).send({
        success: false,
        message: "User already registered. Please login",
        error
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    res.send({
      success: true,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).send({
      success: false,
      
      message: "Internal Server Error",
    });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send({
        success: false,
    
        message: "please provide all details",
      });
    }
    const userData = await userModel.findOne({ email });

    if (!userData) {
      return res.status(400).send({
        success: false,
        message: 'Invalid credentials',
      });
    }
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: 'Invalid credentials',
      });
    }
    const token = generateToken(userData._id);
    res.send({
      success: true,
      token,
      userData,
      message: "Login Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 //controller to check if uer is authenticated

export const checkAuth = (req,res) => {
    res.send({
        success:true,
        user:req.user
    })
}

// controller to update user profile

export const updateProfile = async(req,res) => {
  try {
    const {profilePic, bio, fullName} = req.body;

    const userId = req.user._id;
    let updatedUser;
    if(!profilePic){
      updatedUser =await userModel.findByIdAndUpdate(userId, {bio, fullName},
        {new:true}
      );

    }else{
      const upload = await cloudinary.uploader.upload(profilePic)
      updatedUser = await userModel.findByIdAndUpdate(userId, {profilePic:upload.secure_url, bio, fullName},{new:true});
    }
    res.send({
      success:true,
      message:'Update Successfully',
      user:updatedUser
    })
    
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
    
  }
}

export const hello = (req,res) => {
  res.send('hello buddy')
}