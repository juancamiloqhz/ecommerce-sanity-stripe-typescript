import Link from 'next/link'
import React from 'react'
import { Banner } from '../@types/types'
import { urlFor } from '../lib/client'

const FooterBanner = ({ banner }: { banner: Banner }) => {
  return (
    <div className='footer-banner-container'>
      <div className="banner-desc">
        <div className="left">
          <p>{banner.discount}</p>
          <h3>{banner.largeText1}</h3>
          <h3>{banner.largeText2}</h3>
          <p>{banner.saleTime}</p>
        </div>
        <div className="right">
          <p>{banner.smallText}</p>
          <h3>{banner.middleText}</h3>
          <p>{banner.desc}</p>
          <Link href={`/product/${banner.product}`}>
            <button type='button'>
              {banner.buttonText}
            </button>
          </Link>
        </div>
        <img src={urlFor(banner.image)} alt="headphones"  className='footer-banner-image'/>
      </div>
    </div>
  )
}

export default FooterBanner