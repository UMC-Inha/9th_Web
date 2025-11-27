import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    increase, 
    decrease, 
    removeItem, 
    clearCart, 
    calculateTotals 
} from './cartSlice';

interface RootState {
    cart: {
        items: Array<{ id: number | string; name: string; price: number; amount: number; }>;
        amount: number;
        total: number;
    };
}

const CartComponent: React.FC = () => {
    const { items: cartItems, amount, total } = useSelector(
        (state: RootState) => state.cart
    );
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(calculateTotals());
    }, [cartItems, dispatch]); 

    if (cartItems.length === 0) {
        return (
            <section className="cart">
                <header>
                    <h2>장바구니</h2>
                    <h4 className="empty-cart">담긴 상품이 없습니다.</h4>
                </header>
            </section>
        );
    }

    return (
        <section className="cart">
            <header>
                <h2>장바구니</h2>
            </header>
            <div>
                {cartItems.map((item) => (
                    <article key={item.id} className="cart-item">
                        <img src={`/images/${item.id}.jpg`} alt={item.name} />
                        <div>
                            <h4>{item.name}</h4>
                            <h4 className="item-price">₩{item.price}</h4>
                            <button 
                                className="remove-btn"
                                onClick={() => dispatch(removeItem(item.id))}
                            >
                                제거
                            </button>
                        </div>
                        <div>
                            <button 
                                className="amount-btn" 
                                onClick={() => dispatch(increase(item.id))}
                            >
                                ▲
                            </button>
                            <p className="amount">{item.amount}</p>
                            <button 
                                className="amount-btn" 
                                onClick={() => dispatch(decrease(item.id))}
                            >
                                ▼
                            </button>
                        </div>
                    </article>
                ))}
            </div>
            
            <footer>
                <hr />
                <div className="cart-total">
                    <h4>
                        총 금액 <span>₩{total.toFixed(2)}</span>
                    </h4>
                    <h4>
                        총 수량 <span>{amount}개</span>
                    </h4>
                </div>
                <button 
                    className="btn clear-btn"
                    onClick={() => dispatch(clearCart())}
                >
                    장바구니 비우기
                </button>
            </footer>
        </section>
    );
};

export default CartComponent;