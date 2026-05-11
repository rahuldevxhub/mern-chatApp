import userModel from "../modals/user.js";
import jwt from 'jsonwebtoken';


export const protectRoute = async(req, res, next) => {
      try {
        const token = req.headers.token;

         if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("-password");
        

        if(!user){
            return res.status(400).send({
                success:false, 
                message:"User Not Found"
            })
        }

        req.user = user ;
       
        next();
       
        
      } catch (error) {
        console.log(error);

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
        
      }
}
