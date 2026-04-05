<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function getCourses($semester)
    {
        $courses = [
            "1.1" => ["Structured Programming", "Calculus I", "Physics I"],
            "1.2" => ["Data Structures", "Calculus II", "Physics II"],
            "2.1" => ["Discrete Mathematics", "Digital Logic", "OOP"],
            "2.2" => ["Algorithms", "Computer Organization", "Statistics"],
            "3.1" => ["Operating Systems", "Database Systems", "Software Engineering"],
            "3.2" => ["Computer Networks", "Compiler Design", "Machine Learning"],
            "4.1" => ["Artificial Intelligence", "Distributed Systems"],
            "4.2" => ["Thesis", "Project"]
        ];

        return response()->json([
            "success" => true,
            "semester" => $semester,
            "courses" => $courses[$semester] ?? []
        ]);
    }
}