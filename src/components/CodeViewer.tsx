import React from 'react';

export const codeSnippets = {
  sanctumRoutes: {
    title: 'Laravel Sanctum Routes (routes/api.php)',
    code: `<?php

use App\\Http\\Controllers\\API\\AuthController;
use App\\Http\\Controllers\\API\\ProductController;
use App\\Http\\Controllers\\API\\CategoryController;
use App\\Http\\Controllers\\API\\CartController;
use App\\Http\\Controllers\\API\\WishlistController;
use App\\Http\\Controllers\\API\\OrderController;
use App\\Http\\Controllers\\API\\ReviewController;
use Illuminate\\Support\\Facades\\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/search/{query}', [ProductController::class, 'search']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Authentication Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);

    // Wishlist API
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{productId}', [WishlistController::class, 'toggle']);

    // Cart API
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Checkout API
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'history']);
    Route::get('/orders/{id}', [OrderController::class, 'details']);

    // Review API
    Route::post('/products/{id}/reviews', [ReviewController::class, 'store']);
});`
  },
  laravelAuthController: {
    title: 'Laravel Auth Controller (AuthController.php)',
    code: `<?php

namespace App\\Http\\Controllers\\API;

use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request) 
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer'
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The credentials provided are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id
        ]);

        $user->update($request->only('name', 'email'));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}`
  },
  vueAxiosSetup: {
    title: 'Vue Axios Setup & Token Storage (src/services/api.js)',
    code: `import axios from 'axios';

// Create AXIOS instance configuration
const api = axios.create({
  baseURL: 'https://luxe-fashion.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Axios Request Interceptor: Inject Sanctum Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxe_sanctum_token');
    if (token) {
      config.headers['Authorization'] = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor: Handle Unauthorized/Expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if session expires
      localStorage.removeItem('luxe_sanctum_token');
      localStorage.removeItem('luxe_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;`
  },
  vueStorefrontView: {
    title: 'Vue.js Component Core (Storefront Catalog.vue)',
    code: `<template>
  <div class="product-grid-catalog">
    <div class="row">
      <!-- Sidebar Column -->
      <aside class="col-md-3">
        <h3 class="filter-header">Category</h3>
        <ul class="category-list">
          <li v-for="cat in categories" :key="cat.id" 
              :class="{ active: activeCategory === cat.name }"
              @click="setCategory(cat.name)">
            <span>{{ cat.name }}</span>
            <span class="badge">{{ cat.product_count }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Products Column -->
      <main class="col-md-9">
        <div class="products-grid">
          <div v-for="product in products" :key="product.id" class="product-card">
            <img :src="product.image" :alt="product.title" />
            <div class="card-details">
              <h4>{{ product.title }}</h4>
              <p class="price">\${{ product.price }}</p>
              <button @click="addToCart(product)">Add To Cart</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'StorefrontCatalog',
  data() {
    return {
      products: [],
      categories: [],
      activeCategory: 'All',
      priceFilter: []
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await api.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error("Error loading categories", err);
      }
    },
    async fetchProducts() {
      try {
        let url = '/products';
        if (this.activeCategory !== 'All') {
          url += \`?category=\${this.activeCategory}\`;
        }
        const res = await api.get(url);
        this.products = res.data;
      } catch (err) {
        console.error("Error loading products", err);
      }
    },
    setCategory(catName) {
      this.activeCategory = catName;
      this.fetchProducts();
    }
  }
}
</script>`
  },
  laravelProductController: {
    title: 'Laravel Product Controller & Upload (ProductController.php)',
    code: `<?php

namespace App\\Http\\Controllers\\API;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Product;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->where('status', 'active')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'stock' => 'required|integer',
            'image_file' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $imagePath = 'default.jpg';
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $imagePath = Storage::url($path);
        }

        $product = Product::create([
            'title' => $request->title,
            'sku' => 'LX-' . time(),
            'price' => $request->price,
            'category' => $request->category,
            'stock' => $request->stock,
            'image' => $imagePath,
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Product curated successfully!',
            'product' => $product
        ], 201);
    }
}`
  }
};

interface CodeViewerProps {
  snippetKey: keyof typeof codeSnippets;
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeViewer({ snippetKey, isOpen, onClose }: CodeViewerProps) {
  if (!isOpen) return null;
  const data = codeSnippets[snippetKey];

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 text-slate-100 shadow-2xl z-50 border-l border-slate-700 font-mono text-xs flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">
            Laravel + Vue.js Production Codebase
          </span>
          <span className="text-sm font-bold text-slate-200 mt-1">{data.title}</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 cursor-pointer bg-slate-800 hover:bg-red-900 border border-slate-700 hover:border-red-600 hover:text-white rounded text-slate-400 font-sans"
        >
          Close [ESC]
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar whitespace-pre leading-relaxed select-all">
        {data.code}
      </div>
      <div className="p-3 bg-slate-950 border-t border-slate-800 font-sans text-[11px] text-slate-400 flex items-center justify-between">
        <span>Press <b>CTRL+A</b> to copy entire implementation standard</span>
        <span className="text-emerald-400 font-mono">200 OK — Ready</span>
      </div>
    </div>
  );
}
