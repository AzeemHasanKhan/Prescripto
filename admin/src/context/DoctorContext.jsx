import { createContext, useState } from "react";
import axios from "axios";
// import toast from "react-toastify"
// import toast from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log("Fetched appointments", data.appointments);
      } else {
        // toast.error(data.message);
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        // toast.success(data.message);
        alert(data.message);
        getAppointments();
      } else {
        // toast.error(data.message);
        alert(data.message);
        console.error("Failed to complete appointment");
      }
    } catch (error) {
      console.error("Failed to complete appointment", error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        // toast.success(data.message);
        alert(data.message);
        getAppointments();
      } else {
        // toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to cancel appointment", error);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        // toast.error(data.message);
        alert(data.message);
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      alert(error.message);
      console.error("Failed to fetch dashboard data", error);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        // toast.error(data.message);
        alert(data.message);
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      // toast.error(error.message);
      alert(error.message);
      console.error("Failed to fetch profile data", error);
    }
  };

  const value = {
    backendUrl,
    dToken,
    setDToken,
    getAppointments,
    appointments,
    setAppointments,
    completeAppointment,
    cancelAppointment,
    getDashData,
    dashData,
    setDashData,
    getProfileData,
    profileData,
    setProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
