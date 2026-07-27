import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const Server_Url = import.meta.env.VITE_SERVER_URL
  const token = localStorage.getItem("token");

  const formik = useFormik({
    initialValues: {
      shippingAddress: '',
    },
    validationSchema: Yup.object({
      shippingAddress: Yup.string().required('Shipping address is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) {
        toast.error("Please log in to checkout", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        });
        navigate("/signin");
        return;
      }

      try {
        const res = await axios.post(
          `${Server_Url}/cart/checkout`,
          { shippingAddress: values.shippingAddress },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.data.status) {
          toast.error(res.data.message || "Unable to start checkout", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        });
          return;
        }

        setRedirecting(true);
        window.location.href = res.data.authorization_url;
      } catch (err) {
        toast.error(err.response?.data?.message || "Checkout failed. Please try again.", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  if (!token) {
    return (
      <div className="checkout-page">
        <p>You need to be logged in to checkout.</p>
      </div>
    );
  }
  const getCart = ()=>{
    navigate("/cart")
  }
  return (
    <>
    <nav
      className="checkout-navbar"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer"
      }}>
      <div style={{ margin: 0 }} className='checkout-nav-text'>
        <svg className='slyIcon' width="32" height="24" viewBox="0 0 729 779" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60.5 360L403 0L267 268L417.5 251.5L72 654.5L228.5 333.5L60.5 360Z" fill="url(#paint0_linear_2_7)"/>
      <path d="M149.5 663.5L465.5 254L331.5 568L492.5 602L149.5 663.5Z" fill="url(#paint1_linear_2_7)"/>
      <path d="M559.5 602C548.964 483.288 539.313 403.361 492.5 268C492.5 268 572.325 311.631 597.682 350.508C607.452 340.271 685.586 272.397 729 268C637.471 366.061 581.356 538.732 559.5 602Z" fill="url(#paint2_linear_2_7)"/>
      <path d="M31.5 754.5L0 687.5C51.4269 706.958 113.283 702.495 264.5 675.5C360.88 657.454 544.08 634.508 690.5 638.5C468.31 668.129 344.469 695.225 124 749.5L196.5 779L31.5 754.5Z" fill="url(#paint3_linear_2_7)"/>
      <defs>
      <linearGradient id="paint0_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60A5FA"/>
      <stop offset="0.243919" stop-color="#3B82F6"/>
      <stop offset="0.794452" stop-color="#1D4ED8"/>
      <stop offset="1" stop-color="#172554"/>
      </linearGradient>
      <linearGradient id="paint1_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60A5FA"/>
      <stop offset="0.243919" stop-color="#3B82F6"/>
      <stop offset="0.794452" stop-color="#1D4ED8"/>
      <stop offset="1" stop-color="#172554"/>
      </linearGradient>
      <linearGradient id="paint2_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60A5FA"/>
      <stop offset="0.243919" stop-color="#3B82F6"/>
      <stop offset="0.794452" stop-color="#1D4ED8"/>
      <stop offset="1" stop-color="#172554"/>
      </linearGradient>
      <linearGradient id="paint3_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60A5FA"/>
      <stop offset="0.243919" stop-color="#3B82F6"/>
      <stop offset="0.794452" stop-color="#1D4ED8"/>
      <stop offset="1" stop-color="#172554"/>
      </linearGradient>
      </defs>
</svg>
      </div>
    
      <button onClick={getCart} className='checkout-nav-btn'
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}>← Back to Cart</button>
    </nav>
    
    <div className="checkout-page">
      <div className="checkout-card">
        <h1 className="checkout-title">Checkout</h1>

        <form onSubmit={formik.handleSubmit} className="checkout-form">
          <label className="checkout-label">
            Shipping Address:
            <textarea
              name="shippingAddress"
              placeholder="Street, City, State"
              className="checkout-textarea"
              value={formik.values.shippingAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
            />
          </label>
          {formik.touched.shippingAddress && (
            <small className="field-error">{formik.errors.shippingAddress}</small>
          )}

          <button type="submit" className="checkout-submit" disabled={formik.isSubmitting || redirecting}>
            {redirecting? "Redirecting to payment..." : formik.isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default Checkout