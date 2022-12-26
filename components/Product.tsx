import Link from 'next/link'
import React from 'react'
import { Product } from '../@types/types'
import { urlFor } from '../lib/client'

const Product = ({ product }: { product: Product }) => {
  return (
    <div>
      <Link href={`/product/${product.slug.current}`}>
        <div className='product-card'>
          <img src={urlFor(product.image && product.image[0])} alt={product.name} width={250} height={250} className="product-image" />
          <p className="product-name">{product.name}</p>
          <p className="product-price">${product.price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product