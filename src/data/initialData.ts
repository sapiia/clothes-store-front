import { Product, Category, Order, User } from '../types';

export const initialCategories: Category[] = [
  { id: 1, name: 'Dresses', slug: 'dresses', product_count: 124 },
  { id: 2, name: 'Outerwear', slug: 'outerwear', product_count: 86 },
  { id: 3, name: 'Accessories', slug: 'accessories', product_count: 210 },
  { id: 4, name: 'Footwear', slug: 'footwear', product_count: 42 },
  { id: 5, name: 'Menswear', slug: 'menswear', product_count: 35 },
];

export const initialProducts: Product[] = [
  {
    id: 1,
    title: 'Sculptural Silk Gown',
    sku: 'LX-2024-MS01',
    category: 'Dresses',
    price: 850.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJcmR1e7zIAFjbewTq4TWHa7oZZYckmZx8L7F3Gmhm4YXmwQvD7ZN3zERCgb_mfX_Nk2EA2OScQdBt3TrPad_qhAq5n3qRS1mXvY1akzcarkYxwwRQkQLl9PU7J1JMWS0sBeutTzEavz3GrU_D5LAPg4QlhdcM-B0BDxt5oZUscACz6JRIjNozSHIX9ZFk2fkN4HEYw2XURJUipMbGSknsAp4ce_s2zKkOqYYSRx2ZKSl9_FZSloG8n0_0PPnmZGo9VOmn1VelYrNT',
    rating: 5,
    stock: 85,
    status: 'limited',
    is_limited: true,
    description: 'A high-fashion editorial photograph of a minimalist silk evening gown in charcoal black, draped elegantly on a stone pedestal. The lighting is dramatic and moody, with sharp highlights and soft shadows against a warm off-white background. The aesthetic is clean, luxurious, and highly sophisticated, embodying modern minimalism.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Charcoal', 'Off-White', 'Black'],
    reviews: [
      { id: 1, product_id: 1, user_name: 'Genevieve V.', rating: 5, comment: 'Draped like liquid water. Absolute stunner for high level galas.', created_at: '2026-04-12' },
      { id: 2, product_id: 1, user_name: 'Jessica M.', rating: 5, comment: 'Perfect fit. High end finish.', created_at: '2026-05-18' }
    ]
  },
  {
    id: 2,
    title: 'Signature Wool Blazer',
    sku: 'LX-2024-COB2',
    category: 'Outerwear',
    price: 520.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBVN4KCX3jkWVxq9TPDNB39dQfORhhTWRz934gNuw5NqnpQNZ2qGYynmgVNX09kIKeKXL5ZdCGCo-GGqydPhGhEFgehdCfVeGJMfQzPYyCOEkC9jxmaOLWa55msG-tMG8JQ3TnzlmMQJBheaf2hAHfqZEHD1O55ONZzDNC8fGoqIJRJgRzAgpkRGM0z3kW6qcahGdu9PQ2aUWOLlpLUyClgmjzh2TEChHJ0cVYx1GkvbszHLjnTlqzyJMIdaDRixmEU95QBWVca68',
    rating: 4,
    stock: 44,
    status: 'active',
    description: 'A premium close-up of a tailored wool blazer in a warm beige tone, showcasing detailed stitching and high-quality fabric texture. The shot is bright and airy, with soft natural light streaming from the side, creating an inviting luxury atmosphere.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gold', 'Olive', 'Navy'],
    reviews: [
      { id: 1, product_id: 2, user_name: 'David K.', rating: 4, comment: 'Elegant structural seamwork. A staple piece.', created_at: '2026-05-20' }
    ]
  },
  {
    id: 3,
    title: 'Aurelia Gold Stiletto',
    sku: 'LX-2024-ASw3',
    category: 'Footwear',
    price: 340.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASwpaIhV-RFzXPlKTy8Svw9Q4tWRu0m1zK6miRahf0gezWs-a86JOqiopFHka-Vw2WelZV2SdhYzQgaoM9G7v-iSr0Xs9WL87IkbNQ9C9yTKApfBrF-EkF5_Ae1eYlbpeElxFJ1--hOZD5iFkXRx-xEUE1koW9wOpfej1p7oDyz3xoO3yyWuyUKuTk_rc7ep3ils4DSdVJHdSdu08rX51oi0qRcP2vbrSuBfx787U_6EBdkCnmqXjFNigdknefu960MGninHK5sFol',
    rating: 5,
    stock: 28,
    status: 'active',
    is_new: true,
    description: 'A luxurious pair of gold-toned strappy sandals displayed on a minimalist marble plinth. The image is captured with professional studio lighting, emphasizing the metallic sheen and fine craftsmanship.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Gold'],
    reviews: [
      { id: 1, product_id: 3, user_name: 'Clarissa P.', rating: 5, comment: 'Extremely comfortable despite the heel height. Beautiful luster!', created_at: '2026-06-02' }
    ]
  },
  {
    id: 4,
    title: 'Minimalist Crossbody',
    sku: 'LX-2024-MC04',
    category: 'Accessories',
    price: 295.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfGnETFnhlR8Cc3kxz3WSSwO_zOFC5k8JTajPcpw5cyOOB_yw9_-Dd9wSiScP_yVbcP_Ix_CTomgUi8NMXwNZyzxTvL44Oca1_Ev2nmOeMhI1QmKcCq34LVeKNRIn7gVF1AwhfOGDLgffMIJPlXJR0tj3xBMPgtRKgYxCq-8YSbfnubwcezOtWSAhFvi0Zol1eR8tx9LjuRJ9EImL73JhZvwp1YJUHk3rQsUcsoYnbzcChqWgyhWYSUAXBXM6HvX8MewUeMaPje2-U',
    rating: 4,
    stock: 56,
    status: 'active',
    description: 'A minimalist leather crossbody bag in a deep forest green, positioned artistically in a high-key studio environment. The light is soft and diffused, highlighting the supple grain of the leather. The composition is clean and focused, reflecting a premium e-commerce aesthetic.',
    sizes: ['One Size'],
    colors: ['Olive', 'Navy', 'Charcoal'],
    reviews: [
      { id: 1, product_id: 4, user_name: 'Sophia R.', rating: 4, comment: 'Perfect daily compact companion. Great leather scent.', created_at: '2026-06-11' }
    ]
  },
  {
    id: 5,
    title: 'Linen Trench Coat',
    sku: 'LX-2024-LTC5',
    category: 'Outerwear',
    price: 460.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMNgwkvMzYlOfuVe8BNsU-1McvWdJhWVyoRHS0PRnbU5lzIW6Xr36f9sdDzmemg2GN2Xlr-kY_l35J__4xc0TyGnsdKJ_NrO8NEMPoNroRKPbWVLD9ouASkF9_HGx5bfamAEUl1xdNFdMs_SGDAqhXl28AMiRmORwNN1AScOwPVQErd6_ijMGXj1wq652EnHLemdloln4p-iR4cRjvFkvJwe-iZE6lsJhPt5iBNEafWawfJKTzH9gMMK15VPhEgcGRr-GUKk0sPgLQ',
    rating: 5,
    stock: 15,
    status: 'active',
    description: 'A high-resolution shot of a lightweight linen trench coat in a soft oatmeal color, blowing slightly in a simulated breeze. The setting is a minimalist architectural space with clean concrete lines and warm lighting.',
    sizes: ['S', 'M', 'L'],
    colors: ['Off-White', 'Olive'],
    reviews: []
  },
  {
    id: 6,
    title: 'Pearl Drop Necklace',
    sku: 'LX-2024-PDN6',
    category: 'Accessories',
    price: 185.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP5PfiM2eWXhUynv7jWLLC-qCT_GrxLrqKW9fNbQ-BZi0_CIWCNE5qix5PVDkp7mMAdA5E4-iZmiJSCUM-4pB17ihLpbG4f5WeUhoAzbZPN1L9Seunr4yoI3a-4PglSdmV0GTPRUh3cG3z8NQa9Gf-zXEgfbzLkdGh-l8pgk2ZWh4oDICYsDTe6an2-u2vR4P5BOSJsN4-WnUMAyk8fiykEqcqc5EIAylS2WY-XHKCAbNpWfhcPm_Yq1zElrW07oi3nBQHo55pq-eI',
    rating: 4,
    stock: 12,
    status: 'limited',
    description: 'A close-up of a delicate gold chain necklace with a small pearl pendant, resting on a velvet tray. The image uses a shallow depth of field to focus on the intricate details of the jewelry.',
    sizes: ['One Size'],
    colors: ['Gold'],
    reviews: []
  },
  {
    id: 7,
    title: 'Oversized Sweater',
    sku: 'LX-2024-OS07',
    category: 'Dresses',
    price: 49.99,
    rating: 5,
    stock: 105,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_s8x3_EZeZXoGcIdNPiXIln5s94wA8kV94fBzfR0bwg9rF0Aa7MlbfmJqRJ7It5YOU9aOXCtVx4pRnvhyQuxzHF8bfsxUV25AEJE6rbj0Zb8ZXbKwnN0aOTV-KaZwJi2uzl6Z7Xuf_eJ9ATh8pfAFUtqEg9dhBM7K93_Mo_VUM8CLmQl7jRu0dw18UFJx4tAcXdmJazufp2zUagNgK9E8wxi7PUn_aFSEy-ahgGklFe1zgS4zZumcJKlV5c-DA92gkFsVgigq6TsO',
    description: 'High-quality close up of an oversized ivory knit sweater, soft textures visible, minimalist lighting, premium fashion product shot.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Off-White'],
    reviews: [
      { id: 1, product_id: 7, user_name: 'Jessica M.', rating: 5, comment: 'Amazingly soft material and gorgeous slouchy silhouette!', created_at: '2026-06-14' }
    ]
  },
  {
    id: 8,
    title: 'Classic Sneakers',
    sku: 'LX-2024-CS08',
    category: 'Footwear',
    price: 69.99,
    rating: 5,
    stock: 72,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBwFaG60n9cm-ppHf74NZOfReOTzT2EeF5VNHMypkrtIeg8AhwLfJnILtZPJ2T01o2TkAVv1IZqy-Hf3cf6Kz4fPsgQxyt_reG0UkMQfhMBMlFDik67h5VO9GAFNCfBqbrDIvsmeK8DbJLj7brBx4p3WvPNZe_I-TaTfDXfcpWc8UoN1wJwcWVD0boLANkotY5fnrygw1huo7YclvOLxfHlWrLVTC51xGufQzpjoU2lOuk3aZ9a56Fu66y1T3KTxhDYvkyjgcBLS2o',
    description: 'Pristine white leather sneakers, clean lines, high-end design, studio lighting with soft shadows, minimalist aesthetic product photography.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Off-White'],
    reviews: []
  },
  {
    id: 9,
    title: 'Luxury Handbag',
    sku: 'LX-2024-LH09',
    category: 'Accessories',
    price: 89.99,
    rating: 5,
    stock: 43,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDFRyp36hV40eaq8CyzKk79mK4uD79oksxaL3WVc9b5TAgPzr2WvFhIzKGtLOzvWoUOGOHKgfoCkr_MEL7s6UTO66uA1QdS7NDPRoNnFUhdtrZtxT0PAlq3JmnHnn9vL_ucWfFt30k9g265rYWXy8eqB4u7KFoHfa63ms-gLkjuGRNu-BSfOvzdsfIrZ3ILL3qsTT36VFwcN9x40zOyaULlvMFExPbup4aHbxbMbgtZvLk-yinJqzxvU_nX31pvvGNWvnYG53j2Ql',
    description: 'A structured tan leather luxury handbag, gold hardware details, high-end designer look, crisp studio lighting, neutral background.',
    sizes: ['One Size'],
    colors: ['Gold', 'Black'],
    reviews: [
      { id: 1, product_id: 9, user_name: 'Sophia R.', rating: 5, comment: 'I have received so many compliments! Excellent grade leather.', created_at: '2026-06-15' }
    ]
  },
  {
    id: 10,
    title: 'Smart Watch Pro',
    sku: 'LX-2024-SM10',
    category: 'Accessories',
    price: 129.99,
    rating: 4,
    stock: 12,
    status: 'limited',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI25i3_IT57ymLmR7r_QFVnRZMS3zcWniLyTmbX_5xE0GaWpY7H8vieEfzNVVLnbrHvHr5LA_UDjf-s1FM2vwwQqpz5La5ggwFm1_PNn1HHuq8rU_djrN9mvZ-siM9gER1PlZzz_Mlfvg3qzZLCFD1MbaJTp0MdBdMpUKuC1dsgJ3jv56E2IP0RtY1ceXbd1Fi1E2jwBp_-OK8I5MmXYDGnfV75aGS7-PHM7ovqvhagMAvMj034i0TjUZMJ8SDTBKf9_p7O5r-SkB-',
    description: 'Sleek black smart watch with a minimalist digital face, soft matte band, modern technology product shot, premium quality feel.',
    sizes: ['One Size'],
    colors: ['Charcoal'],
    reviews: []
  },
  {
    id: 11,
    title: 'UV Protection Shades',
    sku: 'LX-2024-UV11',
    category: 'Accessories',
    price: 29.99,
    rating: 5,
    stock: 91,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSS76svnGgny3fXpmcqEgaWtJAcX6hN5tA90bNL6EavakmM_J4Yj9iToVLA9hpclk855ZDD-UAbbLD_bLwURZJdoPi4ViabQ7FVWhIM8CHZCawWprJCPUpUYzgC_ZDS0KeDtA4CnNqqK3Ii5-L7D93TpxopyZQ7YqL3hOHoy-sl47XlSjEV3Jrn5f1hM2CR7qq_UzUmpVHAKZyT4wai1CHmI4ZUpiTILQQ5nHsVYqjjjFOAvAcXG-Q83DpQ9_NFUzC1oM-dueMH6k',
    description: 'Classic tortoise shell sunglasses, high-end designer brand aesthetic, elegant proportions, studio lighting on a neutral white background.',
    sizes: ['One Size'],
    colors: ['Gold', 'Black'],
    reviews: []
  },
  {
    id: 12,
    title: 'Denim Jacket',
    sku: 'LX-2024-DJ12',
    category: 'Outerwear',
    price: 59.99,
    rating: 5,
    stock: 31,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYBlRny4eisr37zVmkT9xhe8vyc4DeEkiCku0c3JWd0i3cC_03RaspkGi91GVLFc4oqFot2vkic02TW5yaB_F7QZxjM-DemM3uSxQxRHBAT73LLthO1leZhYyBikWAiEoGlcWd6V-M2CGON5ZPtd1MAUfzeYYrj4AjsacemI2elX3R88XeWV8Eym3vKUt_yo3lzfqVnMnDsXhVF_I2MNj20oZU2_wl7sW3WaJxvWBHVB7xYU-MoOyxzjPkm2M8zU2ydKnWE822p4qE',
    description: 'Model wearing a perfectly tailored denim jacket, classic indigo wash, premium stitching, lifestyle shot in a modern urban environment with soft bokeh.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Off-White', 'Navy'],
    reviews: [
      { id: 1, product_id: 12, user_name: 'David K.', rating: 5, comment: 'The fit was absolutely perfect. Highly recommended.', created_at: '2026-06-17' }
    ]
  },
  {
    id: 13,
    title: 'Tailored Wool Trousers',
    sku: 'LX-2024-MW09',
    category: 'Menswear',
    price: 650.00,
    rating: 4.5,
    stock: 0,
    status: 'archive',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAieAAguC5sUp1iuecZ6w5vGY5J1XscrmNb-Ek-rgB_5VJWGR1XyAcMr8kLJ8OhMhZ54uOLZreYpZ6a8abbS43oZRS0oFhdb0QjWRqgKFJTp1zczlUJwcQfmfOsM1z1ATeJx1AF8k4o_7DBHL9GXGNJaNtkbZFoNd3gSKFcz7cKoEW-F_bjwSCrSnCtoWw__H83SoBQB9_I5QpF0A4ToZvGGWGWXNSAY0A0eYyfyamofvEOkWpWod3guQEU7214EXVpoDGBb3fubusu',
    description: 'Premium fashion photography of tailored charcoal wool trousers draped elegantly. The shot focuses on the craftsmanship and weave of the luxury fabric. Lighting is soft and diffused from the side, creating a gradient of light that suggests depth and quality. Set in a modern, high-end showroom atmosphere with deep shadows and clean lines.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Black'],
    reviews: []
  }
];

export const initialOrders: Order[] = [
  {
    id: 1,
    order_number: 'LX-90124',
    customer_name: 'Eleanor Whispering',
    customer_email: 'eleanor@example.com',
    date: 'Oct 24, 2024',
    status: 'Delivered',
    items: [
      { id: 1, product_id: 1, product_title: 'Sculptural Silk Gown', price: 850.00, quantity: 1, size: 'S', color: 'Black' },
      { id: 2, product_id: 3, product_title: 'Aurelia Gold Stiletto', price: 340.00, quantity: 1, size: 'S', color: 'Gold' }
    ],
    total: 1240.00
  },
  {
    id: 2,
    order_number: 'LX-90125',
    customer_name: 'Marcus Kensington',
    customer_email: 'marcus@example.com',
    date: 'Oct 24, 2024',
    status: 'Processing',
    items: [
      { id: 3, product_id: 5, product_title: 'Linen Trench Coat', price: 460.00, quantity: 1, size: 'M', color: 'Off-White' }
    ],
    total: 450.50
  },
  {
    id: 3,
    order_number: 'LX-90126',
    customer_name: 'Sophia Castellane',
    customer_email: 'sophia@example.com',
    date: 'Oct 23, 2024',
    status: 'Shipped',
    items: [
      { id: 4, product_id: 2, product_title: 'Signature Wool Blazer', price: 520.00, quantity: 1, size: 'M', color: 'Gold' },
      { id: 5, product_id: 3, product_title: 'Aurelia Gold Stiletto', price: 340.00, quantity: 1, size: 'M', color: 'Gold' }
    ],
    total: 890.00
  },
  {
    id: 4,
    order_number: 'LX-90127',
    customer_name: 'Julian Vance',
    customer_email: 'julian@example.com',
    date: 'Oct 23, 2024',
    status: 'Pending',
    items: [
      { id: 6, product_id: 1, product_title: 'Sculptural Silk Gown', price: 850.00, quantity: 2, size: 'M', color: 'Black' },
      { id: 7, product_id: 4, product_title: 'Minimalist Crossbody', price: 295.00, quantity: 1, size: 'One Size', color: 'Olive' }
    ],
    total: 2100.00
  },
  {
    id: 5,
    order_number: 'LX-90128',
    customer_name: 'Lydia Rutherford',
    customer_email: 'lydia@example.com',
    date: 'Oct 22, 2024',
    status: 'Delivered',
    items: [
      { id: 8, product_id: 12, product_title: 'Denim Jacket', price: 59.99, quantity: 1, size: 'S', color: 'Navy' }
    ],
    total: 115.00
  }
];

export const initialUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@luxe.com', role: 'admin', created_at: '2024-01-01' },
  { id: 2, name: 'Jessica M.', email: 'jessica@example.com', role: 'customer', created_at: '2024-02-15' },
  { id: 3, name: 'David K.', email: 'david@example.com', role: 'customer', created_at: '2024-03-24' },
  { id: 4, name: 'Sophia R.', email: 'sophia@example.com', role: 'customer', created_at: '2024-04-10' },
  { id: 5, name: 'Eleanor Whispering', email: 'eleanor@example.com', role: 'customer', created_at: '2024-05-02' }
];
