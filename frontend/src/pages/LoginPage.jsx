import { useContext, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../assets/cat.png";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault()

    if(currentState === "Sign Up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return 
    }
    login(currentState === "Sign Up" ? "signup" : "login", {
      fullName, email, password, bio
    })

  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

      <img src={Logo} alt="LOGO" className="w-[min(30vw,250px)]" />

      <form onSubmit={handleSubmit} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted &&  <KeyboardArrowLeftIcon onClick={()=> setIsDataSubmitted(false)} className="w-5 cursor-pointer " /> }
         
        </h2>
        {currentState == "Sign Up" && !isDataSubmitted && (
          <input
          value={fullName}
            onChange={(e)=> setFullName(e.target.value)}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="email"
              required
            />

            <input
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}
        {
          currentState === 'Sign Up' && isDataSubmitted && (
            <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
             rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-50-500" placeholder="provide your bio" required></textarea>
          )
        }
        <button className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
          {
            currentState === "Sign Up" ? "Create Account" : "Login"
          }
        </button >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
          
        </div>
        <div className="flex flex-col gap-2">
          {
            currentState === "Sign Up" ? (
              <p className="text-sm text-gray-600">Already have an account? <span  onClick={() => {setCurrentState("Login"); setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Login Here</span></p>
            ) : (
              <p className="text-sm text-gray-600">Create an account <span
              onClick={() =>setCurrentState("Sign Up")}
              className="font-medium text-violet-500 cursor-pointer" >Click here </span></p>
            )
          }
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
