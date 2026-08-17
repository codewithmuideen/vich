import { PiCalendarCheckLight, PiHourglassLight, PiCheckCircleLight, PiXCircleLight, PiUsersLight, PiStarLight, PiHeartLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/admin/StatusBadge'
import { useApiData } from '../../hooks/useApiData'
import { adminGetDashboard } from '../../services/api'
import { formatDateLong, formatTime } from '../../lib/format'

const STAT_ICONS = {
  today: PiCalendarCheckLight,
  pending: PiHourglassLight,
  completed: PiCheckCircleLight,
  cancelled: PiXCircleLight,
  customers: PiUsersLight,
  reviews: PiStarLight,
  likes: PiHeartLight,
}

export default function Dashboard() {
  const { data, loading, error } = useApiData(() => adminGetDashboard(), {})

  if (loading) return <Loader />
  if (error) return <ErrorMessage message="Could not load dashboard data. Confirm the PHP API is deployed and reachable." />

  const stats = [
    { key: 'today', label: "Today's Appointments", value: data?.today_count ?? 0 },
    { key: 'pending', label: 'Pending Bookings', value: data?.pending_count ?? 0 },
    { key: 'completed', label: 'Completed', value: data?.completed_count ?? 0 },
    { key: 'cancelled', label: 'Cancelled', value: data?.cancelled_count ?? 0 },
    { key: 'customers', label: 'Customers', value: data?.customers_count ?? 0 },
    { key: 'reviews', label: 'New Reviews', value: data?.new_reviews_count ?? 0 },
    { key: 'likes', label: 'Total Likes', value: data?.total_likes ?? 0 },
  ]

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of today's salon activity." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = STAT_ICONS[stat.key]
          return (
            <div key={stat.key} className="flex flex-col gap-3 border border-forest/10 bg-white p-6">
              <Icon className="text-2xl text-gold" aria-hidden="true" />
              <span className="font-display text-3xl text-forest">{stat.value}</span>
              <span className="font-body text-xs uppercase tracking-[0.1em] text-dark/50">{stat.label}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-forest/10 bg-white p-6">
          <h2 className="mb-4 font-display text-xl text-forest">Upcoming Appointments</h2>
          {data?.upcoming?.length ? (
            <ul className="flex flex-col divide-y divide-forest/10">
              {data.upcoming.map((appt) => (
                <li key={appt.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-body text-sm font-semibold text-forest">{appt.customer_name}</p>
                    <p className="font-body text-xs text-dark/50">
                      {appt.service_name} — {formatDateLong(appt.date)} at {formatTime(appt.time)}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-dark/50">No upcoming appointments.</p>
          )}
        </div>

        <div className="border border-forest/10 bg-white p-6">
          <h2 className="mb-4 font-display text-xl text-forest">Popular Hairstyles</h2>
          {data?.popular_styles?.length ? (
            <ul className="flex flex-col divide-y divide-forest/10">
              {data.popular_styles.map((style) => (
                <li key={style.id} className="flex items-center justify-between gap-4 py-3">
                  <p className="font-body text-sm text-forest">{style.title}</p>
                  <span className="font-body text-xs text-dark/50">{style.likes} likes</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-dark/50">No gallery likes recorded yet.</p>
          )}
        </div>
      </div>
    </>
  )
}
