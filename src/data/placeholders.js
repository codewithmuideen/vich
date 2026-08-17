// Demo content shown only when the PHP API is unreachable (e.g. running the
// frontend before the backend is deployed). Once backend/ is live, every
// page fetches real data through src/services/api.js and this file is never
// used. Nothing here should ever be mistaken for real United Vich content —
// reviews are fictional placeholders, not real client testimonials.

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
    image: null,
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
    image: null,
  },
  {
    id: 3,
    slug: 'cornrows',
    name: 'Cornrows',
    category: 'Braids',
    description: 'Sleek braids woven close to the scalp in clean, elegant rows.',
    price_from: 45,
    duration_minutes: 90,
    image: null,
  },
  {
    id: 4,
    slug: 'wig-installation',
    name: 'Wig Installation',
    category: 'Wigs',
    description: 'A precise, secure install finished to sit naturally along your hairline.',
    price_from: 60,
    duration_minutes: 120,
    image: null,
  },
  {
    id: 5,
    slug: 'wig-styling',
    name: 'Wig Styling',
    category: 'Wigs',
    description: 'Custom cutting, colouring and styling to make your wig look effortlessly yours.',
    price_from: 40,
    duration_minutes: 90,
    image: null,
  },
  {
    id: 6,
    slug: 'natural-hair-treatment',
    name: 'Natural Hair Treatment',
    category: 'Natural Hair',
    description: 'Deep conditioning and scalp care designed to nourish and strengthen natural hair.',
    price_from: 55,
    duration_minutes: 90,
    image: null,
  },
  {
    id: 7,
    slug: 'silk-press',
    name: 'Silk Press',
    category: 'Styling',
    description: 'A smooth, healthy press that shows off the true length and shine of your hair.',
    price_from: 50,
    duration_minutes: 75,
    image: null,
  },
  {
    id: 8,
    slug: 'weave-installation',
    name: 'Weave Installation',
    category: 'Weaves',
    description: 'Expertly blended weave application for fullness, length and natural movement.',
    price_from: 85,
    duration_minutes: 180,
    image: null,
  },
]

export const PLACEHOLDER_GALLERY = [
  { id: 1, slug: 'style-one', title: 'Knotless Braids', category: 'Braids', image: null, likes: 132 },
  { id: 2, slug: 'style-two', title: 'Silk Press Finish', category: 'Styling', image: null, likes: 98 },
  { id: 3, slug: 'style-three', title: 'Box Braids', category: 'Braids', image: null, likes: 211 },
  { id: 4, slug: 'style-four', title: 'Wig Install', category: 'Wigs', image: null, likes: 76 },
  { id: 5, slug: 'style-five', title: 'Cornrow Updo', category: 'Braids', image: null, likes: 154 },
  { id: 6, slug: 'style-six', title: 'Natural Curls', category: 'Natural Hair', image: null, likes: 88 },
  { id: 7, slug: 'style-seven', title: 'Loc Retwist', category: 'Locs', image: null, likes: 61 },
  { id: 8, slug: 'style-eight', title: 'Weave Blend', category: 'Weaves', image: null, likes: 143 },
]

export const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    name: 'Demo Client A',
    rating: 5,
    review: 'This is placeholder review content shown while the backend is not yet connected.',
    created_at: '2026-06-01',
  },
  {
    id: 2,
    name: 'Demo Client B',
    rating: 5,
    review: 'Real client reviews will appear here once submitted and approved by the salon.',
    created_at: '2026-05-14',
  },
  {
    id: 3,
    name: 'Demo Client C',
    rating: 4,
    review: 'Placeholder text only — connect backend/api/reviews to show genuine testimonials.',
    created_at: '2026-04-22',
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
    image: null,
  },
  {
    id: 2,
    slug: 'preparing-for-your-appointment',
    title: 'How to Prepare for Your Salon Appointment',
    excerpt: 'What to do the night before and the morning of your visit to United Vich.',
    category: 'Salon Tips',
    published_at: '2026-05-28',
    image: null,
  },
]
