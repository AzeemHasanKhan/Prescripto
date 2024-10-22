import express from "express";
import { addDoctor, adminDashboard, allAppointmentsAdmin, allDoctors, appoinmentCancel, loginAdmin } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor",authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin,allDoctors);
adminRouter.post("/change-availability", authAdmin,changeAvailability);
adminRouter.post("/appointments", authAdmin, allAppointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appoinmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);


export default adminRouter;