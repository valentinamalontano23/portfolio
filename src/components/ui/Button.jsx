import Icon from './Icon'

const VARIANTS = {
  solid: 'btn btn-solid',
  ink: 'btn btn-ink',
  glass: 'btn btn-glass',
  outline: 'btn btn-outline'
}

/* One button, four skins. Renders as <a> when given href, <button> otherwise. */
export default function Button({
  children,
  href,
  onClick,
  variant = 'solid',
  arrow = true,
  className = '',
  ...rest
}) {
  const cls = `${VARIANTS[variant] || VARIANTS.solid} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? <Icon name="arrow" className="btn-arrow h-4 w-4" strokeWidth={1.6} /> : null}
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  )
}
