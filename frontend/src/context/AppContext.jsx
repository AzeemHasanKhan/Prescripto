import { createContext } from "react";
// import { doctors } from "../assets/assets";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
  const [userData,setUserData]  = useState(false);

  const currencySymbol = "$";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
        console.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadUserProfileData = async ()=>{
    try {

      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: {
          token
        },
      });
      if (data.success) {
        setUserData(data.userData)
      }
      else{
        toast.error(data.message)
      }
      

    } catch (error) {
      console.error(error);
      toast.error(error.message);  
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(()=>{
    if (token) {
      loadUserProfileData();
    }
    else{
      setUserData(false)
    }
  },[token])

  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    setUserData,
    userData,
    loadUserProfileData,
    
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
