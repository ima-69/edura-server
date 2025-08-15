
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
        data: {
            student: {
                id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                mobile: student.mobile,
                student_status: student.student_status,
                date_of_birth: student.date_of_birth,
                created: student.createdAt,
            }
        }

    })

}

const allStudents = async (req, res) => {
    const students = await Student.find();
    if(!students){
        res.status(200).json({
            message: "students not found"
        })
    }

    const studentArray = students.map((student) => ({
        id: student._id,
        first_name: student.first_name,
        last_name: student.last_name,
        mobile: student.mobile,
        student_status: student.student_status,
        date_of_birth: student.date_of_birth,
        created: student.createdAt,
    }))

    res.status(200).json({
        message: "all student details",
        data: studentArray,
    })
}

export {studentDetails, allStudents}