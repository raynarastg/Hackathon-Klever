import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import klever from '../lib/klever';
import { useRouter } from 'next/router'


const donateInfo = {
  'amigo': {
    title: 'Saiba mais sobre: Amigo Não se Compra',
    url: 'https://polen.com.br/amigonaosecompra'
  },
  'mulheres': {
    title: 'Saiba mais sobre: WoMakersCode - Mulheres na Tecnologia',
    url: 'https://polen.com.br/womakerscode'
  },
  'dorinha': {
    title: 'Saiba mais sobre: Fundação Dorina Nowill para Cegos',
    url: 'https://polen.com.br/fundacao-dorina-nowill'
  },
  'cannabis': {
    title: 'Saiba mais sobre: Instituto cannabis do bem',
    url: 'https://polen.com.br/institutocannabisdobem'
  }
}

const addressStorage = /* process.env.NEXT_ADRESS_STORE || */ 'klv1dg6msltdzcgp9ega584prn5cqwc5rjwhvqdrtd4jze32nuyjmuzsazj5sq';

const Cart = () => {
  const cartRef = useRef();
  const {totalPrice, totalQuantities, cartItems, setShowCart, 
    toggleCartItemQuantity, onRemove,} = useStateContext();
  
  const [isDonate, setIsDonate] = useState(false);
  const [subTotal, setSubTotal] = useState(totalPrice);
  const [donate, setDonate] = useState({
    title: 'Saiba mais sobre: Amigo Não se Compra',
    url: 'https://polen.com.br/amigonaosecompra'
  });
  const [loading, setLoading] = useState(false)
  const router = useRouter();

    const fetchBalance = async () => {
      const amount = await klever.balance();
      const currencyNormalizeMultiplier = Math.pow(10, 6);
  
       return (amount / currencyNormalizeMultiplier);
    };

    const handleCheckout = async () => {
      setLoading(true)
      if (!window.kleverWeb) {
        alert('KleverWeb is not installed');
        return '';
      }
      const address = await klever.connectWithSdk();
      if (!address.startsWith('klv')) {
        console.log(address);
      }
      const money = await fetchBalance();
      if (parseInt(money) < subTotal) return alert("You don't have enough balance")

      const pay = await klever.send(addressStorage, subTotal)
      if (pay.code === 'successful') {
        router.push('/success');
        return;
      }
      setLoading(false)
      console.log(pay);
      alert('Payment error, check the kleverWeb extension and try again');
    };

  useEffect(() => {
   if(!isDonate) {
    setSubTotal(totalPrice);
   }
  }, [isDonate])

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
          type='button'
          className='cart-heading'
          onClick={() => setShowCart(false)}>
            <AiOutlineLeft />
            <span className='heading'>Your Cart</span>
            <span className='cart-num-items'>({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150}/>
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className='btn'
              >Continue Shopping
              </button>
            </Link>
          </div>
        )}
        <div className='product-container'>
          {cartItems.length >= 1 && cartItems.map((item, index) => (
            <div className='product' key={item._id}>
              <img src={urlFor(item?.image[0])}
                   className='cart-product-image' />
              <div className='item-desc'>
                <div className='flex top'>
                  <h5>{item.name}</h5>
                  <h4>klv {item.price}</h4>
                </div>
                <div className='flex bottom'>
                  <div>
                  <p className='quantity-desc'>
                    <span className='minus' onClick={() => toggleCartItemQuantity(item._id, 'dec')}>
                      <AiOutlineMinus />
                    </span>
                    <span className='num' onClick=''>
                    {item.quantity}
                    </span>
                    <span className='plus' onClick={() => toggleCartItemQuantity(item._id, 'inc')}>
                      <AiOutlinePlus />
                    </span>
                  </p>
                  </div>
                  <button
                    type="button"
                    className="remove-item"
                    onClick={ () => onRemove(item) }
                  ><TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length >=1 && (
          <div className='donate-container'>
            <h4>Make a donation</h4>
            <div className='donate-select'>
            <input type='checkbox' checked={isDonate} onChange={({target}) => setIsDonate(target.checked)} />
            <select className='select' disabled={!isDonate} onChange={({target}) => setDonate(donateInfo[target.value])} >
              <option
                value='amigo'
              >Amigo Não se Compra</option>
              <option
              value='mulheres'
              >WoMakersCode - Mulheres na Tecnologia</option>
              <option
              value='dorinha'
              >Fundação Dorina Nowill para Cegos</option>
              <option
              value='cannabis'
              >Instituto cannabis do bem</option>
            </select>
            <select className='select' disabled={!isDonate} onChange={({target}) => {
            setSubTotal(totalPrice + Number(target.value))
            }}>
              <option value={0}>klv 0</option>
              <option value={10}>klv 10</option>
              <option value={20}>klv 20</option>
              <option value={30}>klv 30</option>
              <option value={40}>klv 40</option>
            </select>
          </div>
          {isDonate && <a href={donate.url} target='_blank'>{donate.title}</a>}
        </div>
        )}
        {cartItems.length >=1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal</h3>
              <h3>klv {subTotal}</h3>
            </div>
            <div className="btn-container">
              {!loading ? (
              <button
                type="button"
                className="btn"
                onClick={handleCheckout}
              >
                Pay with Klever
              </button>
              ) : (
                <button
                type="button"
                className="imageLoading"
                onClick={handleCheckout}
              >
                <img src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' className='loading'/>
              </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
