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

// `durationMinutes` lets a custom style request (no real service_id) check
// availability against its own chosen duration instead of a services-table
// lookup, which would have nothing to find.
export async function getAvailability({ service, durationMinutes, date }) {
  if (!date || (!service && !durationMinutes)) return { slots: [] }
  let duration = durationMinutes
  if (!duration) {
    const svc = unwrap(await supabase.from('services').select('duration_minutes').eq('id', service).maybeSingle())
    if (!svc) throw new ApiError('Selected service is not available.', 404)
    duration = svc.duration_minutes
  }

  const rows = unwrap(await supabase.rpc('get_availability_slots', { p_date: date, p_duration_minutes: duration }))
  return { slots: (rows || []).map((s) => ({ time: s.slot_time.slice(0, 5), available: s.available })) }
}

export async function getMonthAvailability({ service, durationMinutes, year, month }) {
  if (!service && !durationMinutes) return { closedDates: [] }
  let duration = durationMinutes
  if (!duration) {
    const svc = unwrap(await supabase.from('services').select('duration_minutes').eq('id', service).maybeSingle())
    duration = svc?.duration_minutes || 60
  }

  const rows = unwrap(
    await supabase.rpc('get_month_availability', { p_year: year, p_month: month, p_duration_minutes: duration }),
  )
  return { closedDates: (rows || []).filter((d) => !d.has_availability).map((d) => d.day) }
}

export async function createBooking(payload) {
  const booking = unwrap(
    await supabase.rpc('create_booking', {
      p_service_id: payload.service_id || null,
      p_date: payload.date,
      p_time: payload.time,
      p_name: payload.name,
      p_email: payload.email,
      p_phone: payload.phone,
      p_notes: payload.notes || null,
      p_custom_service_name: payload.custom_service_name || null,
      p_custom_price: payload.custom_price || null,
      p_duration_minutes: payload.duration_minutes || null,
    }),
  )

  // Booking succeeds either way — email/push delivery is best-effort and
  // never blocks the confirmation screen from showing.
  supabase.functions.invoke('send-booking-emails', { body: booking }).catch(() => {})

  return booking
}

export async function getBooking(reference) {
  const data = unwrap(await supabase.rpc('get_booking', { p_reference: reference }))
  if (!data) throw new ApiError('Booking not found.', 404)
  return data
}

// find_booking() requires both reference AND the email on the booking —
// stricter than get_booking(), and what powers self-service cancel/reschedule.
export async function findBooking({ reference, email }) {
  const data = unwrap(await supabase.rpc('find_booking', { p_reference: reference, p_email: email }))
  if (!data) throw new ApiError('We could not find a booking with that reference and email.', 404)
  return data
}

export async function cancelBooking({ reference, email, reason }) {
  const result = unwrap(await supabase.rpc('cancel_booking', { p_reference: reference, p_email: email, p_reason: reason || null }))
  supabase.functions.invoke('notify-booking-change', { body: { type: 'cancelled', ...result } }).catch(() => {})
  return result
}

export async function rescheduleBooking({ reference, email, date, time }) {
  const result = unwrap(
    await supabase.rpc('reschedule_booking', { p_reference: reference, p_email: email, p_new_date: date, p_new_time: time }),
  )
  supabase.functions.invoke('notify-booking-change', { body: { type: 'rescheduled', ...result } }).catch(() => {})
  return result
}

// ---------- Public: Push notifications ----------

export async function subscribeCustomerPush({ reference, email, subscription }) {
  unwrap(
    await supabase.rpc('save_customer_push_subscription', {
      p_reference: reference,
      p_email: email,
      p_endpoint: subscription.endpoint,
      p_p256dh: subscription.p256dh,
      p_auth: subscription.auth,
    }),
  )
}

export async function unsubscribePush(endpoint) {
  unwrap(await supabase.rpc('remove_push_subscription', { p_endpoint: endpoint }))
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

// Throws (rather than returning null) when the lookup itself failed — a
// permissions/network problem is a different, more actionable error than
// "this account genuinely has no admin_profiles row," and callers should
// not confuse the two.
async function fetchAdminProfile(userId, email) {
  const { data, error } = await supabase.from('admin_profiles').select('*').eq('user_id', userId).maybeSingle()
  if (error) throw new ApiError('Could not verify admin access. Please try again in a moment.', 500, error)
  if (!data || data.status !== 'active') return null
  return { ...data, id: data.user_id, email }
}

export async function adminLogin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new ApiError('Invalid email or password.', 401, error)

  let admin
  try {
    admin = await fetchAdminProfile(data.user.id, data.user.email)
  } catch (err) {
    await supabase.auth.signOut()
    throw err
  }
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

function mapAdminAppointment(a) {
  return {
    id: a.id,
    reference: a.reference,
    date: a.appointment_date,
    time: a.appointment_time?.slice(0, 5),
    duration_minutes: a.duration_minutes,
    price: Number(a.price),
    status: a.status,
    notes: a.notes,
    admin_notes: a.admin_notes,
    is_custom: !a.service_id,
    custom_price: a.custom_price != null ? Number(a.custom_price) : null,
    customer_name: a.customer?.name,
    customer_email: a.customer?.email,
    customer_phone: a.customer?.phone,
    service_name: a.service?.name || a.custom_service_name,
  }
}

const ADMIN_APPOINTMENT_SELECT = '*, customer:customers(name, email, phone), service:services(name)'

export async function adminGetAppointments(filters = {}) {
  let query = supabase
    .from('appointments')
    .select(ADMIN_APPOINTMENT_SELECT)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.date) query = query.eq('appointment_date', filters.date)

  const rows = unwrap(await query).map(mapAdminAppointment)

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
  const row = unwrap(await supabase.from('appointments').update(payload).eq('id', id).select(ADMIN_APPOINTMENT_SELECT).single())
  const mapped = mapAdminAppointment(row)

  // A status change to CANCELLED from the admin side notifies the customer
  // the same way a self-service cancellation does.
  if (payload.status === 'CANCELLED') {
    supabase.functions
      .invoke('notify-booking-change', {
        body: {
          type: 'cancelled',
          reference: mapped.reference,
          service_name: mapped.service_name,
          date: mapped.date,
          time: mapped.time,
          customer_name: mapped.customer_name,
          customer_email: mapped.customer_email,
        },
      })
      .catch(() => {})
  }

  return mapped
}

// Admin reschedule bypasses the customer-facing RPC (which requires the
// customer's own email as proof of ownership) since the admin already has
// direct update rights via RLS — the database's EXCLUDE constraint still
// makes an overlapping slot impossible to save.
export async function adminRescheduleAppointment(id, { date, time }) {
  const before = unwrap(await supabase.from('appointments').select(ADMIN_APPOINTMENT_SELECT).eq('id', id).single())
  const beforeMapped = mapAdminAppointment(before)

  let after
  try {
    after = unwrap(
      await supabase
        .from('appointments')
        .update({ appointment_date: date, appointment_time: time })
        .eq('id', id)
        .select(ADMIN_APPOINTMENT_SELECT)
        .single(),
    )
  } catch (err) {
    if (err.payload?.code === '23P01') {
      throw new ApiError('This slot is no longer available. Please choose another time.', 409, err.payload)
    }
    throw err
  }

  const afterMapped = mapAdminAppointment(after)

  supabase.functions
    .invoke('notify-booking-change', {
      body: {
        type: 'rescheduled',
        reference: afterMapped.reference,
        service_name: afterMapped.service_name,
        old_date: beforeMapped.date,
        old_time: beforeMapped.time,
        date: afterMapped.date,
        time: afterMapped.time,
        customer_name: afterMapped.customer_name,
        customer_email: afterMapped.customer_email,
      },
    })
    .catch(() => {})

  return afterMapped
}

// ---------- Admin: Push notifications ----------
// Admin rows go straight to the table (RLS restricts them to their own
// admin_user_id) rather than through an RPC, since the caller is already a
// signed-in, authorized admin — no extra ownership proof needed.

export async function subscribeAdminPush(subscription) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new ApiError('Not signed in.', 401)

  unwrap(
    await supabase.from('push_subscriptions').upsert(
      {
        subscriber_type: 'admin',
        admin_user_id: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
      { onConflict: 'endpoint' },
    ),
  )
}

export async function adminHasPushSubscription(endpoint) {
  if (!endpoint) return false
  const { data } = await supabase.from('push_subscriptions').select('id').eq('endpoint', endpoint).maybeSingle()
  return !!data
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
