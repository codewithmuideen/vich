// Demo content shown only when the PHP API is unreachable (e.g. running the
// frontend before the backend is deployed). Once backend/ is live, every
// page fetches real data through src/services/api.js and this file is never
// used. The three seeded reviews mirror backend/database/seed.sql (the
// business asked for a handful of real starter testimonials rather than an
// empty state) — anything a visitor submits afterwards goes through the
// normal PENDING → admin-approval flow, same as these did originally.

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
    image: '/images/gallery/box-braids-1.jpg',
    hoverImage: '/images/gallery/box-braids-2.jpg',
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
    image: '/images/gallery/box-braids-2.jpg',
    hoverImage: '/images/gallery/box-braids-1.jpg',
  },
  {
    id: 3,
    slug: 'cornrows',
    name: 'Cornrows',
    category: 'Braids',
    description: 'Sleek braids woven close to the scalp in clean, elegant rows.',
    price_from: 45,
    duration_minutes: 90,
    image: '/images/gallery/cornrows-1.jpg',
  },
  {
    id: 4,
    slug: 'wig-installation',
    name: 'Wig Installation',
    category: 'Wigs',
    description: 'A precise, secure install finished to sit naturally along your hairline.',
    price_from: 60,
    duration_minutes: 120,
    image: '/images/gallery/wig-1.jpg',
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
    image: '/images/gallery/wig-1.jpg',
  },
  {
    id: 6,
    slug: 'natural-hair-treatment',
    name: 'Natural Hair Treatment',
    category: 'Natural Hair',
    description: 'Deep conditioning and scalp care designed to nourish and strengthen natural hair.',
    price_from: 55,
    duration_minutes: 90,
    image: '/images/gallery/afro-1.jpg',
    hoverImage: '/images/gallery/afro-2.jpg',
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
    image: '/images/gallery/silk-press-1.jpg',
  },
  {
    id: 8,
    slug: 'weave-installation',
    name: 'Weave Installation',
    category: 'Weaves',
    description: 'Expertly blended weave application for fullness, length and natural movement.',
    price_from: 85,
    duration_minutes: 180,
    image: '/images/gallery/silk-press-1.jpg',
    hoverImage: '/images/gallery/wig-1.jpg',
  },
]

export const PLACEHOLDER_GALLERY = [
  {
    id: 1,
    slug: 'style-one',
    title: 'Knotless Braids',
    category: 'Braids',
    image: '/images/gallery/box-braids-1.jpg',
    hoverImage: '/images/gallery/box-braids-2.jpg',
    likes: 132,
  },
  {
    id: 2,
    slug: 'style-two',
    title: 'Silk Press Finish',
    category: 'Styling',
    image: '/images/gallery/silk-press-1.jpg',
    hoverImage: '/images/gallery/afro-1.jpg',
    likes: 98,
  },
  {
    id: 3,
    slug: 'style-three',
    title: 'Box Braids',
    category: 'Braids',
    image: '/images/gallery/box-braids-2.jpg',
    hoverImage: '/images/gallery/box-braids-1.jpg',
    likes: 211,
  },
  {
    id: 4,
    slug: 'style-four',
    title: 'Wig Install',
    category: 'Wigs',
    image: '/images/gallery/wig-1.jpg',
    hoverImage: '/images/gallery/silk-press-1.jpg',
    likes: 76,
  },
  {
    id: 5,
    slug: 'style-five',
    title: 'Cornrow Updo',
    category: 'Braids',
    image: '/images/gallery/cornrows-1.jpg',
    hoverImage: '/images/gallery/box-braids-1.jpg',
    likes: 154,
  },
  {
    id: 6,
    slug: 'style-six',
    title: 'Natural Curls',
    category: 'Natural Hair',
    image: '/images/gallery/afro-1.jpg',
    hoverImage: '/images/gallery/afro-2.jpg',
    likes: 88,
  },
  {
    id: 7,
    slug: 'style-seven',
    title: 'Loc Retwist',
    category: 'Locs',
    image: '/images/gallery/locs-1.jpg',
    hoverImage: '/images/gallery/locs-2.jpg',
    likes: 61,
  },
  {
    id: 8,
    slug: 'style-eight',
    title: 'Weave Blend',
    category: 'Weaves',
    image: '/images/gallery/silk-press-1.jpg',
    hoverImage: '/images/gallery/wig-1.jpg',
    likes: 143,
  },
]

export const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    name: 'Amara O.',
    rating: 5,
    review:
      "Booked my knotless braids online in a couple of minutes and turned up to find everything exactly as described. My edges have never been so gentle after a braiding appointment — three weeks on and they still look freshly done. Already booked my next visit.",
    created_at: '2026-06-18',
  },
  {
    id: 2,
    name: 'Chiamaka B.',
    rating: 5,
    review:
      "The wig install was seamless — genuinely couldn't tell where my hairline started. The team talked me through aftercare before I left, which I really appreciated. Easily the most natural a unit has ever looked on me.",
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
    image: '/images/gallery/box-braids-1.jpg',
  },
  {
    id: 2,
    slug: 'preparing-for-your-appointment',
    title: 'How to Prepare for Your Salon Appointment',
    excerpt: 'What to do the night before and the morning of your visit to United Vich.',
    category: 'Salon Tips',
    published_at: '2026-05-28',
    image: '/images/salon/interior-2.jpg',
  },
]
