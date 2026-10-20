import { usingPlaceholderVisuals } from '../../data/site'

/* Every image on the site goes through here: lazy by default, always with an
   aspect ratio so nothing jumps while it loads, and a small honest badge while
   the artwork is still a stand-in. */
export default function Media({
  src,
  alt,
  ratio = '4 / 5',
  className = '',
  imgClassName = '',
  eager = false,
  badge = true,
  position = 'center',
  children
}) {
  return (
    <div className={`media ${className}`} style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        style={{ objectPosition: position }}
        className={imgClassName}
      />
      {badge && usingPlaceholderVisuals ? <span className="ph-chip">Placeholder</span> : null}
      {children}
    </div>
  )
}
