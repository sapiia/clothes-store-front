import React, { useState, useMemo } from 'react';
import { Product, Category, Order, User } from '../types';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onAddCategory: (name: string, slug: string) => void;
  onDeleteCategory: (catId: number) => void;
  onUpdateOrderStatus: (orderId: number, status: Order['status']) => void;
  activeSnippetSetter: (key: any) => void;
}

const getStatusStyles = (status: Order['status']) => {
  switch (status) {
    case 'Pending':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dot: 'bg-amber-500 animate-pulse',
        icon: 'pending'
      };
    case 'Processing':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dot: 'bg-blue-500',
        icon: 'sync'
      };
    case 'Shipped':
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200/60',
        dot: 'bg-purple-500',
        icon: 'local_shipping'
      };
    case 'Delivered':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dot: 'bg-emerald-500',
        icon: 'task_alt'
      };
    case 'Completed':
      return {
        badge: 'bg-teal-50 text-teal-700 border-teal-200/60',
        dot: 'bg-teal-500',
        icon: 'check_circle'
      };
    default:
      return {
        badge: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-500',
        icon: 'help_outline'
      };
  }
};

export default function AdminPanel({
  products,
  categories,
  orders,
  users,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateOrderStatus,
  activeSnippetSetter
}: AdminPanelProps) {
  const [adminView, setAdminView] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'users'>('dashboard');

  // Search/Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');

  // Add/Edit Product Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form Field States
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState(0);
  const [prodSku, setProdSku] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodRating, setProdRating] = useState(5);
  const [prodSizes, setProdSizes] = useState<string[]>(['XS', 'S', 'M', 'L']);
  const [isUploadingMock, setIsUploadingMock] = useState(false);

  // Add Category Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [catSlugInput, setCatSlugInput] = useState('');

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const totalSales = orders.reduce((total, o) => total + o.total, 0);
    const completedOrders = orders.length;
    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const activeProducts = products.filter(p => p.status === 'active' || p.status === 'limited').length;
    return { totalSales, completedOrders, totalCustomers, activeProducts };
  }, [orders, users, products]);

  // Open product form for creating/editing
  const handleOpenProductModal = (prod: Product | null = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProdTitle(prod.title);
      setProdPrice(prod.price);
      setProdCategory(prod.category);
      setProdStock(prod.stock);
      setProdSku(prod.sku);
      setProdDescription(prod.description);
      setProdImage(prod.image);
      setProdRating(prod.rating);
      setProdSizes(prod.sizes.length > 0 ? prod.sizes : ['XS', 'S', 'M', 'L']);
    } else {
      setEditingProduct(null);
      setProdTitle('');
      setProdPrice(79.99);
      setProdCategory(categories[0]?.name || 'Dresses');
      setProdStock(45);
      setProdSku(`LX-${Date.now().toString().slice(-4)}`);
      setProdDescription('Fine-grade wool and silk materials designed for daily luxury styling.');
      setProdImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBqDFRyp36hV40eaq8CyzKk79mK4uD79oksxaL3WVc9b5TAgPzr2WvFhIzKGtLOzvWoUOGOHKgfoCkr_MEL7s6UTO66uA1QdS7NDPRoNnFUhdtrZtxT0PAlq3JmnHnn9vL_ucWfFt30k9g265rYWXy8eqB4u7KFoHfa63ms-gLkjuGRNu-BSfOvzdsfIrZ3ILL3qsTT36VFwcN9x40zOyaULlvMFExPbup4aHbxbMbgtZvLk-yinJqzxvU_nX31pvvGNWvnYG53j2Ql');
      setProdRating(5);
      setProdSizes(['XS', 'S', 'M', 'L']);
    }
    setShowProductModal(true);
  };

  // Simulated drag-and-drop / select upload for assets matching task guidelines
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingMock(true);
    setTimeout(() => {
      setIsUploadingMock(false);
      // Give them a gorgeous high fashion product image from our list on completion
      const uploadImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAMNgwkvMzYlOfuVe8BNsU-1McvWdJhWVyoRHS0PRnbU5lzIW6Xr36f9sdDzmemg2GN2Xlr-kY_l35J__4xc0TyGnsdKJ_NrO8NEMPoNroRKPbWVLD9ouASkF9_HGx5bfamAEUl1xdNFdMs_SGDAqhXl28AMiRmORwNN1AScOwPVQErd6_ijMGXj1wq652EnHLemdloln4p-iR4cRjvFkvJwe-iZE6lsJhPt5iBNEafWawfJKTzH9gMMK15VPhEgcGRr-GUKk0sPgLQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfGnETFnhlR8Cc3kxz3WSSwO_zOFC5k8JTajPcpw5cyOOB_yw9_-Dd9wSiScP_yVbcP_Ix_CTomgUi8NMXwNZyzxTvL44Oca1_Ev2nmOeMhI1QmKcCq34LVeKNRIn7gVF1AwhfOGDLgffMIJPlXJR0tj3xBMPgtRKgYxCq-8YSbfnubwcezOtWSAhFvi0Zol1eR8tx9LjuRJ9EImL73JhZvwp1YJUHk3rQsUcsoYnbzcChqWgyhWYSUAXBXM6HvX8MewUeMaPje2-U',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASwpaIhV-RFzXPlKTy8Svw9Q4tWRu0m1zK6miRahf0gezWs-a86JOqiopFHka-Vw2WelZV2SdhYzQgaoM9G7v-iSr0Xs9WL87IkbNQ9C9yTKApfBrF-EkF5_Ae1eYlbpeElxFJ1--hOZD5iFkXRx-xEUE1koW9wOpfej1p7oDyz3xoO3yyWuyUKuTk_rc7ep3ils4DSdVJHdSdu08rX51oi0qRcP2vbrSuBfx787U_6EBdkCnmqXjFNigdknefu960MGninHK5sFol'
      ];
      const randomUrl = uploadImages[Math.floor(Math.random() * uploadImages.length)];
      setProdImage(randomUrl);
    }, 1200);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodSku || prodPrice <= 0) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: prodTitle,
        sku: prodSku,
        price: prodPrice,
        category: prodCategory,
        stock: prodStock,
        description: prodDescription,
        image: prodImage,
        rating: prodRating,
        sizes: prodSizes,
        status: prodStock === 0 ? 'archive' : (prodStock <= 15 ? 'limited' : 'active')
      };
      onUpdateProduct(updated);
    } else {
      const created: Product = {
        id: Date.now(),
        title: prodTitle,
        sku: prodSku,
        price: prodPrice,
        category: prodCategory,
        stock: prodStock,
        image: prodImage,
        rating: prodRating,
        status: prodStock <= 15 ? 'limited' : 'active',
        description: prodDescription,
        sizes: prodSizes,
        colors: ['Charcoal', 'Off-White'],
        reviews: []
      };
      onAddProduct(created);
    }
    setShowProductModal(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput || !catSlugInput) return;
    onAddCategory(catNameInput, catSlugInput);
    setCatNameInput('');
    setCatSlugInput('');
    setShowCategoryModal(false);
  };

  const filteredProdList = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = selectedCatFilter === '' || p.category === selectedCatFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, selectedCatFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
      
      {/* 1. Charcoal Sidebar Nav (Blade Aesthetic) */}
      <nav className="lg:col-span-3 bg-slate-900 text-slate-100 rounded p-6 space-y-8 flex flex-col font-sans">
        <div>
          <span className="text-[10px] text-amber-500 uppercase tracking-widest font-black block">System Laravel Blade View</span>
          <h1 className="font-bold text-lg text-white mt-1 border-b border-slate-800 pb-3">Luxe Management Panel</h1>
        </div>

        <div className="space-y-1.5 flex-1 text-xs uppercase font-extrabold tracking-widest text-[#bbc4c4]">
          {[
            { id: 'dashboard', label: 'E-Commerce Stats', icon: 'monitoring' },
            { id: 'products', label: 'Produce Catalog (CRUD)', icon: 'style' },
            { id: 'categories', label: 'Categories Table', icon: 'grid_view' },
            { id: 'orders', label: 'Customer Purchase Orders', icon: 'receipt_long' },
            { id: 'users', label: 'Registered Accounts', icon: 'people' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setAdminView(view.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-sm text-left transition-all ${
                adminView === view.id 
                  ? 'bg-secondary text-white font-black' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{view.icon}</span>
              <span>{view.label}</span>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 font-mono space-y-1">
          <div>PHP Engine: <span className="text-emerald-500 font-bold">Laravel v11.x</span></div>
          <div>Database: <span className="text-emerald-500 font-bold">In-Memory Sandbox</span></div>
          <div>Sanctum Status: <span className="text-emerald-500 font-bold">Active Shield</span></div>
        </div>
      </nav>

      {/* 2. Primary Admin Working Area */}
      <main className="lg:col-span-9 space-y-6">

        {/* VIEW 1: DASHBOARD STATS */}
        {adminView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex border-b border-dashed pb-4 border-[#ffdea5] justify-between items-center">
              <div>
                <h2 className="font-headline-lg text-2xl text-primary font-bold">Administrative Dashboard</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Real-time computation generated directly through local state engines</p>
              </div>
              <button 
                onClick={() => activeSnippetSetter('laravelAuthController')}
                className="text-xs bg-[#FDF9F0] text-secondary border border-secondary hover:bg-slate-50 px-3 py-1.5 font-bold uppercase tracking-widest"
              >
                Inspect Auth php Controller
              </button>
            </div>

            {/* Stat counts row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Earnings', val: `$${stats.totalSales.toFixed(2)}`, desc: 'Accrued checkout payments', color: 'bg-indigo-50 border-indigo-200 text-indigo-900', icon: 'payments' },
                { label: 'Orders Handled', val: stats.completedOrders, desc: 'Fulfillment and pending tracking', color: 'bg-[#ffdea5]/55 border-[#f9cb79] text-[#715918]', icon: 'inventory' },
                { label: 'Saved Products', val: stats.activeProducts, desc: 'Active storefront sku items', color: 'bg-emerald-50 border-emerald-200 text-emerald-900', icon: 'check_circle' },
                { label: 'Unique Customers', val: stats.totalCustomers, desc: 'Registered Sanctum sessions', color: 'bg-rose-50 border-rose-200 text-rose-900', icon: 'people' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded border ${stat.color} flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider block">{stat.label}</span>
                    <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold block">{stat.val}</span>
                    <span className="text-[10px] block mt-1 opacity-80">{stat.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Sales Trends Line Chart */}
            <div className="bg-white border border-[#c4c7c7] p-6 rounded relative shadow-sm">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block tracking-wider mb-2">Sales Revenue Flow Stream 2026 (USD)</span>
              <div className="h-[200px] w-full mt-4 bg-[#fbf9f8] rounded border flex items-end p-4 relative">
                {/* SVG Line representation of fashion revenue */}
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path 
                    d="M 10 180 Q 150 140 250 80 T 490 30" 
                    fill="none" 
                    stroke="#775a19" 
                    strokeWidth="3" 
                  />
                  <path 
                    d="M 10 180 Q 150 140 250 80 T 490 30 L 490 200 L 10 200 Z" 
                    fill="url(#trendGrad)" 
                    opacity="0.1" 
                  />
                  <defs>
                    <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#775a19" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                  {/* Highlight dots */}
                  <circle cx="250" cy="80" r="5" fill="#775a19" />
                  <circle cx="490" cy="30" r="5" fill="#775a19" />
                </svg>

                {/* Overlaid stat value charts */}
                <div className="absolute top-8 left-8 text-xs font-bold text-[#ba1a1a] bg-red-50 px-2 py-1 border border-red-200">
                  +12.4% Season Peak recorded in June
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCTS CRUD PANEL */}
        {adminView === 'products' && (
          <div className="space-y-4">
            <div className="flex border-b border-dashed border-[#ffdea5] pb-4 justify-between items-center bg-white border border-outline-variant/40 p-4 shadow-sm rounded-sm">
              <div>
                <h2 className="font-headline-lg text-xl font-bold">Storefront Products Catalog ({products.length})</h2>
                <p className="text-xs text-on-surface-variant">Update prices, replenish active warehouse stock, or archive luxury items.</p>
              </div>
              <button 
                onClick={() => handleOpenProductModal()}
                className="bg-primary hover:bg-slate-900 border border-primary text-on-primary text-xs font-bold uppercase tracking-widest px-4 py-2 cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Add New Product
              </button>
            </div>

            {/* Filter and search bars wrapper */}
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search Sku or title..."
                className="bg-white border border-outline-variant p-2.5 text-xs focus:border-secondary outline-none font-medium flex-1 text-primary"
              />
              <select 
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="border border-[#c4c7c7] text-xs p-2.5 outline-none font-bold text-primary bg-white"
              >
                <option value="">All Categories Filter</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Product Table */}
            <div className="bg-white border border-outline-variant overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#efeded] text-[#444748] font-bold border-b border-outline-variant text-[11px] uppercase tracking-wider">
                    <th className="p-4">SKU Code</th>
                    <th className="p-4">Catalog Product detail</th>
                    <th className="p-4">Linked Category</th>
                    <th className="p-4">Price (USD)</th>
                    <th className="p-4 text-center">In-Warehouse Stock</th>
                    <th className="p-4 text-right">Activity Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {filteredProdList.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary">{prod.sku}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} className="w-9 h-11 object-cover border" />
                          <div>
                            <span className="font-bold text-primary block text-sm">{prod.title}</span>
                            <span className="text-[10px] text-on-surface-variant block capitalize">Fulfillment Status: {prod.status}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant font-semibold">{prod.category}</td>
                      <td className="p-4 font-bold text-primary">${prod.price.toFixed(2)}</td>
                      <td className="p-4 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          prod.stock === 0 ? 'bg-rose-100 text-[#ba1a1a]' : (prod.stock <= 15 ? 'bg-yellow-100 text-[#725918]' : 'bg-emerald-100 text-emerald-800')
                        }`}>
                          {prod.stock === 0 ? 'Sold Out' : `${prod.stock} left`}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button 
                            onClick={() => handleOpenProductModal(prod)}
                            className="bg-[#efeded] text-[#444748] font-bold hover:bg-[#fed488] p-1.5 aspect-square rounded cursor-pointer flex items-center"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(prod.id)}
                            className="bg-rose-50 text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 aspect-square rounded cursor-pointer flex items-center"
                            title="Archive / Delete"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: CATEGORIES CRUD TABLE */}
        {adminView === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border bg-white border-outline-variant p-4 shadow-sm rounded-sm">
              <div>
                <h2 className="font-headline-lg text-xl font-bold">System Categories Directory</h2>
                <p className="text-xs text-on-surface-variant">Manage directories mapped directly to dynamic sidebar navigation sliders</p>
              </div>
              <button 
                onClick={() => setShowCategoryModal(true)}
                className="bg-primary hover:bg-slate-900 border border-primary text-on-primary text-xs font-bold uppercase tracking-widest px-4 py-2 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Add Class Category
              </button>
            </div>

            <div className="bg-white border border-[#c4c7c7] shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#efeded] text-[#444748] font-bold border-b border-[#c4c7c7] text-[11px] uppercase tracking-wider">
                    <th className="p-4">Category Identification ID</th>
                    <th className="p-4">Catalog display Name</th>
                    <th className="p-4">Route Slug Value</th>
                    <th className="p-4 text-center">Products Linked Count</th>
                    <th className="p-4 text-right">Crud Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c7c7]/50">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary">#CAT-002{cat.id}</td>
                      <td className="p-4 font-bold text-primary">{cat.name}</td>
                      <td className="p-4 font-mono text-on-surface-variant">/{cat.slug}</td>
                      <td className="p-4 text-center font-bold">
                        <span className="bg-[#efeded] px-2.5 py-0.5 rounded text-[11px]">{cat.product_count} articles</span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => onDeleteCategory(cat.id)}
                          className="bg-rose-50 text-[#ba1a1a] hover:bg-[#ffdad6] px-2.5 py-1 text-[11px] font-bold cursor-pointer rounded-sm"
                        >
                          Delete Group
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: PURCHASE ORDERS LIST */}
        {adminView === 'orders' && (
          <div className="space-y-4">
            <div className="border bg-white border-outline-variant p-4 shadow-sm rounded-sm">
              <h2 className="font-headline-lg text-xl font-bold">Inbound Purchase Orders Log</h2>
              <p className="text-xs text-on-surface-variant mt-1">Review active transactions, process payment alerts, or trigger secure parcel delivery shipments.</p>
            </div>

            <div className="bg-white border border-outline-variant shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#efeded] text-[#444748] font-bold border-b border-[#c4c7c7] text-[11px] uppercase tracking-wider">
                    <th className="p-4">Purchase Order ID</th>
                    <th className="p-4">Billing Customer detail</th>
                    <th className="p-4">Cart items Curated</th>
                    <th className="p-4 font-mono">Date timestamp</th>
                    <th className="p-4 text-center">Status Action</th>
                    <th className="p-4 text-right">Total Transacted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c7c7]/50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-all font-medium text-primary">
                      <td className="p-4 font-mono font-bold text-primary">{order.order_number}</td>
                      <td className="p-4">
                        <span className="font-bold text-primary block">{order.customer_name}</span>
                        <span className="text-[10px] text-on-surface-variant block">{order.customer_email}</span>
                      </td>
                      <td className="p-4 text-left max-w-[200px]">
                        <ul className="space-y-0.5 text-[11px] text-on-surface-variant font-semibold">
                          {order.items.map(it => (
                            <li key={it.id} className="truncate">• {it.product_title} (x{it.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 font-mono text-on-surface-variant font-bold">{order.date}</td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {(() => {
                            const styles = getStatusStyles(order.status);
                            return (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${styles.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
                                <span className="material-symbols-outlined text-[13px] opacity-90">{styles.icon}</span>
                                <span>{order.status}</span>
                              </span>
                            );
                          })()}
                          
                          <select 
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                            className="bg-white border border-outline-variant hover:border-secondary text-[10px] font-bold py-1 px-2 rounded outline-none focus:border-secondary text-primary transition-all shadow-sm cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-primary">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: USERS DIRECTORY */}
        {adminView === 'users' && (
          <div className="space-y-4">
            <div className="border bg-white border-outline-variant p-4 shadow-sm rounded-sm">
              <h2 className="font-headline-lg text-xl font-bold">Registered Users and Authorities</h2>
              <p className="text-xs text-on-surface-variant mt-1">Full-stack user records synchronized under database schema rules.</p>
            </div>

            <div className="bg-white border text-primary border-[#c4c7c7] shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#efeded] text-[#444748] font-bold border-b border-[#c4c7c7] text-[11px] uppercase tracking-wider">
                    <th className="p-4">Account ID</th>
                    <th className="p-4">Authorized User details</th>
                    <th className="p-4">Identified Level role</th>
                    <th className="p-4">Registered Date stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c7c7]/50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary">#USR-{1000 + user.id}</td>
                      <td className="p-4 font-bold text-primary">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[#444748]">account_circle</span>
                          <div>
                            <span className="font-bold text-primary block">{user.name}</span>
                            <span className="text-[10px] text-on-surface-variant block">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          user.role === 'admin' ? 'bg-[#93000a] text-[#ffffff]' : 'bg-[#efeded] text-on-surface-variant'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant font-semibold">{user.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Adding / Editing Modal Panel for Products CRUD */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleProductSubmit} 
            className="bg-white w-full max-w-lg p-6 rounded shadow-2xl relative space-y-4 animate-in zoom-in duration-300"
          >
            <div className="border-b pb-2 flex justify-between items-center text-primary">
              <h3 className="font-headline-lg text-lg font-bold">
                {editingProduct ? 'Curate Extant Product Details' : 'Curate Fresh Luxury Piece'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowProductModal(false)}
                className="h-7 w-7 rounded-full bg-[#efeded] flex items-center justify-center cursor-pointer text-primary"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-primary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Product Title</label>
                  <input 
                    type="text" 
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">SKU Code identifier</label>
                  <input 
                    type="text" 
                    value={prodSku} 
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Price (USD)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={prodPrice} 
                    onChange={(e) => setProdPrice(parseFloat(e.target.value))}
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Linked Category</label>
                  <select 
                    value={prodCategory} 
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Warehouse Stock Qty</label>
                  <input 
                    type="number" 
                    value={prodStock} 
                    onChange={(e) => setProdStock(parseInt(e.target.value))}
                    className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Description</label>
                <textarea 
                  value={prodDescription} 
                  onChange={(e) => setProdDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                />
              </div>

              {/* Rating Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Product Rating (1-5)</label>
                <select 
                  value={prodRating} 
                  onChange={(e) => setProdRating(parseInt(e.target.value))}
                  className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

              {/* Sizes Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map(size => (
                    <label key={size} className="flex items-center gap-1 text-[10px] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={prodSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProdSizes([...prodSizes, size]);
                          } else {
                            setProdSizes(prodSizes.filter(s => s !== size));
                          }
                        }}
                        className="w-3 h-3"
                      />
                      <span className="font-mono text-[11px]">{size}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">Selected: {prodSizes.join(', ') || 'None'}</p>
              </div>

              {/* Upload image box following guidelines style */}
              <div className="space-y-1 bg-surface-container p-4 rounded border border-dashed border-outline-variant">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Simulated Asset Upload</span>
                <div className="flex items-center gap-4">
                  <img src={prodImage} className="w-12 h-16 object-cover border" alt="Asset Preview" />
                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleSimulatedUpload}
                      className="text-xs text-on-surface-variant block cursor-pointer"
                    />
                    <p className="text-[10px] text-on-surface-variant">Drag and drop or tap to select image files. We match high fashion aesthetics automatically!</p>
                  </div>
                </div>
                {isUploadingMock && (
                  <div className="text-[11px] font-mono mt-1 text-secondary font-bold">
                    Secure uploading asset to Laravel public/storage/ products stream...
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-slate-900 border border-primary text-on-primary py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer shadow-md"
            >
              Commit Catalog changes
            </button>
          </form>
        </div>
      )}

      {/* Adding Category Modal Panel */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCategorySubmit}
            className="bg-white w-full max-w-sm p-6 rounded shadow-2xl relative space-y-4 animate-in zoom-in duration-300"
          >
            <div className="border-b pb-2 flex justify-between items-center text-primary">
              <h3 className="font-headline-lg text-lg font-bold">Add Group Class Category</h3>
              <button 
                type="button" 
                onClick={() => setShowCategoryModal(false)}
                className="h-7 w-7 rounded-full bg-[#efeded] flex items-center justify-center cursor-pointer text-primary"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-primary">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Category Display Name</label>
                <input 
                  type="text" 
                  value={catNameInput} 
                  onChange={(e) => setCatNameInput(e.target.value)}
                  placeholder="E.g. Menswear"
                  className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">URL Route Slug</label>
                <input 
                  type="text" 
                  value={catSlugInput} 
                  onChange={(e) => setCatSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="menswear"
                  className="w-full bg-[#fbf9f8] border border-outline-variant p-2 rounded outline-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-slate-900 border border-primary text-on-primary py-3 text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Commit Category Group
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
