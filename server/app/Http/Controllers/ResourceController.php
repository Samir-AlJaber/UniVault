<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resource;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function getCourses($semester)
    {
        $courses = Resource::where('semester', $semester)
            ->select('course')
            ->distinct()
            ->pluck('course');

        return response()->json([
            "success" => true,
            "courses" => $courses
        ]);
    }

    public function getResources($course)
    {
        $resources = Resource::where('course', $course)->get();

        foreach ($resources as $res) {
            if ($res->rating_count > 0) {
                $res->avg_rating = round($res->rating_sum / $res->rating_count, 1);
            } else {
                $res->avg_rating = null;
            }
        }

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
                'user_id' => $request->user_id,
                'rating_sum' => 0,
                'rating_count' => 0
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

    public function rate(Request $request, $id)
    {
        try {
            $request->validate([
                'rating' => 'required|integer|min:1|max:10',
                'user_id' => 'required'
            ]);

            $resource = Resource::find($id);

            if (!$resource) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found'
                ]);
            }

            if ($resource->user_id == $request->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot rate your own resource'
                ]);
            }

            $resource->rating_sum += $request->rating;
            $resource->rating_count += 1;
            $resource->save();

            return response()->json([
                'success' => true,
                'message' => 'Rating submitted'
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

            Storage::delete('public/' . $resource->file_path);

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
        $resources = Resource::where('user_id', $user_id)->get();

        return response()->json([
            'success' => true,
            'resources' => $resources
        ]);
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

            $path = storage_path('app/public/' . $resource->file_path);

            if (!file_exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File missing'
                ]);
            }

            return response()->download($path);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}