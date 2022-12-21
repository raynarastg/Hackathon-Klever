import React from 'react';
import Link from 'next/link';
import {AiOutlineShopping, AiOutlineSearch} from 'react-icons/ai';
import {Cart} from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/router';

const Navbar = () => {
  const {showCart, setShowCart, totalQuantities} = useStateContext();
  const routes = useRouter();
  return (
    <div className='navbar-container'>
       <p className='logo'>
          <Link href="/">G3 Store</Link>  
       </p>
       {routes.asPath !== '/success' && (
       <div className='input-nav-container'>
       <input type='text' className='input-nav'/>
       <AiOutlineSearch className='input-nav-icon'/>
       </div>
       )}
      <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}>
          <AiOutlineShopping />
          <span className='cart-item-qty'>{totalQuantities}</span>
      </button>
      {showCart && <Cart />}
    </div>
  )
}

export default Navbar;
