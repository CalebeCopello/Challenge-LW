<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product; 


Route::middleware('api')->get('/user', function(Request $request){
    return $request->user();
});
Route::post('/login', function(Request $request){
    $credentials = $request->only(['email', 'password']);

    if (!$token = auth()->attempt($credentials)) {
        return response()->json(['message' => 'Email ou senha inválidos'], 401);
    }
    return response()->json(['data' =>[
        'token' => $token,
        'tokenType' => 'bearer',
        'message' => 'Logado com sucesso',
        'expiresIn' => auth()->factory()->getTTL() * 60,
    ]
    ], 200);
});

Route::middleware('api')->post('/produto', function(Request $request){
    try {
        $request->validate([
            'title' => 'required|unique:products|max:255',
            'price' => 'required|numeric',
            'description' => 'required',
            'category' => 'required',
            'image' => 'required|url',
            'rating_rate' => 'numeric',
            'rating_count' => 'numeric',
        ]);
        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->description = $request->description;
        $product->category = $request->category;
        $product->image = $request->image;
        $product->rating_rate = $request->rating['rate'];
        $product->rating_count = $request->rating['count'];
    
        // Save the product to the database
        $product->save();
    
        // Return a success response
        return response()->json(['message' => 'Produto inserido com sucesso'], 201);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Falha ao inserir o produto', 'error' => $e->getMessage()], 500);
    }
});

Route::middleware('api')->get('/produto', function(Request $request){
    try {
        // $products = Product::orderBy('id')->get();
        // return response()->json($products, 200);
        $products = Product::all()->map(function ($product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'price' => $product->price,
                'description' => $product->description,
                'category' => $product->category,
                'image' => $product->image,
                'rating' => [
                    'rate' => $product->rating_rate,
                    'count' => $product->rating_count,
                ],
                // 'created_at' => $product->created_at,
                // 'updated_at' => $product->updated_at,
            ];
        });

        return response()->json($products, 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Falha ao importar os produtos do banco de dados', 'error' => $e->getMessage()], 500);
    }
});