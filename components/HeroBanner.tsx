import Link from 'next/link'
import React from 'react'
import { Banner } from '../@types/types'
import { urlFor } from '../lib/client'

const HeroBanner = ({ banner }: { banner: Banner }) => {
  return (
    <div className='hero-banner-container'>
      <div>
        <p className="beats-solo">{banner.smallText}</p>
        <h3>{banner.middleText}</h3>
        <h1>{banner.largeText1}</h1>
        <img src={urlFor(banner.image)} alt="headphones"  className='hero-banner-image'/>
      </div>
      <div>
        <Link href={`/product/${banner.product}`}>
          <button type='button'>
            {banner?.buttonText}
          </button>
        </Link>
        <div className="desc">
          <h5>Description</h5>
          <p>{banner.desc}</p>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner