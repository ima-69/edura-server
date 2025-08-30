import {Payment} from "../models/payments.js";
import {Student} from "../models/student.js";
import {Class} from "../models/class.js";
import mongoose from "mongoose";


const createPayment = async (req, res) => {
    try {
        const { student_id, class_id, reference } = req.body;

        //check student exists
        const student = await Student.findById(student_id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        //Check class exists
        const classObj = await Class.findById(class_id);
        if (!classObj) {
            return res.status(404).json({ message: "Class not found" });
        }

        //heck student paid this month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const existingPayment = await Payment.findOne({
            student_id,
            class_id,
            payment_date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (existingPayment) {
            return res.status(400).json({ message: "Payment already made for this month" });
        }

        //create payment
        const payment = new Payment({
            student_id,
            class_id,
            reference,
            payment_date: new Date()
        });

        await payment.save();

        return res.status(201).json({
            message: "Payment successful", payment
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error" ,
            error: error.message
        });
    }
}

const getPaymentsByStudent = async (req, res) => {
    try {
        const id = req.query.student_id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student id" });
        }

        const payments = await Payment.find({ id }).populate("class_id");
        return res.status(200).json({
            message: "Successfully get payments for student",
            "data" : [payments]
        }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}