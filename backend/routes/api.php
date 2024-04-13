<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->get('/user', function(Request $request){
    return $request->user();
});
Route::post('/login', function(Request $request){
    $credentials = $request->only(['email', 'password']);

    if (!$token = auth()->attempt($credentials)) {
        return response()->json(['message' => 'Email ou senha invalido'], 401);
    }
    return response()->json(['data' =>[
        'token' => $token,
        'tokenType' => 'bearer',
        'message' => 'Logado com sucesso',
        'expiresIn' => auth()->factory()->getTTL() * 60,
    ]
    ], 200);
});