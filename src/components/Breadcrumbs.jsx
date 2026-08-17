import { Link } from 'react-router-dom'
import { PiCaretRightLight } from 'react-icons/pi'

export default function Breadcrumbs({ items, light = false }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-body text-xs uppercase tracking-[0.14em]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <PiCaretRightLight className={light ? 'text-ivory/40' : 'text-forest/30'} aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className={light ? 'text-ivory/70' : 'text-dark/50'}>
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={
                    light
                      ? 'text-ivory/90 hover:text-gold-light'
                      : 'text-forest hover:text-gold'
                  }
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
