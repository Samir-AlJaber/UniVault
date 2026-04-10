<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'points' => 0
            ]);

            return response()->json([
                'success' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
        }

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function googleLogin(Request $request)
    {
        try {
            $token = $request->token;

        
            $response = Http::withoutVerifying()->get(
                'https://oauth2.googleapis.com/tokeninfo?id_token=' . $token
            );

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Google token'
                ]);
            }

            $googleUser = $response->json();

            $email = $googleUser['email'];
            $name = $googleUser['name'];

        
            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => null,
                    'points' => 0
                ]);
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}