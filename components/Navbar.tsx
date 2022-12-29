import Link from 'next/link'
import React from 'react'
import { AiOutlineShopping } from 'react-icons/ai'
import { StateTypes } from '../context/reducers'
import { useAppContext } from '../context/StateContext'
import { Cart } from './'

const Navbar = () => {
  const context = useAppContext()
  return (
    <div className="navbar-container">
      <p className='logo'>
        <Link href='/'>Ecommerce Store</Link>
      </p>
      <button className="cart-icon" type='button' onClick={
        () => context.dispatch({ type: StateTypes.ToggleCart, payload: !context.state.showCart })
      }>
        <AiOutlineShopping />
        <span className="cart-item-qty">{context.state.totalQuantities}</span>
      </button>

      {context.state.showCart ? <Cart /> : null}
    </div>
  )
}

export default Navbar