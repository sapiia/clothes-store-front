import React, { useState } from 'react';
import { Product, Category, Order, User } from '../types';

interface ApiPlaygroundProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  currentUser: User | null;
  authToken: string | null;
  onSimulateLogin: (user: User, token: string) => void;
  onSimulateRegister: (user: User, token: string) => void;
}

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Public' | 'Auth' | 'Wishlist' | 'Cart' | 'Checkout & Orders' | 'Reviews';
  description: string;
  requiresAuth: boolean;
  defaultPayload?: string;
}

const ENDPOINTS: Endpoint[] = [
  { id: 'get-categories', method: 'GET', path: '/categories', category: 'Public', description: 'Retrieve all category objects and product counts.', requiresAuth: false },
  { id: 'get-products', method: 'GET', path: '/products', category: 'Public', description: 'Retrieve all products (with optional ?category= filter).', requiresAuth: false },
  { id: 'get-product-by-id', method: 'GET', path: '/products/1', category: 'Public', description: 'Retrieve high-definition single product details by catalog ID.', requiresAuth: false },
  { id: 'search-products', method: 'GET', path: '/products/search/silk', category: 'Public', description: 'Search title and descriptions for matching keywords.', requiresAuth: false },
  { id: 'register', method: 'POST', path: '/register', category: 'Auth', description: 'Create a new customer account and respond with a Sanctum Bearer Token.', requiresAuth: false, defaultPayload: '{\n  "name": "Jane Miller",\n  "email": "jane@luxe.com",\n  "password": "secretpassword",\n  "password_confirmation": "secretpassword"\n}' },
  { id: 'login', method: 'POST', path: '/login', category: 'Auth', description: 'Validate user credentials and generate a fresh plainTextToken.', requiresAuth: false, defaultPayload: '{\n  "email": "jessica@example.com",\n  "password": "password"\n}' },
  { id: 'get-profile', method: 'GET', path: '/profile', category: 'Auth', description: 'Get the currently authenticated user profile.', requiresAuth: true },
  { id: 'update-profile', method: 'PUT', path: '/profile/update', category: 'Auth', description: 'Update the user details (name/email) dynamically.', requiresAuth: true, defaultPayload: '{\n  "name": "Jessica Miller",\n  "email": "jessica@example.com"\n}' },
  { id: 'get-wishlist', method: 'GET', path: '/wishlist', category: 'Wishlist', description: 'Fetch all products currently flagged on your account wishlist.', requiresAuth: true },
  { id: 'toggle-wishlist', method: 'POST', path: '/wishlist/1', category: 'Wishlist', description: 'Toggle a product in/out of customer wishlist.', requiresAuth: true },
  { id: 'get-cart', method: 'GET', path: '/cart', category: 'Cart', description: 'Retrieve active shopping cart items.', requiresAuth: true },
  { id: 'submit-checkout', method: 'POST', path: '/checkout', category: 'Checkout & Orders', description: 'Check out active shopping cart items and record a fresh order under the active profile.', requiresAuth: true },
  { id: 'get-orders', method: 'GET', path: '/orders', category: 'Checkout & Orders', description: 'Fetch chronological order history belonging to the authenticated session.', requiresAuth: true },
  { id: 'submit-review', method: 'POST', path: '/products/1/reviews', category: 'Reviews', description: 'Publish a review description and rating for a specific ID.', requiresAuth: true, defaultPayload: '{\n  "rating": 5,\n  "comment": "Exquisitely tailored, the weight of the silk is amazing!"\n}' }
];

export default function ApiPlayground({
  products,
  categories,
  orders,
  currentUser,
  authToken,
  onSimulateLogin,
  onSimulateRegister
}: ApiPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'Public' | 'Auth' | 'Wishlist' | 'Cart' | 'Orders' | 'Reviews'>('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [payloadCode, setPayloadCode] = useState<string>(ENDPOINTS[0].defaultPayload || '');
  const [apiResponse, setApiResponse] = useState<string>('// Select an endpoint and click "Send Request" to execute dynamic Sanctum API call.');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  const selectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setPayloadCode(ep.defaultPayload || '');
    setApiResponse('// Press "Send Request" to perform local Axios call.');
    setResponseStatus(null);
  };

  const handleSendRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      try {
        // Authenticity checks
        if (selectedEndpoint.requiresAuth && !authToken) {
          setResponseStatus(401);
          setApiResponse(JSON.stringify({
            message: 'Unauthenticated.',
            error: 'Laravel Sanctum: Authorization Bearer Token is missing or invalid.'
          }, null, 2));
          return;
        }

        let result: any = null;
        setResponseStatus(200);

        switch (selectedEndpoint.id) {
          case 'get-categories':
            result = categories;
            break;
          case 'get-products':
            result = products.filter(p => p.status === 'active' || p.status === 'limited');
            break;
          case 'get-product-by-id':
            result = products[0];
            break;
          case 'search-products':
            result = products.filter(p => 
              p.title.toLowerCase().includes('silk') || 
              p.description.toLowerCase().includes('silk')
            );
            break;
          case 'register':
            const regData = JSON.parse(payloadCode);
            if (!regData.name || !regData.email || !regData.password) {
              setResponseStatus(422);
              result = {
                message: 'The given data was invalid.',
                errors: {
                  name: regData.name ? undefined : ['The name field is required.'],
                  email: regData.email ? undefined : ['The email field is required.'],
                  password: regData.password ? undefined : ['The password field is required.']
                }
              };
            } else {
              setResponseStatus(201);
              const fakeToken = '7|qv98SOnMsnSgHjS8vns9Sn9AnSns87Nks98Onmka91';
              const newUser: User = {
                id: Math.floor(Math.random() * 1000) + 10,
                name: regData.name,
                email: regData.email,
                role: 'customer',
                created_at: new Date().toISOString().split('T')[0]
              };
              onSimulateRegister(newUser, fakeToken);
              result = {
                message: 'Registration successful',
                access_token: fakeToken,
                token_type: 'Bearer',
                user: newUser
              };
            }
            break;
          case 'login':
            const logData = JSON.parse(payloadCode);
            if (logData.email === 'admin@luxe.com') {
              const adminUser: User = { id: 1, name: 'Admin User', email: 'admin@luxe.com', role: 'admin', created_at: '2024-01-01' };
              const fakeToken = '1|admin_sanctum_key_token_9823s1';
              onSimulateLogin(adminUser, fakeToken);
              result = {
                message: 'Login successful',
                access_token: fakeToken,
                token_type: 'Bearer',
                user: adminUser
              };
            } else {
              const matchedEmail = logData.email || 'jessica@example.com';
              const customerUser: User = {
                id: 2,
                name: matchedEmail.split('@')[0].toUpperCase(),
                email: matchedEmail,
                role: 'customer',
                created_at: '2024-02-15'
              };
              const fakeToken = '3|luxe_customer_sanctum_token_88712a';
              onSimulateLogin(customerUser, fakeToken);
              result = {
                message: 'Login successful',
                access_token: fakeToken,
                token_type: 'Bearer',
                user: customerUser
              };
            }
            break;
          case 'get-profile':
            result = currentUser || { id: 2, name: 'Jessica M.', email: 'jessica@example.com', role: 'customer', created_at: '2024-02-15' };
            break;
          case 'update-profile':
            const upData = JSON.parse(payloadCode);
            result = {
              message: 'Profile updated successfully',
              user: {
                id: currentUser?.id || 2,
                name: upData.name || 'Jessica Miller',
                email: upData.email || 'jessica@example.com',
                role: currentUser?.role || 'customer',
                created_at: currentUser?.created_at || '2024-02-15'
              }
            };
            break;
          case 'get-wishlist':
            result = [products[0], products[2]];
            break;
          case 'toggle-wishlist':
            result = {
              message: 'Wishlist status updated',
              attached: [1],
              detached: []
            };
            break;
          case 'get-cart':
            result = [
              { id: 1, product: products[0], quantity: 1, size: 'S', color: 'Black' },
              { id: 2, product: products[2], quantity: 1, size: 'S', color: 'Gold' }
            ];
            break;
          case 'submit-checkout':
            setResponseStatus(201);
            result = {
              message: 'Order recorded with absolute perfection!',
              order_id: Math.floor(Math.random() * 8000) + 90000,
              order_number: 'LX-90129',
              total: 1190.00,
              status: 'Pending'
            };
            break;
          case 'get-orders':
            result = orders.filter(o => o.customer_email === currentUser?.email);
            if (result.length === 0) result = [orders[0]];
            break;
          case 'submit-review':
            setResponseStatus(201);
            const reviewData = JSON.parse(payloadCode);
            result = {
              message: 'Review saved in Laravel database under product ID #1.',
              review: {
                id: 15,
                product_id: 1,
                user_name: currentUser?.name || 'Anonymous Guest',
                rating: reviewData.rating || 5,
                comment: reviewData.comment || 'Perfect fit!',
                created_at: '2026-06-19'
              }
            };
            break;
          default:
            result = { status: 'success' };
        }

        setApiResponse(JSON.stringify(result, null, 2));
      } catch (err: any) {
        setResponseStatus(400);
        setApiResponse(JSON.stringify({
          error: 'Bad Request',
          message: 'Failed to process JSON payload. Ensure validity.',
          details: err.message
        }, null, 2));
      }
    }, 400);
  };

  const filteredEndpoints = ENDPOINTS.filter(ep => {
    if (activeTab === 'all') return true;
    if (activeTab === 'Orders' && ep.category === 'Checkout & Orders') return true;
    return ep.category === activeTab;
  });

  return (
    <div className="bg-white border border-outline-variant p-6 rounded-lg space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 border-outline-variant gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">terminal</span> Laravel Sanctum Sandbox Portal
          </h2>
          <p className="text-on-surface-variant font-body-md text-sm mt-1">
            Test real-time Laravel schema request-responses. Powered by simulated Sanctum session token injectors.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-[#f4ebd0] text-secondary border border-[#ffdea5] px-3 py-1.5 rounded">
          <span className="font-bold">Sanctum Token:</span>
          <span className="font-semibold truncate max-w-[120px]" title={authToken || 'No session Active'}>
            {authToken ? authToken : '[Guest Session Locked]'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-wrap gap-1.5 border-b border-outline-variant pb-2">
            {(['all', 'Public', 'Auth', 'Wishlist', 'Cart', 'Orders', 'Reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-xs rounded transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-primary text-on-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {tab === 'all' ? 'All APIs' : tab}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {filteredEndpoints.map(ep => (
              <div
                key={ep.id}
                onClick={() => selectEndpoint(ep)}
                className={`p-3 rounded border text-left cursor-pointer transition-all ${
                  selectedEndpoint.id === ep.id
                    ? 'border-secondary bg-[#FDF9F0] ring-1 ring-secondary'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                    ep.method === 'GET' ? 'bg-indigo-600' :
                    ep.method === 'POST' ? 'bg-emerald-600' :
                    ep.method === 'PUT' ? 'bg-amber-600' : 'bg-rose-600'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-primary">{ep.path}</span>
                  {ep.requiresAuth && (
                    <span className="material-symbols-outlined text-[14px] text-amber-600 ml-auto" title="Sanctum Secure Request">
                      lock
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1.5 leading-tight">{ep.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Console Play Column */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary uppercase tracking-wide">Request Parameters</span>
            <button
              onClick={handleSendRequest}
              disabled={isSending}
              className="bg-secondary hover:bg-opacity-90 disabled:bg-opacity-50 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 cursor-pointer rounded-sm shadow-sm"
            >
              {isSending ? (
                <>Simulating Network Request...</>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span> Send request
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Headers & Payload Entry */}
            <div className="space-y-3">
              <div className="p-3 bg-surface-container rounded border border-outline-variant">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Request Headers</span>
                <div className="font-mono text-[10.5px] space-y-1 text-on-surface">
                  <div>Accept: <span className="text-indigo-600">application/json</span></div>
                  <div>Content-Type: <span className="text-indigo-600">application/json</span></div>
                  {authToken && (
                    <div className="truncate">Authorization: <span className="text-amber-700">Bearer {authToken.substring(0, 15)}...</span></div>
                  )}
                </div>
              </div>

              {selectedEndpoint.defaultPayload !== undefined && (
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">JSON Payload Body</span>
                  <textarea
                    value={payloadCode}
                    onChange={(e) => setPayloadCode(e.target.value)}
                    className="w-full flex-1 min-h-[120px] font-mono text-xs p-3 bg-slate-900 text-slate-100 rounded border border-slate-700 focus:border-secondary outline-none select-all"
                    placeholder="{}"
                  />
                </div>
              )}
            </div>

            {/* Response Area */}
            <div className="flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Laravel Response Logs</span>
                {responseStatus && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                    responseStatus < 300 ? 'bg-emerald-600' :
                    responseStatus === 401 ? 'bg-amber-600' : 'bg-rose-600'
                  }`}>
                    Status: {responseStatus}
                  </span>
                )}
              </div>
              <div className="flex-1 bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 rounded border border-slate-800 h-full overflow-auto max-h-[250px] custom-scrollbar whitespace-pre">
                {apiResponse}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
