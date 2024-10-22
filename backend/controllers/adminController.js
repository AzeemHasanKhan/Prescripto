import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
///ading doctors in admin
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // console.log({name,email,password,speciality,degree,experience,about,fees,address},imageFile) //cod eis working properly
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "All fields are required Missing details",
      });
    }
    //validatingg emial format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email format",
      });
    }
    //password validation
    if (!validator.isLength(password, { min: 8 })) {
      return res.json({
        success: false,
        message: "Password should be at least 6 characters long",
      });
    }
    // hashing password and storing in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //uplod image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image: imageUrl,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get all doctor's list for admin pannel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

    res.json({ success: true, doctors });
  } catch {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to get all appoinmnets data

const allAppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const appoinmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //realizing doctro slots
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);

    let slots_booked = docData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots_booked });

    res.json({ success: true, message: "Appointment Cancelled Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//api to get dashboard data for admin
const adminDashboard = async (req,res)=>{
  try {

    const doctors = await doctorModel.find({});
    const users =  await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors :doctors.length,
      appointments :appointments.length,
      patients: users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({ success: true, dashData });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export { addDoctor, loginAdmin, allDoctors, allAppointmentsAdmin, appoinmentCancel,  adminDashboard  };
