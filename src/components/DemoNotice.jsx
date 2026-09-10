export default function DemoNotice({ children = 'Preview content. Connect the backend API to show live data.' }) {
  return (
    <div className="border border-dashed border-gold/40 bg-gold/5 px-4 py-2 text-center font-body text-xs text-forest/60">
      {children}
    </div>
  )
}
