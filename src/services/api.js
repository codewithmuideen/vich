// Centralized API client for the United Vich Enterprise Supabase backend.
// Every request/response passes through here — components never talk to
// supabase-js directly. Public reads/writes go through RLS-guarded tables
// or the RPC functions defined in supabase/migrations; admin operations are
// plain table calls authorized by the caller's own Supabase Auth session.

import { supabase, getClientFingerprint } from './supabaseClient'

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

const ERROR_STATUS_BY_CODE = {
  P0002: 404,
  P0003: 409,
  P0004: 500,
  '23505': 409,
  '42501': 403,
  PGRST301: 401,
}

function unwrap({ data, error }) {
  if (error) {
    throw new ApiError(error.message || 'Something went wrong. Please try again.', ERROR_STATUS_BY_CODE[error.code], error)
  }
  return data
}

function slugify(text = '') {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function shortId() {
  return Math.random().toString(36).slice(2, 8)
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function uploadImage(file, folder) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw new ApiError('Image upload failed. Please try a JPG, PNG or WEBP under 10MB.', 400, error)
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function mapOpeningHours(rows) {
  const byWeekday = new Map((rows || []).map((r) => [r.weekday, r]))
  return WEEKDAY_NAMES.map((day, i) => {
    const r = byWeekday.get(i)
    return {
      day,
      open: r && !r.is_closed ? r.open_time?.slice(0, 5) : null,
      close: r && !r.is_closed ? r.close_time?.slice(0, 5) : null,
      closed: !r || !!r.is_closed,
    }
  })
}

// ---------- Public: Services ----------

function mapService(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price_from: row.price != null ? Number(row.price) : null,
    duration_minutes: row.duration_minutes,
    image: row.main_image,
    featured: !!row.featured,
    status: row.status,
    category: row.category?.name ?? null,
    category_slug: row.category?.slug ?? null,
    category_id: row.category_id,
  }
}

export async function getServices(params = {}) {
  let query = supabase.from('services').select('*, category:service_categories(name, slug)').eq('status', 'active')
  if (params.featured) query = query.eq('featured', true)
  if (params.exclude) query = query.neq('slug', params.exclude)
  query = query.order('featured', { ascending: false }).order('name', { ascending: true })
  query = query.limit(Math.min(params.limit || 100, 100))

  const rows = unwrap(await query).map(mapService)
  return params.category ? rows.filter((r) => r.category_slug === params.category) : rows
}

export async function getService(slug) {
  const service = unwrap(
    await supabase
      .from('services')
      .select('*, category:service_categories(name, slug)')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle(),
  )
  if (!service) throw new ApiError('Service not found.', 404)

  const [images, reviews] = await Promise.all([
    supabase.from('service_images').select('image_url').eq('service_id', service.id).order('sort_order'),
    supabase
      .from('reviews')
      .select('id, name, rating, review, created_at')
      .eq('service_id', service.id)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  return {
    ...mapService(service),
    gallery: (unwrap(images) || []).map((i) => i.image_url),
    included: service.included_items ?? null,
    preparation: service.preparation_notes ?? null,
    aftercare: service.aftercare_notes ?? null,
    reviews: unwrap(reviews) || [],
  }
}

export async function getServiceCategories() {
  return unwrap(await supabase.from('service_categories').select('id, name, slug').order('sort_order'))
}

// ---------- Public: Gallery ----------

function mapGallery(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    image: row.image_url,
    price: row.price != null ? Number(row.price) : null,
    featured: !!row.featured,
    likes: row.likes_count,
    category: row.category?.name ?? null,
    category_slug: row.category?.slug ?? null,
    category_id: row.category_id,
    service_slug: row.service?.slug ?? null,
  }
}

export async function getGallery(params = {}) {
  const query = supabase
    .from('gallery')
    .select('*, category:service_categories(name, slug), service:services(slug)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(Math.min(params.limit || 60, 60))

  const rows = unwrap(await query).map(mapGallery)
  return params.category ? rows.filter((r) => r.category_slug === params.category) : rows
}

export async function getGalleryItem(slug) {
  const row = unwrap(
    await supabase
      .from('gallery')
      .select('*, category:service_categories(name, slug), service:services(slug)')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle(),
  )
  if (!row) throw new ApiError('Gallery item not found.', 404)
  return mapGallery(row)
}

export async function likeGalleryItem(id) {
  const fingerprint = await sha256Hex(getClientFingerprint())
  return unwrap(await supabase.rpc('like_gallery_item', { p_gallery_id: id, p_fingerprint: fingerprint }))
}

export async function getMostLoved(limit = 8) {
  const query = supabase
    .from('gallery')
    .select('*, category:service_categories(name, slug), service:services(slug)')
    .eq('status', 'active')
    .order('likes_count', { ascending: false })
    .limit(limit)
  return unwrap(await query).map(mapGallery)
}

// ---------- Public: Reviews ----------

export async function getReviews(params = {}) {
  return unwrap(
    await supabase
      .from('reviews')
      .select('id, name, rating, review, photo_url, created_at')
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(params.limit || 24),
  )
}

export async function submitReview(payload) {
  unwrap(
    await supabase.rpc('submit_review', {
      p_name: payload.name,
      p_rating: payload.rating,
      p_review: payload.review,
      p_service_id: payload.service_id || null,
      p_email: payload.email || null,
      p_photo_url: payload.photo_url || null,
    }),
  )
}

// ---------- Public: Booking ----------

export async function getAvailability({ service, date }) {
  if (!service || !date) return { slots: [] }
  const svc = unwrap(await supabase.from('services').select('duration_minutes').eq('id', service).maybeSingle())
  if (!svc) throw new ApiError('Selected service is not available.', 404)

  const rows = unwrap(await supabase.rpc('get_availability_slots', { p_date: date, p_duration_minutes: svc.duration_minutes }))
  return { slots: (rows || []).map((s) => ({ time: s.slot_time.slice(0, 5), available: s.available })) }
}

export async function getMonthAvailability({ service, year, month }) {
  if (!service) return { closedDates: [] }
  const svc = unwrap(await supabase.from('services').select('duration_minutes').eq('id', service).maybeSingle())
  const duration = svc?.duration_minutes || 60

  const rows = unwrap(
    await supabase.rpc('get_month_availability', { p_year: year, p_month: month, p_duration_minutes: duration }),
  )
  return { closedDates: (rows || []).filter((d) => !d.has_availability).map((d) => d.day) }
}

export async function createBooking(payload) {
  const booking = unwrap(
    await supabase.rpc('create_booking', {
      p_service_id: payload.service_id,
      p_date: payload.date,
      p_time: payload.time,
      p_name: payload.name,
      p_email: payload.email,
      p_phone: payload.phone,
      p_notes: payload.notes || null,
    }),
  )

  // Booking succeeds either way — email delivery is best-effort and never
  // blocks the confirmation screen from showing.
  supabase.functions.invoke('send-booking-emails', { body: booking }).catch(() => {})

  return booking
}

export async function getBooking(reference) {
  const data = unwrap(await supabase.rpc('get_booking', { p_reference: reference }))
  if (!data) throw new ApiError('Booking not found.', 404)
  return data
}

// ---------- Public: Contact / Settings / Journal ----------

export async function submitContact(payload) {
  unwrap(
    await supabase.rpc('submit_contact_message', {
      p_name: payload.name,
      p_email: payload.email,
      p_message: payload.message,
      p_phone: payload.phone || null,
    }),
  )
  supabase.functions.invoke('notify-contact', { body: payload }).catch(() => {})
}

export async function getSettings() {
  const [settingsRes, hoursRes] = await Promise.all([
    supabase.from('settings').select('setting_key, setting_value').eq('is_public', true),
    supabase.from('availability_hours').select('*').order('weekday'),
  ])
  const rows = unwrap(settingsRes)
  const settings = {}
  rows.forEach((r) => {
    settings[r.setting_key] = r.setting_value
  })
  if (!hoursRes.error) settings.opening_hours = mapOpeningHours(hoursRes.data)
  return settings
}

function mapJournalRow(row) {
  return { ...row, image: row.featured_image }
}

export async function getJournalPosts(params = {}) {
  const rows = unwrap(
    await supabase
      .from('journal_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(params.limit || 60),
  )
  return rows.map(mapJournalRow)
}

export async function getJournalPost(slug) {
  const row = unwrap(
    await supabase.from('journal_posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle(),
  )
  if (!row) throw new ApiError('Journal post not found.', 404)
  return mapJournalRow(row)
}

export async function getFaqs() {
  return unwrap(await supabase.from('faqs').select('id, question, answer').eq('status', 'active').order('sort_order'))
}

// ---------- Admin: Auth ----------

async function fetchAdminProfile(userId, email) {
  const { data } = await supabase.from('admin_profiles').select('*').eq('user_id', userId).maybeSingle()
  if (!data || data.status !== 'active') return null
  return { ...data, id: data.user_id, email }
}

export async function adminLogin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new ApiError('Invalid email or password.', 401, error)

  const admin = await fetchAdminProfile(data.user.id, data.user.email)
  if (!admin) {
    await supabase.auth.signOut()
    throw new ApiError('This account is not authorized for admin access.', 403)
  }
  return { admin }
}

export async function adminLogout() {
  await supabase.auth.signOut()
}

export async function adminMe() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new ApiError('Not signed in.', 401)
  const admin = await fetchAdminProfile(session.user.id, session.user.email)
  if (!admin) throw new ApiError('Not signed in.', 401)
  return admin
}

// ---------- Admin: Appointments ----------

export async function adminGetAppointments(filters = {}) {
  let query = supabase
    .from('appointments')
    .select('*, customer:customers(name, email, phone), service:services(name)')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.date) query = query.eq('appointment_date', filters.date)

  const rows = unwrap(await query).map((a) => ({
    id: a.id,
    reference: a.reference,
    date: a.appointment_date,
    time: a.appointment_time?.slice(0, 5),
    duration_minutes: a.duration_minutes,
    price: Number(a.price),
    status: a.status,
    notes: a.notes,
    admin_notes: a.admin_notes,
    customer_name: a.customer?.name,
    customer_email: a.customer?.email,
    customer_phone: a.customer?.phone,
    service_name: a.service?.name,
  }))

  if (!filters.search) return rows
  const needle = filters.search.toLowerCase()
  return rows.filter(
    (r) =>
      r.reference?.toLowerCase().includes(needle) ||
      r.customer_name?.toLowerCase().includes(needle) ||
      r.customer_email?.toLowerCase().includes(needle),
  )
}

export async function adminUpdateAppointment(id, payload) {
  return unwrap(await supabase.from('appointments').update(payload).eq('id', id).select().single())
}

// ---------- Admin: Services ----------

export async function adminGetServices() {
  return unwrap(
    await supabase.from('services').select('*, category:service_categories(name, slug)').order('name'),
  ).map(mapService)
}

export async function adminSaveService(payload) {
  const row = {
    name: payload.name,
    category_id: payload.category_id || null,
    description: payload.description || null,
    price: Number(payload.price),
    duration_minutes: Number(payload.duration_minutes),
    status: payload.status || 'active',
    featured: !!payload.featured,
  }

  if (payload.id) {
    return unwrap(await supabase.from('services').update(row).eq('id', payload.id).select().single())
  }
  row.slug = `${slugify(payload.name)}-${shortId()}`
  return unwrap(await supabase.from('services').insert(row).select().single())
}

export async function adminDeleteService(id) {
  unwrap(await supabase.from('services').delete().eq('id', id))
}

// ---------- Admin: Categories ----------

export async function adminGetCategories() {
  return unwrap(await supabase.from('service_categories').select('*').order('sort_order'))
}

export async function adminSaveCategory(payload) {
  if (payload.id) {
    return unwrap(await supabase.from('service_categories').update({ name: payload.name }).eq('id', payload.id).select().single())
  }
  return unwrap(
    await supabase
      .from('service_categories')
      .insert({ name: payload.name, slug: slugify(payload.name) })
      .select()
      .single(),
  )
}

export async function adminDeleteCategory(id) {
  unwrap(await supabase.from('service_categories').delete().eq('id', id))
}

// ---------- Admin: Gallery ----------

export async function adminGetGallery() {
  return unwrap(
    await supabase.from('gallery').select('*, category:service_categories(name, slug)').order('created_at', { ascending: false }),
  ).map(mapGallery)
}

export async function adminSaveGalleryItem({ imageFile, ...payload }) {
  const row = {
    title: payload.title,
    category_id: payload.category_id || null,
    description: payload.description || null,
    featured: !!payload.featured,
  }
  if (imageFile) row.image_url = await uploadImage(imageFile, 'gallery')

  if (payload.id) {
    return unwrap(await supabase.from('gallery').update(row).eq('id', payload.id).select().single())
  }
  if (!row.image_url) throw new ApiError('Please choose an image to upload.', 422)
  row.slug = `${slugify(payload.title)}-${shortId()}`
  return unwrap(await supabase.from('gallery').insert(row).select().single())
}

export async function adminDeleteGalleryItem(id) {
  unwrap(await supabase.from('gallery').delete().eq('id', id))
}

// ---------- Admin: Reviews ----------

export async function adminGetReviews(params = {}) {
  return unwrap(
    await supabase
      .from('reviews')
      .select('*')
      .eq('status', params.status || 'PENDING')
      .order('created_at', { ascending: false }),
  )
}

export async function adminModerateReview(id, status) {
  return unwrap(await supabase.from('reviews').update({ status }).eq('id', id).select().single())
}

// ---------- Admin: Availability ----------

export async function adminGetAvailability() {
  return mapOpeningHours(unwrap(await supabase.from('availability_hours').select('*').order('weekday')))
}

export async function adminSaveAvailability({ opening_hours: hours }) {
  const rows = hours.map((row, weekday) => ({
    weekday,
    open_time: row.closed ? null : row.open,
    close_time: row.closed ? null : row.close,
    is_closed: !!row.closed,
  }))
  unwrap(await supabase.from('availability_hours').upsert(rows, { onConflict: 'weekday' }))
  return adminGetAvailability()
}

// ---------- Admin: Blocked Dates ----------

export async function adminGetBlockedDates() {
  return unwrap(await supabase.from('blocked_dates').select('*').order('blocked_date')).map((r) => ({
    id: r.id,
    date: r.blocked_date,
    reason: r.reason,
  }))
}

export async function adminSaveBlockedDate(payload) {
  return unwrap(
    await supabase
      .from('blocked_dates')
      .insert({ blocked_date: payload.date, reason: payload.reason || null })
      .select()
      .single(),
  )
}

export async function adminDeleteBlockedDate(id) {
  unwrap(await supabase.from('blocked_dates').delete().eq('id', id))
}

// ---------- Admin: Customers ----------

export async function adminGetCustomers(params = {}) {
  return unwrap(await supabase.rpc('admin_list_customers', { p_search: params.search || null }))
}

// ---------- Admin: Settings ----------

export async function adminGetSettings() {
  const rows = unwrap(await supabase.from('settings').select('setting_key, setting_value'))
  const settings = {}
  rows.forEach((r) => {
    settings[r.setting_key] = r.setting_value
  })
  return settings
}

export async function adminSaveSettings(payload) {
  const rows = Object.entries(payload)
    .filter(([key]) => key !== 'isPlaceholder' && key !== 'opening_hours')
    .map(([setting_key, setting_value]) => ({ setting_key, setting_value: setting_value == null ? null : String(setting_value) }))
  unwrap(await supabase.from('settings').upsert(rows, { onConflict: 'setting_key' }))
  return adminGetSettings()
}

// ---------- Admin: Dashboard ----------

export async function adminGetDashboard() {
  return unwrap(await supabase.rpc('admin_dashboard_summary'))
}

// ---------- Admin: Journal ----------

export async function adminGetJournalPosts() {
  return unwrap(await supabase.from('journal_posts').select('*').order('created_at', { ascending: false })).map(mapJournalRow)
}

export async function adminSaveJournalPost({ imageFile, ...payload }) {
  const row = {
    title: payload.title,
    slug: slugify(payload.slug || payload.title),
    excerpt: payload.excerpt || null,
    content: payload.content || null,
    category: payload.category || null,
    seo_title: payload.seo_title || null,
    seo_description: payload.seo_description || null,
  }
  if (imageFile) row.featured_image = await uploadImage(imageFile, 'journal')

  if (payload.id) {
    return unwrap(await supabase.from('journal_posts').update(row).eq('id', payload.id).select().single())
  }
  row.status = 'published'
  row.published_at = new Date().toISOString()
  return unwrap(await supabase.from('journal_posts').insert(row).select().single())
}

export async function adminDeleteJournalPost(id) {
  unwrap(await supabase.from('journal_posts').delete().eq('id', id))
}
