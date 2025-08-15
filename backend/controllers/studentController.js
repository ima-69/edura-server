
import {Student} from "../models/student.js";


const studentDetails = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.status(400).json({
            "message": "id is required"
        })
    }
    const student = await Student.findById(id).select('_id first_name last_name mobile email student_status date_of_birth createdAt updatedAt');
    if (!student) {
        res.status(404).json({"message": "student not found"})
    }
    res.status(200).json({
        message: "student details successfully",
        student: {
            id: student._id,
            first_name: student.first_name,
            last_name: student.last_name,
            mobile: student.mobile,
            student_status: student.student_status,
            date_of_birth: student.date_of_birth,
            created: student.createdAt,
        }
    })

}

export {studentDetails}