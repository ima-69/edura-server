import { Router } from "express";
import { asyncHandler } from "../utils/handler.js";
import { auth, type AuthRequest } from "../middlewares/auth.js";
import { Response } from "express";
import { Class } from "../models/class.js";
import { Student } from "../models/student.js";
import { Teacher } from "../models/teacher.js";
import Exam from "../models/exam.js";

const router = Router();

// Get teacher dashboard stats
router.get("/dashboard", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;

    // Get teacher's courses count
    const coursesCount = await Class.countDocuments({ teacher: teacherId });

    // Get total students enrolled in teacher's courses
    const courses = await Class.find({ teacher: teacherId }).select('_id');
    const courseIds = courses.map(c => c._id);
    
    // Count unique students enrolled in these courses
    const enrolledStudents = await Student.find({ 
      classes: { $in: courseIds } 
    }).countDocuments();

    // Get active exams count
    const activeExams = await Exam.countDocuments({ 
      class: { $in: courseIds },
      end_time: { $gte: new Date() }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCourses: coursesCount,
        totalStudents: enrolledStudents,
        activeExams: activeExams,
        averageRating: 4.8 // Placeholder - implement rating system later
      }
    });
  }
));

// Get teacher's courses
router.get("/courses", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;

    const courses = await Class.find({ teacher: teacherId })
      .populate('teacher', 'first_name last_name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: courses
    });
  }
));

// Create a new course
router.post("/courses", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const { class_name, description, categories, price } = req.body;

    const course = await Class.create({
      class_name,
      description,
      categories,
      price,
      teacher: teacherId
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  }
));

// Update a course
router.put("/courses/:id", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const courseId = req.params.id;
    const { class_name, description, categories, price } = req.body;

    // Check if course belongs to this teacher
    const course = await Class.findOne({ _id: courseId, teacher: teacherId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to edit it"
      });
    }

    // Update course
    if (class_name) course.class_name = class_name;
    if (description) course.description = description;
    if (categories) course.categories = categories;
    if (price !== undefined) course.price = price;
    
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  }
));

// Delete a course
router.delete("/courses/:id", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const courseId = req.params.id;

    // Check if course belongs to this teacher
    const course = await Class.findOne({ _id: courseId, teacher: teacherId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to delete it"
      });
    }

    await course.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  }
));

// Get students enrolled in teacher's courses
router.get("/students", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;

    // Get all courses taught by this teacher
    const courses = await Class.find({ teacher: teacherId }).select('_id name');
    const courseIds = courses.map(c => c._id);

    // Find all students enrolled in these courses
    const students = await Student.find({ 
      classes: { $in: courseIds } 
    }).populate('classes', 'name');

    return res.status(200).json({
      success: true,
      data: students
    });
  }
));

// Get exams for teacher's courses
router.get("/exams", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;

    // Get all courses taught by this teacher
    const courses = await Class.find({ teacher: teacherId }).select('_id');
    const courseIds = courses.map(c => c._id);

    // Find all exams for these courses
    const exams = await Exam.find({ 
      class_id: { $in: courseIds } 
    }).populate('class_id', 'class_name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: exams
    });
  }
));

// Create a new exam
router.post("/exams", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const { exam_name, exam_description, class_id, exam_type, duration, mcq } = req.body;

    // Verify that the course belongs to this teacher
    const course = await Class.findOne({ _id: class_id, teacher: teacherId });
    
    if (!course) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to create exams for this course"
      });
    }

    const exam = await Exam.create({
      exam_name,
      exam_description,
      class_id,
      exam_type,
      duration,
      mcq: mcq || []
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam
    });
  }
));

// Update an exam
router.put("/exams/:id", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const examId = req.params.id;
    const { exam_name, exam_description, duration, exam_type } = req.body;

    // Get exam and verify teacher owns the course
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    // Check if the course belongs to this teacher
    const course = await Class.findOne({ _id: exam.class_id, teacher: teacherId });
    
    if (!course) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this exam"
      });
    }

    // Update exam
    if (exam_name) exam.exam_name = exam_name;
    if (exam_description) exam.exam_description = exam_description;
    if (duration) exam.duration = duration;
    if (exam_type) exam.exam_type = exam_type;
    
    await exam.save();

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam
    });
  }
));

// Delete an exam
router.delete("/exams/:id", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const examId = req.params.id;

    // Get exam and verify teacher owns the course
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    // Check if the course belongs to this teacher
    const course = await Class.findOne({ _id: exam.class_id, teacher: teacherId });
    
    if (!course) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this exam"
      });
    }

    await exam.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully"
    });
  }
));

// Get teacher profile
router.get("/profile", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;

    const teacher = await Teacher.findById(teacherId)
      .select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: teacher
    });
  }
));

// Update teacher profile
router.put("/profile", auth(true, ['teacher']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teacherId = req.user?.id;
    const { first_name, last_name, bio, mobile } = req.body;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    // Update fields
    if (first_name) teacher.first_name = first_name;
    if (last_name) teacher.last_name = last_name;
    if (bio) teacher.bio = bio;
    if (mobile) teacher.mobile = mobile;

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: teacher
    });
  }
));

export default router;

