import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        {
          headers: {
            aToken,
          },
        }
      );
      if (data.success) {
        setDoctors(data.doctors);
        // console.log(data.doctors);
      } else {
        toast.error(data.message);
        console.error("Failed to fetch doctors");
      }
    } catch (error) {
      toast.error("Failed to fetch doctors");
      console.error("Error fetching doctors:", error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        {
          headers: {
            aToken,
          },
        }
      );
      if (data.success) {
        toast.success("Availability changed successfully");
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to change availability");
      console.error("Error changing availability:", error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/appointments",
        {},
        {
          headers: {
            aToken,
          },
        }
      );
      if (data.success) {
        // console.log(data.appointments);
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error("Error fetching appointments:", error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
        console.error("Failed to cancel appointment");
      }
    } catch (error) {
      toast.error("Failed to cancel appointment");
      console.error("Error canceling appointment:", error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData)
      } else {
        toast.error(data.message);
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {}
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    getAllAppointments,
    setAppointments,
    cancelAppointment,
    setDashData,
    dashData,
    getDashData 
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
