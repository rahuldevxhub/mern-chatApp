import cloudinary from "../lib/cloudinary.js";
import messageModel from "../modals/messages.js";
import userModel from "../modals/user.js";
import {io,userSocketMap} from '../index.js'

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");

    //unseen msg
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await messageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.send({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//get all msgs

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await messageModel.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// seen msg using msgid

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await messageModel.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// send message to selected user

export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body;
    const receiverId = req.params.id;
    const senderId= req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image,{resource_type :"image"})
        imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await messageModel.create({
        senderId,
        receiverId,
        text,
        image:imageUrl
    })
    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage', newMessage);
    }


    res.json({
        success:true,
        newMessage
    })

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
