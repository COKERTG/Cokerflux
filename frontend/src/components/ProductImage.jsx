import { useState } from 'react'

/**
 * Lazy product image: shows a shimmer skeleton until loaded,
 * then fades in. Wraps the image in a relative container so the
 * shimmer sits behind it at the same size.
 *
 * Pass all normal <img> props; `className` applies to the <img> itself.
 * `wrapperClassName` applies to the outer container div.
 */
export default function ProductImage({ src, alt = '', className = '', wrapperClassName = '', ...props }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Shimmer skeleton — hidden once image loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-surface animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  )
}
