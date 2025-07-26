import { Request, Response } from "express";
import { StudentServices } from "./student.service";
// import { studentValidationSchema } from "./student.validation";
import { studentValidationSchemaByZod } from "./student.validation";

const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body;

    //* data validation using Zod
    // const zodValidatedData = studentValidationSchemaByZod.parse(studentData);

    // will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(studentData);

    //Send response
    res.status(200).json({
      success: true,
      message: "Student is created succesfully",
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    //Send response
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    //Send response
    res.status(200).json({
      success: true,
      message: "Students are retrieved succesfully",
      data: result,
    });
  } catch (error) {
    //Send response
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.getSingleStudentFromDB(studentId);

    //Send response
    res.status(200).json({
      success: true,
      message: "Student is retrieved succesfully",
      data: result,
    });
  } catch (error) {
    //Send response
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentFromDB(studentId);

    //Send response
    res.status(200).json({
      success: true,
      message: "Student deleted succesfully",
      data: result,
    });
  } catch (error) {
    //Send response
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
