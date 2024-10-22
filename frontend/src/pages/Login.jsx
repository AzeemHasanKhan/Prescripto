import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {

  const {token,setToken,backendUrl} = useContext(AppContext);
  const navigate = useNavigate()

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try{
      if(state === "Sign Up"){
        const {data} = await axios.post(backendUrl + "/api/user/register", {name,email,password})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
          toast.success("Account created successfully. You can now login.")
          setState("Sign In")
        }
        else{
          toast.error(data.error)
        }
      }
      else{

        const {data} = await axios.post(backendUrl + "/api/user/login", {email,password})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
          toast.success("Logged in successfully.")
        }
        else{
          toast.error(data.error)
        }

      }
    }
    catch(error){
      toast.error("Failed to login/signup. Please check your credentials and try again.")
    }
  };

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  })

  return (
    <form onSubmit={onSubmitHandler} className=" flex items-center min-h-[80vh]">
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg ">
        <p className=" text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign up" : "log in"} sign up to book
          appointment
        </p>
        {state === "Sign Up" && (
          <div className=" w-full">
            <p>Full Name</p>
            <input
              className=" border border-zinc-300 rounded  w-full p-2 m-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}
        <div className=" w-full">
          <p>Email</p>
          <input
            className=" border border-zinc-300 rounded  w-full p-2 m-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className=" w-full">
          <p>Password</p>
          <input
            className=" border border-zinc-300 rounded  w-full p-2 m-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit" className=" bg-primary text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className=" text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              onClick={() => setState("Sign Up")}
              className=" text-primary underline cursor-pointer"
            >
              {" "}
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login;