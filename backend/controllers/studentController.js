
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
    const limit = parseInt(req.query.l, 10);
    const page = parseInt(req.query.p);
    let students;

    if (limit && limit > 0) {
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalStudents = await Student.countDocuments();
        const students = await Student.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        //students = await Student.find().limit(limit);
    } else {
        students = await Student.find();
    }

    if (!students || students.length === 0) {
        return res.status(404).json({
            message: "students not found"
        });
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