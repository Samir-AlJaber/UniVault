<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SemesterController extends Controller
{
    public function index()
    {
        $semesters = [
            "1.1",
            "1.2",
            "2.1",
            "2.2",
            "3.1",
            "3.2",
            "4.1",
            "4.2"
        ];

        return response()->json([
            "success" => true,
            "semesters" => $semesters
        ]);
    }
}