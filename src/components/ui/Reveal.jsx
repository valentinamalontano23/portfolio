import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/* Scroll-triggered entrance. Honours prefers-reduced-motion by rendering the
   final state immediately instead of animating to it. */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 26,
  x = 0,
  duration = 0.85,
  className = '',
  once = true,
  ...rest
}) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div

  if (reduce) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <M
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-8% 0px -6% 0px' }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  )
}

export { EASE }
