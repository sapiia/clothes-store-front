import React, { useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, User } from './types';
import { initialProducts, initialCategories, initialOrders, initialUsers } from './data/initialData';
import Storefront from './components/Storefront';
import AdminPanel from './components/AdminPanel';
import ApiPlayground from './components/ApiPlayground';
import CodeViewer, { codeSnippets } from './components/CodeViewer';

export default function App() {
  // Primary Application Modes
  // 1. customer: Luxe Consumer Storefront
  // 2. admin: Blade Administrations Dashboard
  // 3. playground: Postman-style Sandbox Portal
  const [appMode, setAppMode] = useState<'customer' | 'admin' | 'playground'>('customer');

  // Core synchronized State Databases
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxe_cached_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('luxe_cached_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('luxe_cached_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('luxe_cached_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Client shopping states
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxe_cached_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('luxe_cached_wishlist');
    return saved ? JSON.parse(saved) : [1, 3]; // Seeded defaults
  });

  // Authentication persistence mimicking Sanctum tokens
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxe_user_session');
    if (saved) return JSON.parse(saved);
    // Pre-seed with gorgeous logged-in session for Jessica by default so students can see protected pages right away
    return null; 
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('luxe_sanctum_key');
    if (saved) return saved;
    return null;
  });

  // Code Hub inspection drawer state
  const [codeSnippetKey, setCodeSnippetKey] = useState<keyof typeof codeSnippets>('vueAxiosSetup');
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  // Sync to localStorage on any state adjust
  useEffect(() => {
    localStorage.setItem('luxe_cached_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxe_cached_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('luxe_cached_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('luxe_cached_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('luxe_cached_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxe_cached_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('luxe_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('luxe_user_session');
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('luxe_sanctum_key', authToken);
    } else {
      localStorage.removeItem('luxe_sanctum_key');
    }
  }, [authToken]);

  // Load real data from backend API on mount so the storefront reflects the database
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const base = 'http://127.0.0.1:8000/api';
        const [catRes, prodRes] = await Promise.all([
          fetch(`${base}/categories`),
          fetch(`${base}/products?all=true`),
        ]);

        if (cancelled) return;

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData) && catData.length) setCategories(catData);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData) && prodData.length) setProducts(prodData);
        }
      } catch (e) {
        // keep initialData if backend is unreachable
        console.warn('Failed to load backend data:', e);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle keyboard ESC to close code drawer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCodeDrawerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // -------------------------------------------------------------
  // Mutator and state updates
  // -------------------------------------------------------------

  const handleSimulateLogin = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    // Add user record if not extant
    if (!users.some(u => u.email === user.email)) {
      setUsers(prev => [...prev, user]);
    }
  };

  const handleSimulateRegister = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    setUsers(prev => [...prev, user]);
  };

  const handleSimulateLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
  };

  const handleUpdateUserProfile = (name: string, email: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, email };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const handleAddToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { id: Date.now(), product, quantity: 1, size, color }];
      }
    });
  };

  const handleUpdateCartQty = (itemId: number, qty: number) => {
    setCart(prev => prev.map(it => it.id === itemId ? { ...it, quantity: qty } : it));
  };

  const handleRemoveCartItem = (itemId: number) => {
    setCart(prev => prev.filter(it => it.id !== itemId));
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlistIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const handleCheckoutCommit = async (name: string, email: string) => {
    let orderNumber = `LX-901${orders.length + 20}`;
    let totalP = cart.reduce((tot, item) => tot + (item.product.price * item.quantity), 0) + (cart.reduce((tot, item) => tot + (item.product.price * item.quantity), 0) > 50 ? 0 : 15);

    if (currentUser && authToken) {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: authToken,
          },
          body: JSON.stringify({
            customer_name: name,
            customer_email: email,
            cart: cart.map(it => ({
              product_id: it.product.id,
              quantity: it.quantity,
              size: it.size,
              color: it.color,
            })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          orderNumber = data.order_number || orderNumber;
          totalP = (data.total ?? totalP) as number;
        }
      } catch (err) {
        console.error('Checkout failed', err);
      }
    }

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newOrder: Order = {
      id: Date.now(),
      order_number: orderNumber,
      customer_name: name,
      customer_email: email,
      date: dateStr,
      status: 'Pending',
      total: totalP,
      items: cart.map(it => ({
        id: Date.now() + Math.random(),
        product_id: it.product.id,
        product_title: it.product.title,
        price: it.product.price,
        quantity: it.quantity,
        size: it.size,
        color: it.color,
      })),
    };

    setOrders(prev => [...prev, newOrder]);

    // Decrement stock for purchase
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    setCart([]); // Reset Cart
  };

  const handleAddProductReview = (productId: number, reviewer: string, rating: number, comment: string) => {
    const newRev = {
      id: Date.now(),
      product_id: productId,
      user_name: reviewer,
      rating,
      comment,
      created_at: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [newRev, ...p.reviews] } : p));
  };

  // Admin CRUD Mutate
  const handleAdminAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    // Increment category counts
    setCategories(prev => prev.map(c => c.name === newProduct.category ? { ...c, product_count: c.product_count + 1 } : c));
  };

  const handleAdminUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAdminDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAdminAddCategory = (name: string, slug: string) => {
    const newCat = { id: categories.length + 1, name, slug, product_count: 0 };
    setCategories(prev => [...prev, newCat]);
  };

  const handleAdminDeleteCategory = (catId: number) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  const handleAdminUpdateOrderStatus = (orderId: number, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const openSnippetWithDrawer = (key: keyof typeof codeSnippets) => {
    setCodeSnippetKey(key);
    setIsCodeDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F8] text-primary flex flex-col font-sans">
      
      {/* Main Mode Viewport Container with responsive layout spacing */}
      <div className="flex-1 w-full py-6">
        {appMode === 'customer' && (
          <Storefront
            products={products}
            categories={categories}
            orders={orders}
            currentUser={currentUser}
            authToken={authToken}
            cart={cart}
            wishlistIds={wishlistIds}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onToggleWishlist={handleToggleWishlist}
            onCheckout={handleCheckoutCommit}
            onSimulateLogin={handleSimulateLogin}
            onSimulateRegister={handleSimulateRegister}
            onSimulateLogout={handleSimulateLogout}
            onUpdateUserProfile={handleUpdateUserProfile}
            onAddProductReview={handleAddProductReview}
            activeSnippetSetter={openSnippetWithDrawer}
          />
        )}

        {appMode === 'admin' && (
          <AdminPanel
            products={products}
            categories={categories}
            orders={orders}
            users={users}
            onAddProduct={handleAdminAddProduct}
            onUpdateProduct={handleAdminUpdateProduct}
            onDeleteProduct={handleAdminDeleteProduct}
            onAddCategory={handleAdminAddCategory}
            onDeleteCategory={handleAdminDeleteCategory}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
            activeSnippetSetter={openSnippetWithDrawer}
          />
        )}

        {appMode === 'playground' && (
          <ApiPlayground
            products={products}
            categories={categories}
            orders={orders}
            currentUser={currentUser}
            authToken={authToken}
            onSimulateLogin={handleSimulateLogin}
            onSimulateRegister={handleSimulateRegister}
          />
        )}
      </div>

      {/* Split-Screen Code Hub Component */}
      <CodeViewer
        snippetKey={codeSnippetKey}
        isOpen={isCodeDrawerOpen}
        onClose={() => setIsCodeDrawerOpen(false)}
      />

      {/* Elegant minimalist footer with subtle system mode connections */}
      <footer className="bg-white border-t border-outline-variant py-8 px-8 mt-12 text-center text-xs text-on-surface-variant font-medium space-y-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Luxe Fashion E-Commerce. Crafted with elite luxury design guidelines.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[#775a19] text-[11px] font-bold uppercase tracking-wider">
            <button 
              onClick={() => setAppMode('customer')} 
              className={`hover:underline cursor-pointer transition-all ${appMode === 'customer' ? 'text-primary font-black scale-102 border-b border-secondary pb-0.5' : 'opacity-60 hover:opacity-100 font-bold'}`}
            >
              Vue.js Storefront
            </button>
            <span className="opacity-40 select-none">•</span>
            <button 
              onClick={() => setAppMode('admin')} 
              className={`hover:underline cursor-pointer transition-all ${appMode === 'admin' ? 'text-primary font-black scale-102 border-b border-secondary pb-0.5' : 'opacity-60 hover:opacity-100 font-bold'}`}
            >
              Laravel Blade Admin
            </button>
            <span className="opacity-40 select-none">•</span>
            <button 
              onClick={() => setAppMode('playground')} 
              className={`hover:underline cursor-pointer transition-all ${appMode === 'playground' ? 'text-primary font-black scale-102 border-b border-secondary pb-0.5' : 'opacity-60 hover:opacity-100 font-bold'}`}
            >
              REST API Playground
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
