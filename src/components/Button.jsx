import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-forest text-ivory border border-forest hover:bg-forest-dark',
  gold: 'bg-gold text-ivory border border-gold hover:bg-gold-light',
  outline: 'bg-transparent text-forest border border-forest hover:bg-forest hover:text-ivory',
  outlineLight: 'bg-transparent text-ivory border border-ivory/70 hover:bg-ivory hover:text-forest',
  ghost: 'bg-transparent text-forest border border-transparent hover:border-forest/30',
}

const SIZES = {
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold uppercase tracking-[0.14em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  const Component = as || 'button'
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
