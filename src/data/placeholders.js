// Demo content shown only when Supabase is unreachable (e.g. running the
// frontend before VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are configured).
// Once Supabase is live, every page fetches real data through
// src/services/api.js and this file is never used. The three seeded reviews
// mirror supabase/seed.sql (the business asked for a handful of real starter
// testimonials rather than an empty state) — anything a visitor submits
// afterwards goes through the normal PENDING → admin-approval flow, same as
// these did originally. Photography throughout is real United Vich client
// work supplied by the business (public/images/gallery) — no stock images.

export const PLACEHOLDER_CATEGORIES = [
  { slug: 'braids', name: 'Braids' },
  { slug: 'wigs', name: 'Wigs' },
  { slug: 'natural-hair', name: 'Natural Hair' },
  { slug: 'weaves', name: 'Weaves' },
  { slug: 'locs', name: 'Locs' },
  { slug: 'styling', name: 'Styling' },
]

export const PLACEHOLDER_SERVICES = [
  {
    id: 1,
    slug: 'knotless-braids',
    name: 'Knotless Braids',
    category: 'Braids',
    description: 'A gentler take on classic braids, finished with a soft, natural-looking parting.',
    price_from: 80,
    duration_minutes: 240,
    image: '/images/gallery/braids-13.jpg',
    hoverImage: '/images/gallery/braids-14.jpg',
    featured: true,
  },
  {
    id: 2,
    slug: 'box-braids',
    name: 'Box Braids',
    category: 'Braids',
    description: 'Timeless, versatile braids sectioned into neat squares from root to tip.',
    price_from: 90,
    duration_minutes: 270,
    image: '/images/gallery/braids-3.jpg',
    hoverImage: '/images/gallery/braids-2.jpg',
  },
  {
    id: 3,
    slug: 'cornrows',
    name: 'Cornrows',
    category: 'Braids',
    description: 'Sleek braids woven close to the scalp in clean, elegant rows.',
    price_from: 45,
    duration_minutes: 90,
    image: '/images/gallery/cornrows-4.jpg',
    hoverImage: '/images/gallery/cornrows-1.jpg',
  },
  {
    id: 4,
    slug: 'wig-installation',
    name: 'Wig Installation',
    category: 'Wigs',
    description: 'A precise, secure install finished to sit naturally along your hairline.',
    price_from: 60,
    duration_minutes: 120,
    image: '/images/gallery/braids-15.jpg',
    hoverImage: '/images/gallery/braids-1.jpg',
    featured: true,
  },
  {
    id: 5,
    slug: 'wig-styling',
    name: 'Wig Styling',
    category: 'Wigs',
    description: 'Custom cutting, colouring and styling to make your wig look effortlessly yours.',
    price_from: 40,
    duration_minutes: 90,
    image: '/images/gallery/braids-7.jpg',
    hoverImage: '/images/gallery/braids-4.jpg',
  },
  {
    id: 6,
    slug: 'natural-hair-treatment',
    name: 'Natural Hair Treatment',
    category: 'Natural Hair',
    description: 'Deep conditioning and scalp care designed to nourish and strengthen natural hair.',
    price_from: 55,
    duration_minutes: 90,
    image: '/images/gallery/locs-5.jpg',
    hoverImage: '/images/gallery/locs-1.jpg',
    featured: true,
  },
  {
    id: 7,
    slug: 'silk-press',
    name: 'Silk Press',
    category: 'Styling',
    description: 'A smooth, healthy press that shows off the true length and shine of your hair.',
    price_from: 50,
    duration_minutes: 75,
    image: '/images/gallery/braids-9.jpg',
    hoverImage: '/images/gallery/braids-6.jpg',
  },
  {
    id: 8,
    slug: 'weave-installation',
    name: 'Weave Installation',
    category: 'Weaves',
    description: 'Expertly blended weave application for fullness, length and natural movement.',
    price_from: 85,
    duration_minutes: 180,
    image: '/images/gallery/cornrows-2.jpg',
    hoverImage: '/images/gallery/cornrows-3.jpg',
  },
]

// One gallery entry per real client photo supplied by the business (29
// total: 15 braids, 8 cornrows, 6 locs). Hover image cycles to the next
// photo within the same style so every card has a genuine second angle.
export const PLACEHOLDER_GALLERY = [
  { id: 1, slug: 'long-single-braids', title: 'Long Braids', category: 'Braids', image: '/images/gallery/braids-1.jpg', hoverImage: '/images/gallery/braids-2.jpg', likes: 142 },
  { id: 2, slug: 'waist-length-box-braids', title: 'Waist-Length Box Braids', category: 'Braids', image: '/images/gallery/braids-2.jpg', hoverImage: '/images/gallery/braids-3.jpg', likes: 187 },
  { id: 3, slug: 'bundled-box-braids', title: 'Bundled Box Braids', category: 'Braids', image: '/images/gallery/braids-3.jpg', hoverImage: '/images/gallery/braids-4.jpg', likes: 96 },
  { id: 4, slug: 'braids-blue-tone', title: 'Braids with Blue Tone', category: 'Braids', image: '/images/gallery/braids-4.jpg', hoverImage: '/images/gallery/braids-5.jpg', likes: 121 },
  { id: 5, slug: 'box-braid-ponytail', title: 'Box Braid Ponytail', category: 'Braids', image: '/images/gallery/braids-5.jpg', hoverImage: '/images/gallery/braids-6.jpg', likes: 133 },
  { id: 6, slug: 'braids-honey-highlights', title: 'Braids with Honey Highlights', category: 'Braids', image: '/images/gallery/braids-6.jpg', hoverImage: '/images/gallery/braids-7.jpg', likes: 204 },
  { id: 7, slug: 'classic-box-braids', title: 'Classic Box Braids', category: 'Braids', image: '/images/gallery/braids-7.jpg', hoverImage: '/images/gallery/braids-8.jpg', likes: 158 },
  { id: 8, slug: 'box-braids-burgundy', title: 'Box Braids in Burgundy', category: 'Braids', image: '/images/gallery/braids-8.jpg', hoverImage: '/images/gallery/braids-9.jpg', likes: 176 },
  { id: 9, slug: 'neat-braid-parting', title: 'Neat Braid Parting', category: 'Braids', image: '/images/gallery/braids-9.jpg', hoverImage: '/images/gallery/braids-10.jpg', likes: 89 },
  { id: 10, slug: 'box-braids-front-view', title: 'Box Braids, Front View', category: 'Braids', image: '/images/gallery/braids-10.jpg', hoverImage: '/images/gallery/braids-11.jpg', likes: 165 },
  { id: 11, slug: 'fine-box-braids', title: 'Fine Box Braids', category: 'Braids', image: '/images/gallery/braids-11.jpg', hoverImage: '/images/gallery/braids-12.jpg', likes: 112 },
  { id: 12, slug: 'bantu-knot-out', title: 'Bantu Knot-Out', category: 'Braids', image: '/images/gallery/braids-12.jpg', hoverImage: '/images/gallery/braids-13.jpg', likes: 198 },
  { id: 13, slug: 'waist-length-micro-braids', title: 'Waist-Length Micro Braids', category: 'Braids', image: '/images/gallery/braids-13.jpg', hoverImage: '/images/gallery/braids-14.jpg', likes: 231 },
  { id: 14, slug: 'extra-long-box-braids', title: 'Extra-Long Box Braids', category: 'Braids', image: '/images/gallery/braids-14.jpg', hoverImage: '/images/gallery/braids-15.jpg', likes: 219 },
  { id: 15, slug: 'full-length-box-braids', title: 'Full-Length Box Braids', category: 'Braids', image: '/images/gallery/braids-15.jpg', hoverImage: '/images/gallery/braids-1.jpg', likes: 154 },
  { id: 16, slug: 'cornrow-detail', title: 'Cornrow Detail', category: 'Braids', image: '/images/gallery/cornrows-1.jpg', hoverImage: '/images/gallery/cornrows-2.jpg', likes: 101 },
  { id: 17, slug: 'cornrows-into-ponytail', title: 'Cornrows into Ponytail', category: 'Braids', image: '/images/gallery/cornrows-2.jpg', hoverImage: '/images/gallery/cornrows-3.jpg', likes: 143 },
  { id: 18, slug: 'cornrow-ponytail', title: 'Cornrow Ponytail', category: 'Braids', image: '/images/gallery/cornrows-3.jpg', hoverImage: '/images/gallery/cornrows-4.jpg', likes: 127 },
  { id: 19, slug: 'sleek-cornrows', title: 'Sleek Cornrows', category: 'Braids', image: '/images/gallery/cornrows-4.jpg', hoverImage: '/images/gallery/cornrows-5.jpg', likes: 172 },
  { id: 20, slug: 'fresh-cornrows', title: 'Fresh Cornrows', category: 'Braids', image: '/images/gallery/cornrows-5.jpg', hoverImage: '/images/gallery/cornrows-6.jpg', likes: 94 },
  { id: 21, slug: 'clean-cornrow-parting', title: 'Clean Cornrow Parting', category: 'Braids', image: '/images/gallery/cornrows-6.jpg', hoverImage: '/images/gallery/cornrows-7.jpg', likes: 118 },
  { id: 22, slug: 'cornrows-side-profile', title: 'Cornrows, Side Profile', category: 'Braids', image: '/images/gallery/cornrows-7.jpg', hoverImage: '/images/gallery/cornrows-8.jpg', likes: 87 },
  { id: 23, slug: 'precision-cornrows', title: 'Precision Cornrows', category: 'Braids', image: '/images/gallery/cornrows-8.jpg', hoverImage: '/images/gallery/cornrows-1.jpg', likes: 136 },
  { id: 24, slug: 'loc-updo', title: 'Loc Updo', category: 'Locs', image: '/images/gallery/locs-1.jpg', hoverImage: '/images/gallery/locs-2.jpg', likes: 149 },
  { id: 25, slug: 'twisted-loc-bun', title: 'Twisted Loc Bun', category: 'Locs', image: '/images/gallery/locs-2.jpg', hoverImage: '/images/gallery/locs-3.jpg', likes: 108 },
  { id: 26, slug: 'fresh-loc-twists', title: 'Fresh Loc Twists', category: 'Locs', image: '/images/gallery/locs-3.jpg', hoverImage: '/images/gallery/locs-4.jpg', likes: 163 },
  { id: 27, slug: 'loc-retwist', title: 'Loc Retwist', category: 'Locs', image: '/images/gallery/locs-4.jpg', hoverImage: '/images/gallery/locs-5.jpg', likes: 91 },
  { id: 28, slug: 'ombre-locs', title: 'Ombre Locs', category: 'Locs', image: '/images/gallery/locs-5.jpg', hoverImage: '/images/gallery/locs-6.jpg', likes: 256 },
  { id: 29, slug: 'neat-loc-parting', title: 'Neat Loc Parting', category: 'Locs', image: '/images/gallery/locs-6.jpg', hoverImage: '/images/gallery/locs-1.jpg', likes: 122 },
]

export const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    name: 'Amara O.',
    rating: 5,
    review:
      "Booked my knotless braids online in a couple of minutes and turned up to find everything exactly as described. My edges have never been so gentle after a braiding appointment, and three weeks on they still look freshly done. Already booked my next visit.",
    created_at: '2026-06-18',
  },
  {
    id: 2,
    name: 'Chiamaka B.',
    rating: 5,
    review:
      "The wig install was seamless, and I genuinely couldn't tell where my hairline started. The team talked me through aftercare before I left, which I really appreciated. Easily the most natural a unit has ever looked on me.",
    created_at: '2026-05-30',
  },
  {
    id: 3,
    name: 'Tolu A.',
    rating: 5,
    review:
      "From the WhatsApp confirmation to the finished silk press, everything about the experience felt considered and professional. The salon was warm and welcoming and I was seen right on time. Highly recommend to anyone in London looking for a proper salon experience.",
    created_at: '2026-05-09',
  },
]

export const PLACEHOLDER_FAQS = [
  {
    question: 'How do I book an appointment?',
    answer:
      'Use the Book Appointment page to choose a service, pick an available date and time, and enter your details. You will receive a booking reference to confirm your appointment.',
  },
  {
    question: 'How much does braiding cost?',
    answer: 'Pricing varies by style, hair length and complexity. Exact prices are shown on each service page.',
  },
  {
    question: 'How long does a hairstyle take?',
    answer: 'Duration depends on the style. Estimated durations are shown on each service page and during booking.',
  },
  {
    question: 'Do I need to bring my own hair?',
    answer: 'This depends on the service. Please check the individual service page or get in touch if unsure.',
  },
  {
    question: 'How do I make payment?',
    answer:
      'After booking, you will be given instructions to complete payment via WhatsApp. Online card payment will be added in a future update.',
  },
  {
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Please contact us as soon as possible via WhatsApp or phone if you need to cancel or reschedule.',
  },
]

export const PLACEHOLDER_JOURNAL = [
  {
    id: 1,
    slug: 'caring-for-knotless-braids',
    title: 'Caring for Your Knotless Braids',
    excerpt: 'A few simple habits that help your braids stay neat and your scalp stay healthy.',
    category: 'Hair Care',
    published_at: '2026-06-10',
    image: '/images/gallery/braids-13.jpg',
  },
  {
    id: 2,
    slug: 'preparing-for-your-appointment',
    title: 'How to Prepare for Your Salon Appointment',
    excerpt: 'What to do the night before and the morning of your visit to United Vich.',
    category: 'Salon Tips',
    published_at: '2026-05-28',
    image: '/images/gallery/locs-2.jpg',
  },
]
