import React from 'react'
import { useAppContext } from '../context/StateContext'
import { BsBagCheckFill } from 'react-icons/bs'
import Link from 'next/link'
import { StateTypes } from '../context/reducers'
import { runFireworks } from '../lib/utils'

const Success = () => {
  const context = useAppContext()

  React.useEffect(() => {
    localStorage.clear()
    context.dispatch({ type: StateTypes.ClearCart, payload: null })
    context.dispatch({ type: StateTypes.ClearTotalPrice, payload: null })
    context.dispatch({ type: StateTypes.ClearTotalQuantity, payload: null })
    context.dispatch({ type: StateTypes.SetQuantity, payload: 1 })
    runFireworks()
  }, [])
  return (
    <div className='success-wrapper'>
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order</h2>
        <p className="email-msg">
          Check your email for order confirmation
        </p>
        <p className="description">
          If you have any questions, please contact us at <a href="mailto:hello@ecommerce.com">hello@ecommerce.com</a>
        </p>
        <Link href='/'>
          <button
            type="button"
            // width="300px"
            className="btn"
            // onClick={() => context.dispatch({ type: StateTypes. })}
          >
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Success