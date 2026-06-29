import React, { useState, useMemo } from 'react';
import { Product, Category, CartItem, Order, User, Review } from '../types';
import { initialProducts, initialCategories } from '../data/initialData';

interface StorefrontProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  currentUser: User | null;
  authToken: string | null;
  cart: CartItem[];
  wishlistIds: number[];
  onAddToCart: (product: Product, size: string, color: string) => void;
  onUpdateCartQty: (itemId: number, qty: number) => void;
  onRemoveCartItem: (itemId: number) => void;
  onToggleWishlist: (productId: number) => void;
  onCheckout: (customerName: string, customerEmail: string) => void;
  onSimulateLogin: (user: User, token: string) => void;
  onSimulateRegister: (user: User, token: string) => void;
  onSimulateLogout: () => void;
  onUpdateUserProfile: (name: string, email: string) => void;
  onAddProductReview: (productId: number, reviewerName: string, rating: number, comment: string) => void;
  activeSnippetSetter: (key: any) => void;
}

export default function Storefront({
  products,
  categories,
  orders,
  currentUser,
  authToken,
  cart,
  wishlistIds,
  onAddToCart,
  onUpdateCartQty,
  onRemoveCartItem,
  onToggleWishlist,
  onCheckout,
  onSimulateLogin,
  onSimulateRegister,
  onSimulateLogout,
  onUpdateUserProfile,
  onAddProductReview,
  activeSnippetSetter
}: StorefrontProps) {
  // Navigation & View Toggles
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'auth' | 'wishlist' | 'cart' | 'checkout' | 'orders' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search & Filter state for Catalog
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Featured');
  const [catalogPageNum, setCatalogPageNum] = useState(1);

  // Detail Modal configuration state
  const [detailSize, setDetailSize] = useState('S');
  const [detailColor, setDetailColor] = useState('Off-White');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Authentication Fields (Simulated Laravel Client)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Checkout Fields
  const [checkoutName, setCheckoutName] = useState(currentUser?.name || '');
  const [checkoutEmail, setCheckoutEmail] = useState(currentUser?.email || '');
  const [checkoutCard, setCheckoutCard] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');

  // Profile fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePwd, setProfilePwd] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // After-auth redirect for order intent while not logged in
  const [postAuthRedirect, setPostAuthRedirect] = useState<'checkout' | 'instantOrder' | null>(null);
  const [pendingInstantProduct, setPendingInstantProduct] = useState<Product | null>(null);

  // Extra Navigation & Editorial States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<{ title: string; category: string; date: string; author: string; image: string; content: string } | null>(null);

  const handleFeaturedStoriesClick = () => {
    setCurrentPage('home');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById('featured-stories');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const journalStories = [
    {
      title: "The Art of Italian Tailoring",
      category: "Craftsmanship",
      date: "June 20, 2026",
      author: "Yen Yon",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwoK9Do8bZj3GDDIuYEpWcjntOV6xjNdEMlviuTOHCAclib-hCqw156Ovq2qMdCgb2U6bsUlhChkb_SbQOHxYcNecHVbejtiD5FmBUyidL40T5bSGkK8HBNkE6qTsTJoYx4Qzs3DGoUsWTDtWqP0Nkr2ieMvNt2jj9P-F6gFycJfCTKJl9uq4lUTHNmD7j4cfr-P7MjPnqDc2LKmk094oyC0otR5PEHnKVbRCpxb-U7C_P44fvfYeoZpwOwyg2l3eYGYHADLELosFg",
      content: "Our Italian tailoring atelier represents the apex of garment creation. Every single double-breasted blazer is hand-measured in Naples, utilizing local Italian techniques developed over generations. We utilize certified extra-fine merino wool and premium linen-silk blend yarns to guarantee a natural, elegant drape. The horn buttons are laser-etched with the Luxe logo, and each inner pocket contains a hand-stitched serial number indicating its limited run. When you wear a Luxe blazer, you wear decades of uncompromised heritage, tailored precisely to feel like a second skin."
    },
    {
      title: "Summer Linen & Golden Hours",
      category: "Editorial",
      date: "June 14, 2026",
      author: "Jessica M.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_qmX2oVIb63Pc2ue4emFoJwAi1o-UADNI2UwNtpbOEhgvHHI2YP6g-WCZiNj1juT4YMOP9rgSqFnMQd9E_032VOEuiTKTubHhDRQGjEfv5gwVl_al7a7aUgeYr_FoZZq9xKg6mf-xG7_s811csS0ujNJyVt6nrtlgoI_2W809oTVYHUlqDC8Q-v3isNmbZKOwAuc7iKrXqa9r3W07TCMS_YS5YiO8fST5FXl2De5jl1vDpLhVchCX6S1pwau1ZTP9ji6pOl5f-bjm",
      content: "As the temperature climbs, style should remain effortless. Our Summer Linen Capsule is engineered specifically for hot, tropical afternoons and warm evening retreats. We harvest raw flax fibers from the pristine fields of Northern France, weave them into airy structures, and pre-wash each piece using non-chemical softeners to achieve an immediate, luxurious broken-in feel. Combining loose-fit camp collar shirts with tapered pleat trousers allows for natural airflow while retaining an immaculate, structured aesthetic. Pair with our handmade leather slide sandals to capture the ultimate resort mood."
    },
    {
      title: "The 10-Piece Luxe Capsule",
      category: "Wardrobe Strategy",
      date: "May 29, 2026",
      author: "Sarah Chen",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6j317a_-NL0e64-hh7SLnIHB0rVDzuqBdHBL33G4db-bMKXM7K2MjFqz603NQzaH0hXIZJNLEzjQA_VMWXr0ZWT3SuBnv5A5KpI-0_lORskFWlmxaQ3EcOSBxx6I8bN5CGUMIleR67g7fFhMoKWYhtBZ5bHIAvOHRtggw9AQA6xolTJiB7IUxY1eAawQ9GcEETVa2hM9MnlWjS3hhYuR_OgXZO7t3Gojka5K0LelaLJL6e3ErXUqvzOncPPL8_OG5_qx5G-nnp6g-",
      content: "True sustainability is found in timeless durability. Our wardrobe strategists have curated the definitive 10-piece luxury capsule designed to yield more than thirty distinct outfits. By focusing strictly on premium foundational items—a neutral trench coat, a tailored black blazer, an off-white silk blouse, a pristine cotton tee, and relaxed pleated trousers—you establish a powerful system of infinite compatibility. We recommend keeping the palette unified: soft sands, charcoal, deep obsidian, and warm cream. Investing in fewer, high-quality garments reduces decision fatigue and elevated your aesthetic footprint."
    }
  ];

  // Instant Direct Checkout/Payment Modal State
  const [instantOrderProduct, setInstantOrderProduct] = useState<Product | null>(null);
  const [instantSize, setInstantSize] = useState('S');
  const [instantColor, setInstantColor] = useState('Off-White');
  const [instantQty, setInstantQty] = useState(1);
  const [instantName, setInstantName] = useState('');
  const [instantEmail, setInstantEmail] = useState('');
  const [instantPassword, setInstantPassword] = useState('');
  const [instantAddress, setInstantAddress] = useState('');
  const [instantCard, setInstantCard] = useState('');
  const [showInstantSuccess, setShowInstantSuccess] = useState(false);
  const [orderedProductForSuccess, setOrderedProductForSuccess] = useState<Product | null>(null);
  const [instantRegStep, setInstantRegStep] = useState<'info' | 'payment'>('payment');
  const [instantRegError, setInstantRegError] = useState('');

  const handleOpenInstantOrder = (product: Product) => {
    if (!currentUser) {
      setPendingInstantProduct(product);
      setPostAuthRedirect('instantOrder');
      setAuthMode('register');
      setCurrentPage('auth');
      return;
    }
    setInstantOrderProduct(product);
    setInstantSize(product.sizes[0] || 'S');
    setInstantColor(product.colors[0] || 'Off-White');
    setInstantQty(1);
    setInstantName(currentUser?.name || '');
    setInstantEmail(currentUser?.email || '');
    setInstantPassword('');
    setInstantAddress(currentUser ? 'Phnom Penh, Cambodia' : '');
    setInstantCard('4200 1234 5678 9012'); // Mock visa for luxury instant pay
    setShowInstantSuccess(false);
    setInstantRegStep(currentUser ? 'payment' : 'info');
    setInstantRegError('');
  };

  const handleInstantRegisterAndContinue = async () => {
    setInstantRegError('');
    if (!instantName || !instantEmail || !instantPassword || !instantAddress) {
      setInstantRegError('All registration fields are required to continue.');
      return;
    }
    if (!instantEmail.includes('@')) {
      setInstantRegError('Please provide a valid email address.');
      return;
    }
    if (instantPassword.length < 4) {
      setInstantRegError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: instantName,
          email: instantEmail,
          password: instantPassword,
          password_confirmation: instantPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Object.values(data?.errors || data?.messages || {}).flat().shift() || data?.message || 'Registration failed';
        throw new Error(msg);
      }

      addAxiosLog('POST', '/register', res.status, 'auth');

      const u: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        created_at: data.user.created_at,
      };

      onSimulateRegister(u, `${data.token_type} ${data.access_token}`);
      setInstantRegStep('payment');
      setInstantAddress('');
    } catch (err: any) {
      setInstantRegError(err.message || 'Registration failed');
    }
  };

  const handleInstantOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      handleInstantRegisterAndContinue();
      return;
    }
    if (!instantOrderProduct || !instantName || !instantEmail || !instantAddress) return;

    // Log connection stream
    addAxiosLog('POST', `/instant-checkout/${instantOrderProduct.id}`, 201, 'checkout');

    // Add exactly this item to cart first so standard onCheckout triggers on this item
    onAddToCart(instantOrderProduct, instantSize, instantColor);

    // Commit dynamic checkout
    onCheckout(instantName, instantEmail);

    setOrderedProductForSuccess(instantOrderProduct);
    setShowInstantSuccess(true);
    setInstantOrderProduct(null); // Hide active order form
  };

  // Live Axios Log Tracer State
  const [axiosLogs, setAxiosLogs] = useState<Array<{ id: number; method: string; path: string; status: number; type: 'auth' | 'wishlist' | 'cart' | 'checkout' | 'public'; timestamp: string }>>([
    { id: 1, method: 'GET', path: '/categories', status: 200, type: 'public', timestamp: 'Initial Seed Loaded' },
    { id: 2, method: 'GET', path: '/products', status: 200, type: 'public', timestamp: 'Catalog Pulled Successful' }
  ]);

  const addAxiosLog = (method: string, path: string, status: number, type: 'auth' | 'wishlist' | 'cart' | 'checkout' | 'public') => {
    const time = new Date().toLocaleTimeString();
    setAxiosLogs(prev => [
      { id: Date.now(), method, path, status, type, timestamp: time },
      ...prev.slice(0, 7)
    ]);
  };

  // Auth Functions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      if (authMode === 'login') {
        const res = await fetch('http://127.0.0.1:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: authEmail, password: authPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Login failed');
        }

        addAxiosLog('POST', '/login', res.status, 'auth');
        const u: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          created_at: data.user.created_at,
        };
        onSimulateLogin(u, `${data.token_type} ${data.access_token}`);

        const redirectTo = postAuthRedirect || 'home';
        setCurrentPage(redirectTo);
        setPostAuthRedirect(null);

        if (redirectTo === 'checkout') {
          setCheckoutName(u.name);
          setCheckoutEmail(u.email);
        }

        if (redirectTo === 'instantOrder' && pendingInstantProduct) {
          setInstantOrderProduct(pendingInstantProduct);
          setInstantSize(pendingInstantProduct.sizes[0] || 'S');
          setInstantColor(pendingInstantProduct.colors[0] || 'Off-White');
          setInstantQty(1);
          setInstantName(u.name);
          setInstantEmail(u.email);
          setInstantPassword('');
          setInstantAddress('');
          setInstantCard('4200 1234 5678 9012');
          setShowInstantSuccess(false);
          setInstantRegStep('payment');
          setInstantRegError('');
          setPendingInstantProduct(null);
        }

        return;
      }

      // Registration
      if (!authName || !authEmail || !authPassword) {
        setAuthError('All registration fields are required.');
        addAxiosLog('POST', '/register', 422, 'auth');
        return;
      }

      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
          password_confirmation: authPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Object.values(data?.errors || data?.messages || {}).flat().shift() || data?.message || 'Registration failed';
        throw new Error(msg);
      }

      addAxiosLog('POST', '/register', res.status, 'auth');
      const u: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        created_at: data.user.created_at,
      };
      onSimulateRegister(u, `${data.token_type} ${data.access_token}`);

      const redirectTo = postAuthRedirect || 'home';
      setCurrentPage(redirectTo);
      setPostAuthRedirect(null);

      if (redirectTo === 'checkout') {
        setCheckoutName(u.name);
        setCheckoutEmail(u.email);
      }

      if (redirectTo === 'instantOrder' && pendingInstantProduct) {
        setInstantOrderProduct(pendingInstantProduct);
        setInstantSize(pendingInstantProduct.sizes[0] || 'S');
        setInstantColor(pendingInstantProduct.colors[0] || 'Off-White');
        setInstantQty(1);
        setInstantName(u.name);
        setInstantEmail(u.email);
        setInstantPassword('');
        setInstantAddress('');
        setInstantCard('4200 1234 5678 9012');
        setShowInstantSuccess(false);
        setInstantRegStep('payment');
        setInstantRegError('');
        setPendingInstantProduct(null);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
    }
  };

  const handleLogoutClick = () => {
    addAxiosLog('POST', '/logout', 200, 'auth');
    onSimulateLogout();
    setCurrentPage('home');
  };

  // Toggle checkout transition
  const handleCheckoutClick = () => {
    if (!currentUser) {
      setPostAuthRedirect('checkout');
      setAuthMode('login');
      setCurrentPage('auth');
      return;
    }
    setCheckoutName(currentUser.name);
    setCheckoutEmail(currentUser.email);
    setCurrentPage('checkout');
  };

  // Perform checkout
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail || !checkoutAddress) return;
    addAxiosLog('POST', '/checkout', 201, 'checkout');
    onCheckout(checkoutName, checkoutEmail);
    setCurrentPage('orders');
  };

  // Profile Updating
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAxiosLog('PUT', '/profile/update', 200, 'auth');
    onUpdateUserProfile(profileName, profileEmail);
    setProfileSuccessMsg('Profile updated successfully under Laravel Sanctum standards!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  // Toggle wishlist standard
  const handleWishlistToggle = (prodId: number) => {
    if (!currentUser) {
      addAxiosLog('POST', `/wishlist/${prodId}`, 401, 'wishlist');
      setAuthMode('login');
      setCurrentPage('auth');
      return;
    }
    addAxiosLog('POST', `/wishlist/${prodId}`, 200, 'wishlist');
    onToggleWishlist(prodId);
  };

  // Add Review standard
  const handleReviewSubmit = (e: React.FormEvent, productId: number) => {
    e.preventDefault();
    if (!currentUser) {
      addAxiosLog('POST', `/products/${productId}/reviews`, 401, 'public');
      setAuthMode('login');
      setCurrentPage('auth');
      return;
    }
    if (!newReviewComment.trim()) return;
    addAxiosLog('POST', `/products/${productId}/reviews`, 201, 'public');
    onAddProductReview(productId, currentUser.name, newReviewRating, newReviewComment);
    setNewReviewComment('');
    // Refresh modal product references to show updated reviews
    const updatedProd = products.find(p => p.id === productId);
    if (updatedProd) setSelectedProduct({ ...updatedProd });
  };

  // Dynamic products filtering for listing page
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Search Query Filter
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // 3. Size Filter
      if (selectedSize !== 'All' && !p.sizes.includes(selectedSize)) {
        return false;
      }

      // 4. Color Filter
      if (selectedColor !== 'All' && !p.colors.includes(selectedColor)) {
        return false;
      }

      // 5. Price Filter
      if (priceRanges.length > 0) {
        let inRange = false;
        if (priceRanges.includes('0-250') && p.price <= 250) inRange = true;
        if (priceRanges.includes('250-500') && p.price > 250 && p.price <= 500) inRange = true;
        if (priceRanges.includes('500+') && p.price > 500) inRange = true;
        if (!inRange) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Newest') return b.id - a.id;
      return 0; // Default Featured
    });
  }, [products, searchValue, selectedCategory, priceRanges, selectedSize, selectedColor, sortBy]);

  // Wishlist products
  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Cart totals
  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const handlePriceCheckbox = (val: string) => {
    setPriceRanges(prev => {
      if (prev.includes(val)) {
        return prev.filter(x => x !== val);
      } else {
        return [...prev, val];
      }
    });
  };

  const setCategoryAndLog = (cat: string) => {
    setSelectedCategory(cat);
    addAxiosLog('GET', `/products?category=${cat}`, 200, 'public');
  };

  return (
    <div className="space-y-6">
      {/* Top bar promo */}
      <div className="w-full bg-primary text-on-primary py-2 px-6 flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase">
        <span>Free Shipping on orders over $50</span>
        <div className="hidden sm:flex gap-6">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">cached</span> 30-Day Returns</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">verified_user</span> Secure Payment</span>
        </div>
      </div>

      {/* Primary Customer Head Navigation */}
      <header className="bg-white border-b border-outline-variant py-4 px-6 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Hamburguer Toggle */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="block md:hidden text-primary p-1 hover:text-secondary cursor-pointer"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <h1 
            onClick={() => {
              setCurrentPage('home');
              setIsMobileMenuOpen(false);
            }}
            className="font-headline-lg font-bold text-2xl tracking-tighter cursor-pointer text-primary"
          >
            Luxe<span className="text-secondary font-bold">.</span>
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            <button 
              type="button"
              onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }} 
              className={`hover:text-primary transition-all py-1 cursor-pointer ${currentPage === 'catalog' && selectedCategory === 'All' ? 'text-primary border-b-2 border-secondary' : ''}`}
            >
              New Arrivals
            </button>
            
            {/* Desktop Collections Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCollectionsDropdownOpen(true)}
              onMouseLeave={() => setIsCollectionsDropdownOpen(false)}
            >
              <button 
                type="button"
                onClick={() => {
                  setCurrentPage('catalog');
                  setCategoryAndLog('All');
                }}
                className={`hover:text-primary flex items-center gap-0.5 cursor-pointer py-1 transition-all ${currentPage === 'catalog' && selectedCategory !== 'All' ? 'text-primary border-b-2 border-secondary' : ''}`}
              >
                Collections
                <span className="material-symbols-outlined text-[16px] leading-none">expand_more</span>
              </button>
              {isCollectionsDropdownOpen && (
                <div className="absolute left-0 mt-1 bg-white border border-outline-variant rounded-sm shadow-xl py-2 w-48 z-50 animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage('catalog');
                      setCategoryAndLog('All');
                      setIsCollectionsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-[#fbf9f8] hover:text-secondary border-b border-outline-variant/30"
                  >
                    All Collections
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCurrentPage('catalog');
                        setCategoryAndLog(cat.name);
                        setIsCollectionsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-[#fbf9f8] hover:text-primary ${selectedCategory === cat.name ? 'text-secondary font-black' : ''}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="button"
              onClick={handleFeaturedStoriesClick} 
              className="hover:text-primary transition-all py-1 cursor-pointer"
            >
              Featured Stories
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* User action icons */}
          <button 
            type="button"
            onClick={() => {
              if (currentUser) {
                setCurrentPage('profile');
                setProfileName(currentUser.name);
                setProfileEmail(currentUser.email);
              } else {
                setAuthMode('login');
                setCurrentPage('auth');
              }
            }} 
            className="flex items-center gap-1 p-1 hover:text-secondary text-primary cursor-pointer font-semibold uppercase tracking-wider text-xs transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="hidden sm:inline text-[11px] font-bold">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setCurrentPage('wishlist')} 
            className="relative p-1 hover:text-secondary text-primary cursor-pointer flex transition-colors"
          >
            <span className="material-symbols-outlined">favorite</span>
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button 
            type="button"
            onClick={() => setCurrentPage('cart')} 
            className="relative p-1 hover:text-secondary text-primary cursor-pointer flex transition-colors"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>

          {currentUser && (
            <button 
              type="button"
              onClick={() => setCurrentPage('orders')} 
              className="hidden sm:block text-xs text-on-surface-variant font-bold hover:text-primary border border-outline-variant px-2.5 py-1 rounded-sm transition-all"
            >
              My Orders
            </button>
          )}

          {currentUser && (
            <button 
              type="button"
              onClick={handleLogoutClick} 
              className="material-symbols-outlined text-[18px] text-rose-700 hover:scale-105 cursor-pointer transition-transform" 
              title="Logout Sanctum Bearer"
            >
              logout
            </button>
          )}
        </div>
      </header>

      {/* Main Page Routing */}
      <main className="px-6 max-w-7xl mx-auto min-h-[500px]">

        {/* 1. HOME SCREEN */}
        {currentPage === 'home' && (
          <div className="space-y-12 pb-12 animate-in fade-in duration-300">
            {/* Camel coat hero box */}
            <div className="relative h-[480px] bg-slate-100 rounded overflow-hidden grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 flex flex-col justify-center p-8 lg:p-14 z-10 bg-gradient-to-r from-[#efeded] to-transparent">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">spark</span> New Curated Selection
                </span>
                <h2 className="font-display-lg text-4xl font-bold tracking-tight text-primary leading-none mb-4">
                  Discover Your Style. <span className="italic font-normal text-secondary">Live Luxe.</span>
                </h2>
                <p className="text-on-surface-variant font-body-lg text-sm mb-6 max-w-sm">
                  Premium quality fashion designed for modern lifestyles. Timeless, beautiful masterpieces crafted with meticulous detail.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }}
                    className="bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-6 py-3 cursor-pointer hover:bg-slate-900 transition-transform active:scale-95"
                  >
                    Shop Collection
                  </button>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEcht81e2__VygLS2nMXxk4A5SwyqKvu97rgPqLH5fVOvKbPIpp5CLJYYAF3uWIsToKRsihmVli04P_eT9xEOcjwHKSuXLzdmbJ1Iz9_1gbp7piAcdaghiLf07AY1NDRorAG6PCgWpnVLg-nOrHtjjefPe0xuYSoTmFyh1Vpu3HUXnmbkQOliQ6h90hJBO1QEYpa44tELM2mz-2adqtSXlFX5thpw1OmAODhoabDGDT5A3E7BeFxJDPQ59TqS1TinsJlEbQBU10J9i")' }} />
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxV2nXgfS9QhsSy3Pk3EmIPdzHbmAkGHG8-_9nRkPKJgftoww-J9wEu3eypIlX5C0qItlCU_Dv8Kq2hS3XcB7wKa3RpcxbSR_rMNoOrdEWtglnI7bGKeIaX43JtT9KOIqQSLSLxaUhbH0_ZlNN5_2iAFaXGBCvbIV4Gw9pgZU99xHXzGH3Ygtm3ENYOhlMDnsFHwm7srdRZ2dFO5CyhjRz7Lw5wiswUiOKxck9eKQhls8V0M6a59k3_Bg2FtYedtC26c7IxHVJZIm3")' }} />
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">Trusted by 100K+ design enthusiasts</span>
                </div>
              </div>
              <div className="md:col-span-7 h-full relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwoK9Do8bZj3GDDIuYEpWcjntOV6xjNdEMlviuTOHCAclib-hCqw156Ovq2qMdCgb2U6bsUlhChkb_SbQOHxYcNecHVbejtiD5FmBUyidL40T5bSGkK8HBNkE6qTsTJoYx4Qzs3DGoUsWTDtWqP0Nkr2ieMvNt2jj9P-F6gFycJfCTKJl9uq4lUTHNmD7j4cfr-P7MjPnqDc2LKmk094oyC0otR5PEHnKVbRCpxb-U7C_P44fvfYeoZpwOwyg2l3eYGYHADLELosFg" 
                  alt="Luxe coat hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-full h-20 w-20 flex flex-col justify-center items-center border border-yellow-200">
                  <span className="text-[8px] uppercase tracking-wider text-secondary font-bold">Up to</span>
                  <span className="text-xl font-black font-headline-lg">50%</span>
                  <span className="text-[8px] uppercase tracking-wider text-secondary font-bold">OFF</span>
                </div>
              </div>
            </div>

            {/* Category Circular Browser */}
            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg uppercase tracking-widest text-center">Browse Curated Categories</h3>
              <div className="flex justify-center flex-wrap gap-6 items-center">
                <div onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="h-16 w-16 rounded-full border border-outline-variant overflow-hidden group-hover:border-secondary p-1 transition-all">
                    <img className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_qmX2oVIb63Pc2ue4emFoJwAi1o-UADNI2UwNtpbOEhgvHHI2YP6g-WCZiNj1juT4YMOP9rgSqFnMQd9E_032VOEuiTKTubHhDRQGjEfv5gwVl_al7a7aUgeYr_FoZZq9xKg6mf-xG7_s811csS0ujNJyVt6nrtlgoI_2W809oTVYHUlqDC8Q-v3isNmbZKOwAuc7iKrXqa9r3W07TCMS_YS5YiO8fST5FXl2De5jl1vDpLhVchCX6S1pwau1ZTP9ji6pOl5f-bjm" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant group-hover:text-primary">Women</span>
                </div>

                <div onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('Outerwear'); }} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="h-16 w-16 rounded-full border border-outline-variant overflow-hidden group-hover:border-secondary p-1 transition-all">
                    <img className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIbn3usPzvNM60asHJOni_1l4cOw8KxjgZ3Hq4yNh7IWL_uMuWdRMBchKe8WI3TeUXcjesTI1Vz-yMqAps6iVZIoYMYH1CusMILc4f8dLCGh6fMjrmUBsZ17nTZqPtTt0FIb5lV6VcXNxL_k_AwBaPadZAWPHlVnjZ9zpP2F24PItOL3Tx1FxaOOjLuWbVVmTCjFDouxHooHxxIrNRDjwKOy5-3wVJeDeG1DyOgB1fDHXOpEfj-yVaZhlvEDAhXgefHsJToeQ5AwMa" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant group-hover:text-primary">Men</span>
                </div>

                <div onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('Dresses'); }} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="h-16 w-16 rounded-full border border-outline-variant overflow-hidden group-hover:border-secondary p-1 transition-all">
                    <img className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6j317a_-NL0e64-hh7SLnIHB0rVDzuqBdHBL33G4db-bMKXM7K2MjFqz603NQzaH0hXIZJNLEzjQA_VMWXr0ZWT3SuBnv5A5KpI-0_lORskFWlmxaQ3EcOSBxx6I8bN5CGUMIleR67g7fFhMoKWYhtBZ5bHIAvOHRtggw9AQA6xolTJiB7IUxY1eAawQ9GcEETVa2hM9MnlWjS3hhYuR_OgXZO7t3Gojka5K0LelaLJL6e3ErXUqvzOncPPL8_OG5_qx5G-nnp6g-" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant group-hover:text-primary">Kids</span>
                </div>

                {['Bags', 'Accessories', 'Footwear', 'Sale'].map((cat, idx) => (
                  <div key={idx} onClick={() => { setCurrentPage('catalog'); setCategoryAndLog(cat === 'Sale' ? 'All' : cat); }} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="h-16 w-16 rounded-full bg-[#efeded] group-hover:bg-[#fed488] transition-all flex items-center justify-center border border-outline-variant">
                      <span className="material-symbols-outlined text-primary text-xl">
                        {cat === 'Bags' ? 'work' : cat === 'Accessories' ? 'diamond' : cat === 'Footwear' ? 'steps' : 'sell'}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant group-hover:text-primary">{cat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#ffdea5] p-8 rounded min-h-[220px] flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <h4 className="font-headline-lg font-bold text-lg mb-1">Summer Series 2026</h4>
                  <p className="text-xs text-on-surface-variant mb-4">Fresh materials for breezy days</p>
                  <button onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }} className="text-xs font-bold uppercase tracking-widest border-b border-primary pb-1 flex items-center gap-1 cursor-pointer">
                    Shop Women <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
                <img className="absolute bottom-0 right-0 w-[50%] h-auto object-contain transform group-hover:scale-105 transition-transform duration-500 pointer-events-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZjj4xuTp7hURS91mmls86O5jFaSugIL1W1QdotJTxNcvSd6uFrU-gDvxf7n_Z5Ja-qrmPUcNGkNOvRUp11JfrrBT-COLCc-fvRzBG1NYiwZQEQC3RT_al0ErrvmWc2D3OGx31zcE5vURehG6M2xhXIwq-9ie9HApQAXsKie6kEKi0A9fj08_5c1jQ4Q3wE-RXI8_QPDs7EMriyqqu0VFj89kkXzb7YSE1aZ8b6gErbMGqeT6DOlTfZX3z4OKGuPHab3kXpS-2kLh0" />
              </div>

              <div className="bg-[#e5e2e1] p-8 rounded min-h-[220px] flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <h4 className="font-headline-lg font-bold text-lg mb-1">Men's Essentials</h4>
                  <p className="text-xs text-on-surface-variant mb-4">Tailored fit styles for daily work</p>
                  <button onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }} className="text-xs font-bold uppercase tracking-widest border-b border-primary pb-1 flex items-center gap-1 cursor-pointer">
                    Shop Men <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
                <img className="absolute bottom-0 right-0 w-[50%] h-auto object-contain transform group-hover:scale-105 transition-transform duration-500 pointer-events-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiD_giyy7P3OwtLu2nB9yKDngsIBbRf0Xlh-k1cgaMmzwAgMSvbfGd80WH3OU0sdSCVElzTman4JA_SsLBzKuJaUjYImUcn3JTOBrqV1LH3vt1jpUczy--dj4zEv6fzgyviz9r2prUOGjsuROH0rgvJMRf0WGvsnLF-K5ZzRz4ohy2zdygUUv-kT6Qoo-6wfsUyDgOA5ewXqlUnxW-SgSlQIpo89hcOGqMlilBNp2W71Nc7NEydD7o_RbbsBT6-oxh8mzpet_yt36I" />
              </div>

              <div className="bg-[#efeded] p-8 rounded min-h-[220px] flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <h4 className="font-headline-lg font-bold text-lg mb-1">Mega Outlet Packs</h4>
                  <p className="text-xs text-on-surface-variant mb-4">Luxury collections up to 50% Off</p>
                  <button onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }} className="bg-primary hover:bg-slate-900 text-on-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-1 cursor-pointer">
                    Claim Discount <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 h-[120px] w-[140px] pointer-events-none flex items-end">
                  <img className="w-full h-auto object-contain transform group-hover:-translate-y-1 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeN8cTquwweAQ4Ay2M-OWCvsPIOCNdmmAIFwd_H00odOcgDEjRpEzjXXYG1Yv8BGtvIvt5kqsiKdROtdFwIRVKiDZOf7HDSMnZ-Id1r65cbCy37B7rf7sWaPa0o-TXTqUcm27VPx-7xqqmZuSqcG-Sn4GXrniLWQlphuLJLeZQohgy2Lw194a_aP7Wk2lUKDNh6zgHoNFEz9wYaB6ek54yOSV12bRvFNgDHHxABDVv7_HPGp2Pm0y_NzVkR3Oj69w2KiypazcaKK3H" />
                </div>
              </div>
            </section>

            {/* Best Sellers Section */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-headline-lg text-2xl">Best Sellers</h3>
                  <div className="h-0.5 w-12 bg-secondary mt-1"></div>
                </div>
                <button 
                  onClick={() => { setCurrentPage('catalog'); setCategoryAndLog('All'); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#775a19] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  View All Products <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.slice(6, 12).map(prod => (
                  <div 
                    key={prod.id} 
                    className="bg-white border border-outline-variant/50 rounded overflow-hidden hover:-translate-y-1 transition-all shadow-sm flex flex-col justify-between h-full group"
                  >
                    <div className="relative aspect-[3/4] bg-[#fbf9f8] overflow-hidden">
                      <img 
                        src={prod.image} 
                        alt={prod.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 cursor-pointer"
                        onClick={() => setSelectedProduct(prod)}
                      />
                      <div className="absolute top-2 left-2 bg-[#ffdea5] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 text-[9px] font-bold text-[#785a1a]">
                        <span className="material-symbols-outlined text-[9px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span>{prod.rating}</span>
                      </div>
                      <button 
                        onClick={() => handleWishlistToggle(prod.id)}
                        className={`absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          wishlistIds.includes(prod.id) ? 'bg-rose-50 text-rose-600' : 'bg-white/85 text-primary hover:bg-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: wishlistIds.includes(prod.id) ? "'FILL' 1" : "" }}>favorite</span>
                      </button>
                      <button 
                        onClick={() => onAddToCart(prod, 'S', 'Off-White')}
                        className="absolute bottom-0 w-full bg-primary text-on-primary py-2 text-[10px] uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-slate-900"
                      >
                        Quick Add
                      </button>
                    </div>
                    <div className="p-3 bg-white flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 onClick={() => setSelectedProduct(prod)} className="font-headline-lg text-sm text-primary font-bold hover:text-secondary cursor-pointer line-clamp-1">
                          {prod.title}
                        </h4>
                        <p className="text-secondary font-bold text-xs mt-1">${prod.price.toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenInstantOrder(prod)}
                        className="w-full bg-secondary hover:bg-[#8e6b1e] text-white py-1.5 text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer rounded-sm transition-all shadow-sm flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">payments</span>
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Stories & Editorials Section */}
            <section id="featured-stories" className="pt-10 border-t border-outline-variant/60 space-y-6 scroll-mt-20">
              <div className="text-center space-y-2">
                <span className="text-secondary font-black text-xs uppercase tracking-widest block">Luxe Journal</span>
                <h3 className="font-headline-lg text-2xl font-bold tracking-tight text-primary">Featured Stories & Editorials</h3>
                <div className="h-0.5 w-16 bg-secondary mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {journalStories.map((story, i) => (
                  <div key={i} className="bg-white border border-outline-variant/55 overflow-hidden flex flex-col justify-between group rounded-sm shadow-sm hover:shadow-md transition-all">
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img 
                          src={story.image} 
                          alt={story.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-primary text-on-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {story.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] text-on-surface-variant font-semibold">{story.date} • By {story.author}</span>
                        <h4 className="font-headline-lg text-base font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{story.title}</h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2">
                          {story.content.substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-1">
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedStory(story);
                        }}
                        className="text-xs font-bold uppercase tracking-widest text-[#775a19] hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Read Full Story <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* 2. CATALOG SCREEN */}
        {currentPage === 'catalog' && (
          <div className="pb-12 animate-in fade-in duration-300">
            {/* Header detail */}
            <div className="mb-8 p-4 bg-[#efeded] border-l-4 border-secondary rounded-sm">
              <h2 className="font-headline-lg text-2xl">Luxe Collections Catalog</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Refined selection of dresses, blazers, stiletto footwear, and luxury handbags.
              </p>
            </div>

            {/* Filter + search layout bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Filter left column */}
              <aside className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-xs text-primary border-b pb-2 mb-3">Search Catalog</h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Type keywords..."
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2 text-xs rounded-sm focus:border-secondary outline-none font-medium text-primary"
                    />
                    {searchValue && (
                      <button onClick={() => setSearchValue('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-rose-600 font-bold">Clear</button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-xs text-primary border-b pb-2 mb-3">Categories</h3>
                  <ul className="space-y-1.5 text-xs text-on-surface-variant font-semibold">
                    <li 
                      onClick={() => setCategoryAndLog('All')} 
                      className={`cursor-pointer hover:text-primary py-1 flex items-center justify-between ${selectedCategory === 'All' ? 'text-primary font-bold' : ''}`}
                    >
                      <span>Show All</span>
                      <span className="text-[10px] text-on-surface-variant bg-[#efeded] px-1.5 py-0.5 rounded">{products.length}</span>
                    </li>
                    {categories.map(cat => (
                      <li 
                        key={cat.id}
                        onClick={() => setCategoryAndLog(cat.name)} 
                        className={`cursor-pointer hover:text-primary py-1 flex items-center justify-between ${selectedCategory === 'cat.name' || selectedCategory === cat.name ? 'text-primary font-bold' : ''}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-on-surface-variant bg-[#efeded] px-1.5 py-0.5 rounded">{cat.product_count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-xs text-primary border-b pb-2 mb-3">Price Range</h3>
                  <div className="space-y-2 text-xs text-on-surface-variant font-semibold">
                    {[
                      { label: '$0 - $250', value: '0-250' },
                      { label: '$250 - $500', value: '250-500' },
                      { label: '$500+', value: '500+' }
                    ].map(range => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                        <input 
                          type="checkbox"
                          checked={priceRanges.includes(range.value)}
                          onChange={() => handlePriceCheckbox(range.value)}
                          className="rounded border-outline-variant text-[#775a19] focus:ring-secondary"
                        />
                        <span>{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-xs text-primary border-b pb-2 mb-3">Browse Sizes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['All', 'XS', 'S', 'M', 'L', 'XL'].map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`border text-[11px] font-bold p-1 transition-all ${
                          selectedSize === sz 
                            ? 'bg-primary text-on-primary border-primary' 
                            : 'border-outline-variant hover:bg-[#efeded]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-xs text-primary border-b pb-2 mb-3">Filter Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Charcoal', 'Off-White', 'Gold', 'Olive', 'Navy', 'Black'].map(col => (
                      <button 
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        value={col}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                          selectedColor === col 
                            ? 'bg-[#fed488] text-primary border-secondary font-black' 
                            : 'border-outline-variant bg-white text-on-surface-variant hover:bg-slate-50'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Product Listing Right Column */}
              <main className="md:col-span-9 space-y-6">
                <div className="flex justify-between items-center bg-white border border-outline-variant/50 p-4 rounded-sm shadow-sm">
                  <p className="text-xs text-on-surface-variant font-semibold">
                    Showing <span className="font-bold text-primary">{filteredProducts.length}</span> luxury matches
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-on-surface-variant">Sort By:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-outline-variant rounded-sm text-xs p-1 outline-none font-bold text-primary"
                    >
                      <option>Featured</option>
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 p-8 bg-white border border-outline-variant text-[#ba1a1a] font-bold text-sm">
                    No Luxe items matching current filter boundaries. Reset filters to explore.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(prod => (
                      <div 
                        key={prod.id}
                        className="bg-white border border-outline-variant rounded-sm overflow-hidden flex flex-col justify-between h-full group"
                      >
                        <div className="relative aspect-[3/4] bg-[#fbf9f8] overflow-hidden">
                          <img 
                            src={prod.image} 
                            alt={prod.title} 
                            onClick={() => setSelectedProduct(prod)}
                            className="w-full h-full object-cover cursor-pointer group-hover:scale-102 transition-all duration-500"
                          />
                          {prod.is_limited && (
                            <span className="absolute top-2 right-2 bg-secondary text-on-secondary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                              Limited
                            </span>
                          )}
                          {prod.is_new && (
                            <span className="absolute top-2 left-2 bg-primary text-on-primary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                              New Piece
                            </span>
                          )}
                          <button 
                            onClick={() => handleWishlistToggle(prod.id)}
                            className={`absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              prod.is_limited ? 'top-10' : ''
                            } ${
                              wishlistIds.includes(prod.id) ? 'bg-rose-50 text-rose-600' : 'bg-white/85 text-primary hover:bg-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: wishlistIds.includes(prod.id) ? "'FILL' 1" : "" }}>favorite</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedProduct(prod); setDetailSize(prod.sizes[0] || 'S'); setDetailColor(prod.colors[0] || 'Off-White'); }}
                            className="absolute bottom-0 w-full bg-primary text-on-primary py-3 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-slate-900"
                          >
                            Explore Options
                          </button>
                        </div>
                        <div className="p-4 space-y-3 flex flex-col justify-between flex-1">
                          <div className="space-y-1.5">
                            <h4 onClick={() => setSelectedProduct(prod)} className="font-headline-lg text-base font-bold text-primary hover:text-secondary cursor-pointer">
                              {prod.title}
                            </h4>
                            <div className="flex justify-between items-center">
                              <span className="text-secondary font-bold text-sm">${prod.price.toFixed(2)}</span>
                              <div className="flex items-center text-secondary gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span 
                                    key={i} 
                                    className="material-symbols-outlined text-[14px]"
                                    style={{ fontVariationSettings: i < prod.rating ? "'FILL' 1" : "" }}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {prod.sizes.map(sz => (
                                <span key={sz} className="text-[9px] font-bold bg-[#f5f3f3] text-on-surface-variant px-1 border border-outline-variant/30">{sz}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenInstantOrder(prod)}
                            className="w-full bg-secondary hover:bg-[#8e6b1e] text-white py-2 text-xs font-bold uppercase tracking-wider text-center cursor-pointer rounded-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[15px]">payments</span>
                            Order & Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </main>
            </div>
          </div>
        )}

        {/* 3. AUTHENTICATION SCREEN */}
        {currentPage === 'auth' && (
          <div className="max-w-md mx-auto py-12 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white border border-outline-variant p-8 rounded-sm shadow-md space-y-6">
              <div className="text-center">
                <span className="text-secondary font-black text-xs uppercase tracking-widest block">Laravel Sanctum Auth</span>
                <h2 className="font-headline-lg text-2xl font-bold mt-1">
                  {authMode === 'login' ? 'Customer Identification' : 'Create Luxe Account'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-2 leading-tight">
                  {authMode === 'login' ? 'Use admin@luxe.com to explore management panel instantly.' : 'Complete inputs to generate simulated token block.'}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 text-[#ba1a1a] text-xs font-bold border-l-4 border-red-600 rounded">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Jane Miller"
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs rounded-sm focus:border-secondary outline-none font-medium"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={authMode === 'login' ? 'jessica@example.com or admin@luxe.com' : 'jessica@example.com'}
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs rounded-sm focus:border-secondary outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Password</label>
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs rounded-sm focus:border-secondary outline-none font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-slate-900 text-on-primary py-3 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-sm"
                >
                  {authMode === 'login' ? 'Authenticate Session' : 'Commit Credentials'}
                </button>
              </form>

              <div className="border-t border-outline-variant pt-4 text-center">
                <button 
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                  className="text-[#775a19] text-xs font-bold cursor-pointer hover:underline"
                >
                  {authMode === 'login' ? "Don't have an account? Sign Up" : 'Already Registered? Sign In'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. WISHLIST SCREEN */}
        {currentPage === 'wishlist' && (
          <div className="pb-12 space-y-6 animate-in fade-in duration-300">
            <div className="border-b pb-4 border-outline-variant">
              <h2 className="font-headline-lg text-2xl">My Curated Wishlist</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Your saved selection of exquisite fashion items. Add them to cart anytime.
              </p>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="text-center p-12 bg-[#efeded] rounded text-on-surface-variant font-semibold text-sm">
                Your Wishlist is currently empty. Explore the catalog and tap the heart icon on any product!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlistProducts.map(prod => (
                  <div key={prod.id} className="bg-white border border-outline-variant rounded overflow-hidden flex flex-col justify-between group">
                    <div className="relative aspect-[3/4] bg-[#fbf9f8] overflow-hidden">
                      <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleWishlistToggle(prod.id)}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                    <div className="p-3 text-left space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-headline-lg text-sm text-primary font-bold">{prod.title}</h4>
                        <p className="text-secondary font-bold text-xs mt-0.5">${prod.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => { onAddToCart(prod, 'S', 'Off-White'); handleWishlistToggle(prod.id); addAxiosLog('POST', '/cart', 201, 'cart'); }}
                        className="w-full bg-primary hover:bg-slate-900 border border-primary text-on-primary py-2 text-[10px] uppercase font-bold tracking-widest text-center cursor-pointer"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. SHOPPING CART SCREEN */}
        {currentPage === 'cart' && (
          <div className="pb-12 space-y-6 animate-in fade-in duration-300">
            <div className="border-b pb-4 border-outline-variant">
              <h2 className="font-headline-lg text-2xl">Your Shopping Box</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Review your selections before heading to checkout</p>
            </div>

            {cart.length === 0 ? (
              <div className="text-center p-12 bg-[#efeded] text-on-surface-variant font-semibold text-sm rounded">
                Your cart is empty. Fill it with premium items from our catalog!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Cart list */}
                <div className="lg:col-span-8 space-y-4">
                  {cart.map(item => (
                    <div 
                      key={item.id} 
                      className="bg-white border border-outline-variant p-4 rounded-sm flex gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img src={item.product.image} className="w-16 h-20 object-cover border rounded-sm" />
                        <div>
                          <h4 className="font-headline-lg text-base font-bold text-primary">{item.product.title}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            Size: <span className="font-bold text-primary">{item.size}</span> | Color: <span className="font-bold text-primary">{item.color}</span>
                          </p>
                          <p className="text-secondary font-bold text-xs mt-1">${item.product.price.toFixed(2)} each</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-outline-variant rounded">
                          <button 
                            onClick={() => { if (item.quantity > 1) { onUpdateCartQty(item.id, item.quantity - 1); addAxiosLog('PUT', `/cart/${item.id}`, 200, 'cart'); } }}
                            className="px-2 py-1 text-xs hover:bg-[#efeded] font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-primary">{item.quantity}</span>
                          <button 
                            onClick={() => { onUpdateCartQty(item.id, item.quantity + 1); addAxiosLog('PUT', `/cart/${item.id}`, 200, 'cart'); }}
                            className="px-2 py-1 text-xs hover:bg-[#efeded] font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => { onRemoveCartItem(item.id); addAxiosLog('DELETE', `/cart/${item.id}`, 200, 'cart'); }}
                          className="text-rose-600 hover:text-rose-800"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart summaries */}
                <div className="lg:col-span-4 bg-white border border-outline-variant p-6 rounded-sm space-y-4 h-fit shadow-sm">
                  <h3 className="font-bold uppercase tracking-wider text-xs border-b pb-2">Order Summary</h3>
                  <div className="text-xs space-y-2 text-on-surface-variant font-semibold">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-primary font-bold">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="text-emerald-600 font-bold">{cartSubtotal > 50 ? 'FREE' : '$15.00'}</span>
                    </div>
                    <div className="border-t border-outline-variant pt-3 flex justify-between text-sm font-bold text-primary">
                      <span>Total</span>
                      <span>${(cartSubtotal + (cartSubtotal > 50 ? 0 : 15)).toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-primary hover:bg-slate-900 text-on-primary py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer rounded-sm"
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. CHECKOUT SCREEN */}
        {currentPage === 'checkout' && (
          <div className="pb-12 animate-in fade-in duration-300">
            <div className="border-b pb-4 border-outline-variant mb-6">
              <h2 className="font-headline-lg text-2xl">Luxe Secure Checkout</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Complete details to commit your purchase recorded through Laravel Sanctum.</p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-white border border-outline-variant p-6 rounded-sm space-y-4">
                <h3 className="font-bold uppercase tracking-wider text-xs border-b pb-2">Billing Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Customer Name</label>
                    <input 
                      type="text" 
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs focus:border-secondary outline-none font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs focus:border-secondary outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Delivery Street address</label>
                  <textarea 
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    rows={3}
                    placeholder="E.g. #15, Street 200, Phnom Penh, Cambodia"
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs focus:border-secondary outline-none font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Financing Method / Card detail</label>
                  <input 
                    type="text" 
                    value={checkoutCard}
                    onChange={(e) => setCheckoutCard(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2.5 text-xs focus:border-secondary outline-none font-medium"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-outline-variant p-6 rounded-sm space-y-4 shadow-sm h-fit">
                <h3 className="font-bold uppercase tracking-wider text-xs border-b pb-2">Purchase Overview</h3>
                <div className="space-y-3 max-h-[200px] overflow-auto custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-on-surface-variant">
                      <span className="font-semibold text-primary">{item.product.title} <span className="text-secondary">(x{item.quantity})</span></span>
                      <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-outline-variant pt-3 text-xs space-y-1.5 text-on-surface-variant font-semibold">
                  <div className="flex justify-between">
                    <span>Basket Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Tax & Carriage</span>
                    <span>{cartSubtotal > 50 ? 'FREE' : '$15.00'}</span>
                  </div>
                  <div className="border-t border-dashed pt-2 flex justify-between text-sm font-bold text-primary">
                    <span>Final Amount Paid</span>
                    <span>${(cartSubtotal + (cartSubtotal > 50 ? 0 : 15)).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-slate-900 text-on-primary py-4 text-xs font-bold uppercase tracking-widest cursor-pointer rounded-sm"
                >
                  Commit Order Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 7. ORDERS SCREEN */}
        {currentPage === 'orders' && (
          <div className="pb-12 space-y-6 animate-in fade-in duration-300">
            <div className="border-b pb-4 border-outline-variant">
              <h2 className="font-headline-lg text-2xl">My Order History</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1"> chronologically pulled through authenticated user token</p>
            </div>

            {orders.filter(o => o.customer_email === currentUser?.email).length === 0 ? (
              <div className="p-12 text-center bg-[#efeded] text-on-surface-variant font-bold text-sm rounded">
                No orders discovered under details: {currentUser?.email}. Make some purchases to populate this view.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.filter(o => o.customer_email === currentUser?.email).reverse().map(order => (
                  <div key={order.id} className="bg-white border border-outline-variant rounded-sm overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-[#efeded] p-4 flex flex-col md:flex-row md:items-center justify-between text-xs gap-2">
                      <div className="flex flex-wrap gap-4 font-semibold text-on-surface-variant">
                        <div>
                          Order ID: <span className="text-primary font-bold">{order.order_number}</span>
                        </div>
                        <div>
                          Date: <span className="text-primary font-bold">{order.date}</span>
                        </div>
                        <div>
                          Total Paid: <span className="text-secondary font-bold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Processing' ? 'bg-[#fed488] text-[#785a1a]' : 'bg-rose-100 text-[#93000a]'
                      }`}>
                        Status: {order.status}
                      </span>
                    </div>

                    {/* Details list */}
                    <div className="p-4 space-y-4">
                      {order.items.map(it => (
                        <div key={it.id} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">label</span>
                            <div>
                              <span className="font-bold text-primary">{it.product_title}</span>
                              <span className="text-[10px] text-on-surface-variant ml-2 font-medium">Quantity {it.quantity} | Size {it.size}</span>
                            </div>
                          </div>
                          <span className="font-mono text-primary font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8. PROFILE SCREEN */}
        {currentPage === 'profile' && (
          <div className="max-w-2xl mx-auto pb-12 animate-in fade-in duration-300">
            <div className="bg-white border border-outline-variant p-8 rounded-sm shadow-sm space-y-6">
              <div className="border-b pb-4 border-outline-variant">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest block">Manage Authenticated Account</span>
                <h2 className="font-headline-lg text-2xl font-bold mt-1">Sanctum Profile Settings</h2>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold border-l-4 border-emerald-600 rounded">
                  {profileSuccessMsg}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#444748] uppercase tracking-wider block">Your Name</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#c4c7c7] p-2.5 text-xs rounded outline-none font-medium text-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#444748] uppercase tracking-wider block">Registered Email</label>
                    <input 
                      type="email" 
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#c4c7c7] p-2.5 text-xs rounded outline-none font-medium text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#444748] uppercase tracking-wider block">Update Secret Password (Simulation)</label>
                  <input 
                    type="password" 
                    value={profilePwd}
                    onChange={(e) => setProfilePwd(e.target.value)}
                    placeholder="Enter new password if changing..."
                    className="w-full bg-[#fbf9f8] border border-[#c4c7c7] p-2.5 text-xs rounded outline-none font-medium text-primary"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-primary hover:bg-slate-900 text-on-primary py-3 px-8 text-xs font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Product Detail Modal overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white w-full max-w-4xl p-6 rounded-sm shadow-2xl relative grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[92vh] overflow-y-auto animate-in zoom-in duration-300">
            {/* Close button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#efeded] flex items-center justify-center hover:bg-rose-100 hover:text-rose-700 cursor-pointer text-primary"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Left Col Image */}
            <div className="md:col-span-5 h-[340px] md:h-[450px] bg-[#fbf9f8] border rounded-sm overflow-hidden shadow-sm">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.title} />
            </div>

            {/* Right Col purchase selection details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] bg-[#efeded] text-[#444748] px-2.5 py-0.5 uppercase tracking-wider font-bold rounded">
                  {selectedProduct.category} Catalog
                </span>
                <h3 className="font-headline-lg text-2xl mt-1.5">{selectedProduct.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-secondary font-extrabold text-lg">${selectedProduct.price.toFixed(2)}</span>
                  <div className="flex items-center text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: i < selectedProduct.rating ? "'FILL' 1" : "" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-xs text-[#444748] ml-1">({selectedProduct.reviews.length || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant font-medium leading-relaxed bg-[#fbf9f8] p-3 border-l-2 border-secondary rounded">
                {selectedProduct.description}
              </p>

              {/* Sizes selection */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Select Fit Size</span>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map(sz => (
                    <button 
                      key={sz}
                      onClick={() => setDetailSize(sz)}
                      className={`h-8 min-w-[36px] font-bold text-xs border rounded transition-all cursor-pointer ${
                        detailSize === sz ? 'bg-primary text-on-primary border-primary' : 'bg-white border-outline-variant text-[#444748] hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection circles */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Selected color accent</span>
                <div className="flex gap-2">
                  {selectedProduct.colors.map(col => (
                    <button 
                      key={col}
                      onClick={() => setDetailColor(col)}
                      className={`text-xs px-3 py-1 font-bold border rounded-full cursor-pointer transition-all ${
                        detailColor === col ? 'bg-secondary text-white border-secondary' : 'bg-white text-on-surface-variant border-outline-variant hover:bg-slate-50'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock info and cart placement */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch">
                <button 
                  type="button"
                  onClick={() => {
                    if (selectedProduct.stock > 0) {
                      onAddToCart(selectedProduct, detailSize, detailColor);
                      addAxiosLog('POST', '/cart', 201, 'cart');
                      setSelectedProduct(null);
                    }
                  }}
                  disabled={selectedProduct.stock === 0}
                  className="flex-1 bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-900 border border-primary text-on-primary py-3.5 text-xs font-bold uppercase tracking-widest text-center cursor-pointer rounded-sm shadow-md transition-all"
                >
                  {selectedProduct.stock > 0 ? 'Curate to Cart' : 'Out Of Stock'}
                </button>
                {selectedProduct.stock > 0 && (
                  <button 
                    type="button"
                    onClick={() => {
                      handleOpenInstantOrder(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-secondary hover:bg-[#8e6b1e] text-white py-3.5 text-xs font-bold uppercase tracking-widest text-center cursor-pointer rounded-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">payments</span>
                    Instant Order
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => { handleWishlistToggle(selectedProduct.id); }}
                  className={`h-11 w-11 rounded-full border border-outline-variant flex items-center justify-center cursor-pointer transition-all ${
                    wishlistIds.includes(selectedProduct.id) ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: wishlistIds.includes(selectedProduct.id) ? "'FILL' 1" : "" }}>favorite</span>
                </button>
              </div>

              {/* Reviews subsection */}
              <div className="border-t border-outline-variant pt-4 space-y-4">
                <h4 className="font-headline-lg text-lg">Product Reviews ({selectedProduct.reviews.length || 0})</h4>
                
                {/* Review log List */}
                <div className="space-y-3 max-h-[150px] overflow-auto custom-scrollbar">
                  {selectedProduct.reviews.length === 0 ? (
                    <p className="text-xs text-on-surface-variant bg-[#efeded] p-3 rounded font-medium">No reviews published yet for this piece. Be the first to share your experience!</p>
                  ) : (
                    selectedProduct.reviews.map(re => (
                      <div key={re.id} className="p-3 bg-[#fbf9f8] rounded border border-outline-variant/50 text-xs">
                        <div className="flex justify-between items-center text-[#444748] font-bold">
                          <span>{re.user_name} (Verified)</span>
                          <span className="font-medium text-[10px]">{re.created_at}</span>
                        </div>
                        <div className="flex text-secondary gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, r_idx) => (
                            <span key={r_idx} className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: r_idx < re.rating ? "'FILL' 1" : "" }}>star</span>
                          ))}
                        </div>
                        <p className="text-on-surface mt-1.5 font-medium leading-relaxed">{re.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write a review form */}
                <form onSubmit={(e) => handleReviewSubmit(e, selectedProduct.id)} className="space-y-2 border-t pt-3 border-dashed">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Publish Your Experience</span>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(rt => (
                        <span 
                          key={rt}
                          onClick={() => setNewReviewRating(rt)}
                          className="material-symbols-outlined text-base text-secondary cursor-pointer"
                          style={{ fontVariationSettings: rt <= newReviewRating ? "'FILL' 1" : "" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder={currentUser ? "Tailored wool is gorgeous..." : "Please sign in to write reviews"}
                      disabled={!currentUser}
                      className="flex-1 bg-[#fbf9f8] disabled:bg-slate-100 disabled:cursor-not-allowed border border-[#c4c7c7] p-2 text-xs rounded-sm outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!currentUser}
                      className="bg-primary hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-on-primary text-[10px] font-bold uppercase tracking-wider px-3 rounded-sm cursor-pointer"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ORDER & SECURE PAYMENT MODAL */}
      {instantOrderProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-primary text-on-primary p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <div>
                  <h3 className="font-headline-lg text-base font-bold uppercase tracking-wider">Secure Instant Checkout</h3>
                  <p className="text-[9px] text-[#fed488] font-bold uppercase tracking-widest">Laravel Sanctum Standard Shield</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setInstantOrderProduct(null)}
                className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleInstantOrderSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Product Brief section */}
              <div className="bg-[#fbf9f8] border border-outline-variant/60 p-4 rounded-sm flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between">
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-12 bg-white border rounded-sm overflow-hidden flex-shrink-0">
                    <img src={instantOrderProduct.image} alt={instantOrderProduct.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-headline-lg text-sm text-primary font-bold">{instantOrderProduct.title}</h4>
                    <p className="text-secondary font-bold text-xs">${instantOrderProduct.price.toFixed(2)}</p>
                    <div className="flex gap-2 text-[10px] text-on-surface-variant font-semibold mt-1">
                      <span>Size: {instantSize}</span>
                      <span>•</span>
                      <span>Color: {instantColor}</span>
                    </div>
                  </div>
                </div>

                {/* Option selector inside modal */}
                <div className="flex flex-wrap gap-3 sm:text-right">
                  {/* Select size */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Size</label>
                    <select 
                      value={instantSize} 
                      onChange={(e) => setInstantSize(e.target.value)}
                      className="bg-white border border-outline-variant p-1 text-xs outline-none font-bold text-primary rounded-sm"
                    >
                      {instantOrderProduct.sizes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                  {/* Select color */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Color</label>
                    <select 
                      value={instantColor} 
                      onChange={(e) => setInstantColor(e.target.value)}
                      className="bg-white border border-outline-variant p-1 text-xs outline-none font-bold text-primary rounded-sm"
                    >
                      {instantOrderProduct.colors.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  {/* Select Quantity */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Qty</label>
                    <select 
                      value={instantQty} 
                      onChange={(e) => setInstantQty(Number(e.target.value))}
                      className="bg-white border border-outline-variant p-1 text-xs outline-none font-bold text-primary rounded-sm"
                    >
                      {[1, 2, 3, 4, 5].map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Billing details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-1">
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#775a19]">
                      1. Customer Information
                    </h4>
                    {currentUser ? (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">check_circle</span>
                        Authenticated
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-50 text-amber-700 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                        Registration Required
                      </span>
                    )}
                  </div>

                  {instantRegError && (
                    <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold uppercase rounded-sm animate-pulse">
                      {instantRegError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={instantName}
                      onChange={(e) => setInstantName(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2 text-xs focus:border-secondary outline-none font-medium rounded-sm"
                      required
                      disabled={!!currentUser}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      value={instantEmail}
                      onChange={(e) => setInstantEmail(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2 text-xs focus:border-secondary outline-none font-medium rounded-sm"
                      required
                      disabled={!!currentUser}
                    />
                  </div>

                  {!currentUser && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block flex justify-between">
                        <span>Choose Password</span>
                        <span className="text-[#775a19] text-[9px] font-extrabold lowercase italic">Saves account upon payment completion</span>
                      </label>
                      <input 
                        type="password" 
                        value={instantPassword}
                        onChange={(e) => setInstantPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#fbf9f8] border border-outline-variant p-2 text-xs focus:border-secondary outline-none font-medium rounded-sm"
                        required={!currentUser}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Delivery Address</label>
                    <textarea 
                      value={instantAddress}
                      onChange={(e) => setInstantAddress(e.target.value)}
                      rows={2}
                      placeholder="e.g., Street 240, Phnom Penh, Cambodia"
                      className="w-full bg-[#fbf9f8] border border-outline-variant p-2 text-xs focus:border-secondary outline-none font-medium rounded-sm resize-none"
                      required
                    />
                  </div>

                  {!currentUser && (
                    <button
                      type="button"
                      onClick={handleInstantRegisterAndContinue}
                      className="w-full bg-[#775a19] hover:bg-primary text-white py-2 px-3 text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      Register & Continue to Payment
                    </button>
                  )}
                </div>

                {/* Secure payment section */}
                <div className="space-y-4 bg-slate-50 p-4 border border-outline-variant/60 rounded-sm relative overflow-hidden">
                  {/* Overlay screen if they need to register first */}
                  {!currentUser && instantRegStep === 'info' && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-6 z-20 animate-in fade-in duration-200">
                      <span className="material-symbols-outlined text-4xl text-[#775a19] mb-2 animate-bounce">lock</span>
                      <h5 className="text-xs font-bold uppercase tracking-widest text-primary">2. Luxury Card Details</h5>
                      <p className="text-[10px] text-on-surface-variant font-semibold mt-2 max-w-[200px] leading-relaxed">
                        Please fill in your customer credentials and click the <span className="font-extrabold text-[#775a19] uppercase">Register & Continue</span> button to unlock secure credit card details.
                      </p>
                    </div>
                  )}

                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#775a19] border-b pb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span> 2. Luxury Card Details
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={instantCard}
                        onChange={(e) => setInstantCard(e.target.value)}
                        placeholder="4200 1234 5678 9012"
                        className="w-full bg-white border border-outline-variant p-2 pl-8 text-xs focus:border-secondary outline-none font-medium rounded-sm font-mono"
                        required={currentUser || instantRegStep === 'payment'}
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">credit_card</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Expires</label>
                      <input 
                        type="text" 
                        defaultValue="12/29" 
                        placeholder="MM/YY" 
                        className="w-full bg-white border border-outline-variant p-2 text-xs focus:border-secondary outline-none font-medium rounded-sm font-mono"
                        required={currentUser || instantRegStep === 'payment'}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">CVC Security</label>
                      <input 
                        type="text" 
                        defaultValue="891" 
                        placeholder="123" 
                        className="w-full bg-white border border-outline-variant p-2 text-xs focus:border-secondary outline-none font-medium rounded-sm font-mono"
                        required={currentUser || instantRegStep === 'payment'}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-outline-variant mt-2 text-[10px] font-semibold text-on-surface-variant space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal ({instantQty} item{instantQty > 1 ? 's' : ''}):</span>
                      <span>${(instantOrderProduct.price * instantQty).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Luxury Courier:</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-primary pt-1 border-t">
                      <span>Total Amount Paid:</span>
                      <span>${(instantOrderProduct.price * instantQty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!currentUser}
                className={`w-full py-3 text-xs font-bold uppercase tracking-widest rounded-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  currentUser 
                    ? 'bg-primary hover:bg-slate-900 text-on-primary cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                {currentUser 
                  ? `Authorize & Complete Payment ($${(instantOrderProduct.price * instantQty).toFixed(2)})`
                  : 'Complete Registration to Pay & Order'
                }
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INSTANT ORDER SUCCESS MODAL */}
      {showInstantSuccess && orderedProductForSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl relative overflow-hidden animate-in zoom-in duration-300 border border-outline-variant">
            {/* Header / Celebration banner */}
            <div className="bg-emerald-800 text-white p-6 text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-white">check_circle</span>
              </div>
              <h3 className="font-headline-lg text-lg font-bold uppercase tracking-wider">Payment Authorized</h3>
              <p className="text-[10px] text-emerald-200 font-bold tracking-widest uppercase">Luxe Signature Order Created</p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-on-surface-variant font-medium text-center">
                Thank you! Your payment has been securely authorized and completed. The order is recorded in your customer profile.
              </p>

              <div className="bg-[#fbf9f8] p-4 rounded-sm border border-outline-variant/60 space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="h-14 w-10 bg-white border rounded-sm overflow-hidden">
                    <img src={orderedProductForSuccess.image} alt={orderedProductForSuccess.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-xs">
                    <h4 className="font-bold text-primary">{orderedProductForSuccess.title}</h4>
                    <p className="text-secondary font-bold font-mono text-[10px] mt-0.5">Order Standard Code: LX-901{orders.length + 19}</p>
                    <p className="text-on-surface-variant font-medium text-[10px] mt-0.5">Specifications: {instantSize} Fit | {instantColor} accent</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-outline-variant pt-2 space-y-1 text-[10px] text-on-surface-variant font-semibold">
                  <div className="flex justify-between">
                    <span>Account:</span>
                    <span className="text-primary font-bold">{instantName} ({instantEmail})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivering to:</span>
                    <span className="text-primary font-bold">{instantAddress}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInstantSuccess(false);
                    setCurrentPage('orders');
                  }}
                  className="bg-primary hover:bg-slate-900 text-on-primary py-2.5 text-xs font-bold uppercase tracking-wider text-center cursor-pointer rounded-sm font-sans"
                >
                  View My Orders
                </button>
                <button
                  type="button"
                  onClick={() => setShowInstantSuccess(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-primary py-2.5 text-xs font-bold uppercase tracking-wider text-center cursor-pointer rounded-sm border font-sans"
                >
                  Keep Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-6 relative flex flex-col justify-between animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 
                  onClick={() => {
                    setCurrentPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-headline-lg font-bold text-2xl tracking-tighter cursor-pointer text-primary"
                >
                  Luxe<span className="text-secondary font-bold">.</span>
                </h2>
                <button 
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-primary hover:bg-slate-100 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Navigation Menu Links */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block border-b pb-1">Shop Pages</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${currentPage === 'home' ? 'text-secondary' : 'text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">home</span>
                    Home Page
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage('catalog');
                      setCategoryAndLog('All');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${currentPage === 'catalog' && selectedCategory === 'All' ? 'text-secondary' : 'text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">new_releases</span>
                    New Arrivals
                  </button>
                  <button
                    type="button"
                    onClick={handleFeaturedStoriesClick}
                    className="w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                    Featured Stories
                  </button>
                </div>

                {/* Mobile Collections Section */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block border-b pb-1">Our Collections</span>
                  <div className="pl-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('catalog');
                        setCategoryAndLog('All');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center justify-between"
                    >
                      <span>Show All Collections</span>
                      <span className="text-[10px] bg-[#f5f3f3] text-primary px-1.5 rounded">{products.length}</span>
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCurrentPage('catalog');
                          setCategoryAndLog(cat.name);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left py-1.5 text-xs font-semibold hover:text-primary flex items-center justify-between ${selectedCategory === cat.name ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] bg-[#f5f3f3] text-primary px-1.5 rounded">{cat.product_count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Account area */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block border-b pb-1">Customer Lounge</span>
                  <div className="pl-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (currentUser) {
                          setCurrentPage('profile');
                          setProfileName(currentUser.name);
                          setProfileEmail(currentUser.email);
                        } else {
                          setAuthMode('login');
                          setCurrentPage('auth');
                        }
                      }}
                      className="w-full text-left py-1 text-xs font-bold uppercase text-primary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      {currentUser ? `Account: ${currentUser.name.split(' ')[0]}` : 'Sign In / Register'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('wishlist');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1 text-xs font-bold uppercase text-primary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                      Wishlist ({wishlistIds.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('cart');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1 text-xs font-bold uppercase text-primary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
                    </button>

                    {currentUser && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage('orders');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left py-1 text-xs font-bold uppercase text-primary flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                          My Orders ({orders.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleLogoutClick();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left py-1 text-xs font-bold uppercase text-rose-700 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer inside drawer */}
            <div className="border-t pt-4 text-center mt-6">
              <p className="text-[10px] text-on-surface-variant font-medium">Laravel Sanctum Standard Session</p>
              <p className="text-[8px] text-on-surface-variant/70 font-semibold mt-0.5">Secure Shield v1.42</p>
            </div>
          </div>
        </div>
      )}

      {/* FEATURED STORY READER MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            {/* Image Header with category */}
            <div className="relative h-64 bg-slate-100">
              <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <button 
                type="button"
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="bg-secondary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm inline-block">{selectedStory.category}</span>
                <h3 className="font-headline-lg text-lg sm:text-2xl font-bold tracking-tight">{selectedStory.title}</h3>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-semibold border-b pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">person</span>
                  <span>Written by {selectedStory.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                  <span>{selectedStory.date}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-primary leading-relaxed font-normal whitespace-pre-line">
                {selectedStory.content}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="bg-primary hover:bg-slate-900 text-on-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer transition-colors"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
