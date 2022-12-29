import { GetStaticProps } from 'next'
import React from 'react'
import { toast } from 'react-hot-toast'
import { AiFillStar, AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai'
import { Product as ProductType } from '../../@types/types'
import { Product } from '../../components'
import { StateTypes } from '../../context/reducers'
import { useAppContext } from '../../context/StateContext'
import { client, urlFor } from '../../lib/client'
import getStripe from '../../lib/getStripe'


export const getStaticPaths = async () => {
  const products = await client.fetch(
    `*[_type == "product"]{
      slug {
        current
      }
    }`
  )
  const paths = products.map((product: ProductType) => ({
    params: { slug: product.slug.current }
  }))

  return { paths, fallback: 'blocking' }
}

type Props = {
  product: ProductType
  products: ProductType[]
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const product = await client.fetch(
    `*[_type == "product" && slug.current == '${params?.slug}'][0]`
  )
  const products = await client.fetch(
    `*[_type == "product"]`
  ) 

  // console.dir({ product }, { depth: null })
  return {
    props: {
      product,
      products
    },
  }
}

const ProductDetails = ({ product, products }: { product: ProductType, products: ProductType[] }) => {
  const [index, setIndex] = React.useState(0)
  const context = useAppContext()

  async function handleBuyNow() {
    const stripe = await getStripe()
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        product,
        quantity: context.state.quantity
      }])
    })
    // console.log({ response })
    if (response.status === 500) {
      console.error(response)
      return
    }
    const data = await response.json()

    toast.loading('Redirecting to checkout...')
    try {
      await stripe?.redirectToCheckout({ sessionId: data.id })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img 
              src={urlFor(product.image && product.image[index])}
              alt={product.name}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {product.image.map((image, i) => (
              <img 
                key={i}
                src={urlFor(image)}
                alt={product.name}
                className={`small-image${index === i ? ' selected-image' : ''}`}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{product.name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{product.description}</p>
          <p className="price">${product.price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus"
                onClick={() => {
                  if (context.state.quantity > 1) {
                    context.dispatch({ type: StateTypes.SetQuantity, payload: context.state.quantity - 1 })
                  }
                }}
              >
                <AiOutlineMinus />
              </span>
              <span className="num">
                {context.state.quantity}
              </span>
              <span className="plus"
                onClick={() => context.dispatch({ type: StateTypes.SetQuantity, payload: context.state.quantity + 1 })}
              >
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button type="button" className="add-to-cart"
              onClick={() => {
                context.dispatch({ type: StateTypes.AddToCart, payload: { product, quantity: context.state.quantity } })
                context.dispatch({ type: StateTypes.AddToTotalPrice, payload: product.price * context.state.quantity })
                context.dispatch({ type: StateTypes.AddToTotalQuantity, payload: context.state.quantity })
                // context.dispatch({ type: StateTypes.ToggleCart, payload: true })
                // context.dispatch({ type: StateTypes.SetQuantity, payload: 1 })
                toast.success(`${context.state.quantity} ${product.name} added to cart`)
              }}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((product, index) => (
              <Product product={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails