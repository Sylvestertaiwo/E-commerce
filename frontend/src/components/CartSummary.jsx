import { useNavigate } from 'react-router-dom';
import './cartSummary.css'

const CartSummary = ({ items = [] }) => {
  const navigate = useNavigate()
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.retailPrice * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    
    <div className="cart-summary">
      <h2 className="cart-summary-title">Order summary</h2>

      <div className="cart-summary-row">
        <span>Subtotal · {itemCount} item{itemCount > 1 ? "s" : ""}</span>
        <span>₦{subtotal.toLocaleString()}</span>
      </div>

      <div className="cart-summary-row">
        <span>Shipping</span>
        <span className="cart-summary-free">Calculated at checkout</span>
      </div>

      <div className="cart-summary-divider" />

      <div className="cart-summary-row cart-summary-row--total">
        <span>Total</span>
        <span>₦{subtotal.toLocaleString()}.00</span>
      </div>

      <button
        className="cart-summary-btn"
        onClick={()=>navigate("/checkout")}
        disabled={items.length === 0}
        type="button"
      >
        Checkout
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <p className="cart-summary-note">
        <svg style={{transform: "translateY(-2px)"}} width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <rect x="2.5" y="6" width="8" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4.2 6V4.2a2.3 2.3 0 0 1 4.6 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        Secure checkout
      </p>
    </div>
  );
};

export default CartSummary;
