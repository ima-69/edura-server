import { Router } from "express";
import { asyncHandler } from "../utils/handler.js";
import { auth, type AuthRequest } from "../middlewares/auth.js";
import { Response } from "express";
import { Class } from "../models/class.js";
import { Student } from "../models/student.js";
import { Teacher } from "../models/teacher.js";
import { Admin } from "../models/admin.js";

const router = Router();

// Dashboard Stats
router.get("/dashboard", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    // Get total counts
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalCourses = await Class.countDocuments();
    
    // TODO: Implement payment tracking
    const totalRevenue = 145678; // Placeholder
    
    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalRevenue
      }
    });
  }
));

// User Management - Get All Students
router.get("/users/students", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search 
      ? {
          $or: [
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
    
    const students = await Student.find(query)
      .select('-password')
      .populate('classes', 'class_name')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Student.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      data: {
        students,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  }
));

// User Management - Get All Teachers
router.get("/users/teachers", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search 
      ? {
          $or: [
            { first_name: { $regex: search, $options: 'i' } },
            { last_name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
    
    const teachers = await Teacher.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    
    // Get student count for each teacher
    const teachersWithCounts = await Promise.all(
      teachers.map(async (teacher) => {
        const courses = await Class.find({ teacher: teacher._id });
        const courseIds = courses.map(c => c._id);
        const studentCount = await Student.countDocuments({ classes: { $in: courseIds } });
        
        return {
          ...teacher.toObject(),
          studentCount,
          courseCount: courses.length
        };
      })
    );
    
    const total = await Teacher.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      data: {
        teachers: teachersWithCounts,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  }
));

// Update User Status (Student or Teacher)
router.patch("/users/:userType/:userId/status", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userType, userId } = req.params;
    const { status } = req.body;
    
    let user;
    if (userType === 'student') {
      user = await Student.findByIdAndUpdate(
        userId,
        { student_status: status },
        { new: true }
      );
    } else if (userType === 'teacher') {
      user = await Teacher.findByIdAndUpdate(
        userId,
        { teacher_status: status },
        { new: true }
      );
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  }
));

// Delete User (Student or Teacher)
router.delete("/users/:userType/:userId", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userType, userId } = req.params;
    
    let user;
    if (userType === 'student') {
      user = await Student.findByIdAndDelete(userId);
    } else if (userType === 'teacher') {
      user = await Teacher.findByIdAndDelete(userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  }
));

// Course Management - Get All Courses
router.get("/courses", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    
    const courses = await Class.find()
      .populate('teacher', 'first_name last_name email')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    
    // Get student count for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Student.countDocuments({ classes: course._id });
        return {
          ...course.toObject(),
          studentCount
        };
      })
    );
    
    const total = await Class.countDocuments();
    
    return res.status(200).json({
      success: true,
      data: {
        courses: coursesWithCounts,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  }
));

// Update Course Status
router.patch("/courses/:courseId/status", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const { status } = req.body;
    
    const course = await Class.findByIdAndUpdate(
      courseId,
      { class_status: status },
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Course status updated successfully",
      data: course
    });
  }
));

// Delete Course
router.delete("/courses/:courseId", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    
    const course = await Class.findByIdAndDelete(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  }
));

// Payment Management - Get All Payments
router.get("/payments", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    
    // TODO: Implement actual payment model and queries
    // This is a placeholder response
    const payments = [
      {
        _id: '1',
        transactionId: 'TXN10001',
        student: { name: 'John Doe', email: 'john@example.com' },
        course: 'React Fundamentals',
        amount: 299,
        status: 'completed',
        date: new Date()
      }
    ];
    
    return res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          total: 100,
          page: Number(page),
          limit: Number(limit),
          pages: 10
        },
        stats: {
          totalRevenue: 145678,
          pendingPayments: 12450,
          thisMonth: 45678,
          failed: 2340
        }
      }
    });
  }
));

// Reports - Recent Activity
router.get("/reports/recent-activity", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    // Get recent enrollments
    const recentStudents = await Student.find()
      .select('first_name last_name email classes createdAt')
      .populate('classes', 'class_name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    return res.status(200).json({
      success: true,
      data: {
        recentEnrollments: recentStudents
      }
    });
  }
));

// Get Admin Profile
router.get("/profile", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    
    const admin = await Admin.findById(adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: admin
    });
  }
));

// Update Admin Profile
router.put("/profile", auth(true, ['admin', 'superadmin']), asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    const { first_name, last_name, mobile } = req.body;
    
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }
    
    if (first_name) admin.first_name = first_name;
    if (last_name) admin.last_name = last_name;
    if (mobile) admin.mobile = mobile;
    
    await admin.save();
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: admin
    });
  }
));

export default router;


