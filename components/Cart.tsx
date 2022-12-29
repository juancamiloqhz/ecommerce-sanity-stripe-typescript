import Link from 'next/link'
import React from 'react'
import { toast } from 'react-hot-toast'
import { AiOutlineLeft, AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'
import { StateTypes } from '../context/reducers'
import { useAppContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import getStripe from '../lib/getStripe'

const Cart = () => {
  const ref = React.useRef<HTMLDivElement>(null)
  const context = useAppContext()

  async function handleCheckout() {
    // console.log('checkout')
    const stripe = await getStripe()
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(context.state.cartItems)
    })
    console.log({ response })
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
    <div className='cart-wrapper' ref={ref}>
      <div className="cart-container">
        <button 
          type="button"
          className='cart-heading'
          onClick={() => context.dispatch({ type: StateTypes.ToggleCart, payload: !context.state.showCart })}
        >
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({ context.state.totalQuantities } items)</span>
        </button>
        {context.state.cartItems.length < 1 ? (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href='/'>
              <button 
                type="button"
                className="btn"
                onClick={() => context.dispatch({ type: StateTypes.ToggleCart, payload: !context.state.showCart })}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className='product-container'>
            {context.state.cartItems.map((cartItem) => (
              <div className="product" key={cartItem.product._id}>
                <img src={urlFor(cartItem.product.image[0])} alt={cartItem.product.name} className="cart-product-image" />
                
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{cartItem.product.name}</h5>
                    <h4>${cartItem.product.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span className="minus"
                          onClick={() => {
                            if (cartItem.quantity > 1) {
                              context.dispatch({ type: StateTypes.DeleteOneFromCartItem, payload: cartItem })
                              context.dispatch({ type: StateTypes.DeleteFromTotalPrice, payload: cartItem.product.price })
                              context.dispatch({ type: StateTypes.DeleteFromTotalQuantity, payload: 1 })
                            }}
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">
                          {cartItem.quantity}
                        </span>
                        <span className="plus"
                          onClick={() => {
                            context.dispatch({ type: StateTypes.AddOneToCartItem, payload: cartItem })
                            context.dispatch({ type: StateTypes.AddToTotalPrice, payload: cartItem.product.price })
                            context.dispatch({ type: StateTypes.AddToTotalQuantity, payload: 1 })
                          }}
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button type="button" className='remove-item'
                      onClick={() => {
                        context.dispatch({ type: StateTypes.DeleteFromCart, payload: cartItem })
                        context.dispatch({ type: StateTypes.DeleteFromTotalPrice, payload: cartItem.product.price * cartItem.quantity })
                        context.dispatch({ type: StateTypes.DeleteFromTotalQuantity, payload: cartItem.quantity })
                      }}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {context.state.cartItems.length > 0 ? (
          <div className="cart-bottom">
            <div className="total">
              <h3>Total</h3>
              <h3>${context.state.totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>Pay With Stripe</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Cart