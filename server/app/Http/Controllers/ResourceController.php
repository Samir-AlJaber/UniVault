<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resource;

class ResourceController extends Controller
{

    public function getCourses($semester)
    {
        $courses = [
            "1.1" => ["Structured Programming", "Math 1"],
            "1.2" => ["Data Structures", "Math 2"],
            "2.1" => ["Discrete Mathematics", "Digital Logic", "OOP"],
            "2.2" => ["Algorithms", "Computer Organization"],
            "3.1" => ["Operating Systems", "Database Systems"],
            "3.2" => ["Computer Networks", "Software Engineering"],
            "4.1" => ["AI", "Machine Learning"],
            "4.2" => ["Project", "Internship"]
        ];

        return response()->json([
            "success" => true,
            "courses" => $courses[$semester] ?? []
        ]);
    }

    public function getResources($course)
    {
        $resources = Resource::where('course', $course)->get();

        return response()->json([
            "success" => true,
            "resources" => $resources
        ]);
    }

    public function upload(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string',
                'semester' => 'required|string',
                'course' => 'required|string',
                'file' => 'required|file|mimes:pdf',
                'user_id' => 'required'
            ]);

            $path = $request->file('file')->store('resources', 'public');

            $resource = Resource::create([
                'title' => $request->title,
                'semester' => $request->semester,
                'course' => $request->course,
                'file_path' => $path,
                'type' => 'pdf',
                'user_id' => $request->user_id
            ]);

            return response()->json([
                'success' => true,
                'resource' => $resource
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $resource = Resource::find($id);

            if (!$resource) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found'
                ]);
            }

            if ($resource->user_id != $request->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ]);
            }

            $resource->delete();

            return response()->json([
                'success' => true,
                'message' => 'Deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getUserResources($user_id)
    {
        try {
            $resources = Resource::where('user_id', $user_id)->get();

            return response()->json([
                'success' => true,
                'resources' => $resources
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function download($id)
    {
        try {
            $resource = Resource::find($id);

            if (!$resource) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ]);
            }

            $filePath = storage_path('app/public/' . $resource->file_path);

            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File missing'
                ]);
            }

            return response()->download($filePath);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}