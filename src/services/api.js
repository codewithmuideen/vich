// Centralized API client for the United Vich Enterprise PHP REST backend.
// Every request/response passes through here — components never call fetch() directly.

const API_URL = import.meta.env.VITE_API_URL || '/api'

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request(path, { method = 'GET', body, params, auth = false, signal } = {}) {
  let url = `${API_URL}${path}`

  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    )
    const qs = query.toString()
    if (qs) url += `?${qs}`
  }

  const isFormData = body instanceof FormData
  const headers = { Accept: 'application/json' }
  if (body && !isFormData) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = sessionStorage.getItem('uv_admin_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch {
    throw new ApiError('Network unavailable. Please check your connection and try again.', 0)
  }

  let json = null
  try {
    json = await res.json()
  } catch {
    // non-JSON response
  }

  if (!res.ok || !json || json.success === false) {
    const message = json?.message || 'Something went wrong. Please try again.'
    throw new ApiError(message, res.status, json)
  }

  return json.data
}

// ---------- Public: Services ----------
export const getServices = (params) => request('/services/list.php', { params })
export const getService = (slug) => request('/services/detail.php', { params: { slug } })
export const getServiceCategories = () => request('/services/categories.php')

// ---------- Public: Gallery ----------
export const getGallery = (params) => request('/gallery/list.php', { params })
export const getGalleryItem = (slug) => request('/gallery/detail.php', { params: { slug } })
export const likeGalleryItem = (id) =>
  request('/gallery/like.php', { method: 'POST', body: { gallery_id: id } })
export const getMostLoved = (limit = 8) =>
  request('/gallery/most-loved.php', { params: { limit } })

// ---------- Public: Reviews ----------
export const getReviews = (params) => request('/reviews/list.php', { params })
export const submitReview = (payload) => request('/reviews/submit.php', { method: 'POST', body: payload })

// ---------- Public: Booking ----------
export const getAvailability = (params) => request('/availability/slots.php', { params })
export const getMonthAvailability = (params) => request('/availability/month.php', { params })
export const createBooking = (payload) => request('/appointments/create.php', { method: 'POST', body: payload })
export const getBooking = (reference) => request('/appointments/detail.php', { params: { reference } })

// ---------- Public: Contact / Settings / Journal ----------
export const submitContact = (payload) => request('/contact/submit.php', { method: 'POST', body: payload })
export const getSettings = () => request('/settings/public.php')
export const getJournalPosts = (params) => request('/journal/list.php', { params })
export const getJournalPost = (slug) => request('/journal/detail.php', { params: { slug } })
export const getFaqs = () => request('/faq/list.php')

// ---------- Admin ----------
export const adminLogin = (payload) => request('/auth/login.php', { method: 'POST', body: payload })
export const adminLogout = () => request('/auth/logout.php', { method: 'POST', auth: true })
export const adminMe = () => request('/auth/me.php', { auth: true })

export const adminGetAppointments = (params) => request('/admin/appointments/list.php', { params, auth: true })
export const adminUpdateAppointment = (id, payload) =>
  request(`/admin/appointments/update.php`, { method: 'POST', auth: true, body: { id, ...payload } })

export const adminGetServices = (params) => request('/admin/services/list.php', { params, auth: true })
export const adminSaveService = (payload) =>
  request('/admin/services/save.php', { method: 'POST', auth: true, body: payload })
export const adminDeleteService = (id) =>
  request('/admin/services/delete.php', { method: 'POST', auth: true, body: { id } })

export const adminGetCategories = () => request('/admin/categories/list.php', { auth: true })
export const adminSaveCategory = (payload) =>
  request('/admin/categories/save.php', { method: 'POST', auth: true, body: payload })
export const adminDeleteCategory = (id) =>
  request('/admin/categories/delete.php', { method: 'POST', auth: true, body: { id } })

function toFormData(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    formData.append(key, value)
  })
  return formData
}

export const adminGetGallery = (params) => request('/admin/gallery/list.php', { params, auth: true })
export const adminSaveGalleryItem = ({ imageFile, ...payload }) =>
  request('/admin/gallery/save.php', {
    method: 'POST',
    auth: true,
    body: imageFile ? toFormData({ ...payload, image: imageFile }) : payload,
  })
export const adminDeleteGalleryItem = (id) =>
  request('/admin/gallery/delete.php', { method: 'POST', auth: true, body: { id } })

export const adminGetReviews = (params) => request('/admin/reviews/list.php', { params, auth: true })
export const adminModerateReview = (id, status) =>
  request('/admin/reviews/moderate.php', { method: 'POST', auth: true, body: { id, status } })

export const adminGetAvailability = () => request('/admin/availability/get.php', { auth: true })
export const adminSaveAvailability = (payload) =>
  request('/admin/availability/save.php', { method: 'POST', auth: true, body: payload })

export const adminGetBlockedDates = () => request('/admin/blocked-dates/list.php', { auth: true })
export const adminSaveBlockedDate = (payload) =>
  request('/admin/blocked-dates/save.php', { method: 'POST', auth: true, body: payload })
export const adminDeleteBlockedDate = (id) =>
  request('/admin/blocked-dates/delete.php', { method: 'POST', auth: true, body: { id } })

export const adminGetCustomers = (params) => request('/admin/customers/list.php', { params, auth: true })

export const adminGetSettings = () => request('/admin/settings/get.php', { auth: true })
export const adminSaveSettings = (payload) =>
  request('/admin/settings/save.php', { method: 'POST', auth: true, body: payload })

export const adminGetDashboard = () => request('/admin/dashboard/summary.php', { auth: true })

export const adminGetJournalPosts = (params) => request('/admin/journal/list.php', { params, auth: true })
export const adminSaveJournalPost = ({ imageFile, ...payload }) =>
  request('/admin/journal/save.php', {
    method: 'POST',
    auth: true,
    body: imageFile ? toFormData({ ...payload, image: imageFile }) : payload,
  })
export const adminDeleteJournalPost = (id) =>
  request('/admin/journal/delete.php', { method: 'POST', auth: true, body: { id } })

export { ApiError, API_URL }
