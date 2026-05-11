import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from 'socket.io-client'
 /* eslint-disable react-refresh/only-export-components */

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL= backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token , setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth = async()=> {
        try {
           const {data}= await axios.get('/api/chatapp/user/check')
           if(data.success){
            setAuthUser(data.user)
            connectSocket(data.user)
           }
            
        } catch (error) {
            toast.error(error.message)
            
            
        }
    }
//login function to handle user authentication and socket connection

const login = async (state, credentials) => {
    try {
        const {data} = await axios.post(`/api/chatapp/user/${state}`, credentials)
        if(data.success){
            setAuthUser(data.userData)
            connectSocket(data.userData);
           axios.defaults.headers.common['token'] = token;
            setToken(data.token);
            localStorage.setItem('token', data.token)
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
        
    } catch (error) {
        toast.error(error.message)
        
    }

}

const logout = async() => {
    localStorage.removeItem('token')
        setToken(null)
            setAuthUser(null)
            setOnlineUser([]);
            axios.defaults.headers.common['token']= null;
            toast.success('Logged out successfully')
            socket?.close()

}

//update profile function

const updateProfile = async (body) => {

    try {

        const { data } = await axios.put(
            "/api/chatapp/user/update-profile",
            body
        );

        if (data.success) {

            setAuthUser(data.user);

            toast.success("Profile updated successfully");

        } else {

            toast.error(data.message);
        }

    } catch (error) {

        toast.error(error.message);
    }
};


// connect socket

const connectSocket = (userData) => {
    if(!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
        query:{
            userId: userData._id,
            
        }
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on('getOnlineUsers', (userIds) => {
        setOnlineUser(userIds)
    })
}


  useEffect(() => {
    if(token){
        axios.defaults.headers.common['token'] =token;
        checkAuth()
    }
    
  },[token])

const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile

};
return(
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);
};