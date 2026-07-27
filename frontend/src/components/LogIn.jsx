import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as Yup from 'yup'
import './SignUp.css'
import { toast } from 'react-toastify'

const LogIn = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const Server_Url = import.meta.env.VITE_SERVER_URL
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Please enter a valid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        const res = await axios.post(`${Server_Url}/auth/login`, values);

        if (!res.data.status) {
          setServerError(res.data.message || 'Login failed');
          return;
        }

        localStorage.setItem('token', res.data.token);

        navigate('/');
      } catch (err) {
        setServerError(err.response?.data?.message || 'Login failed. Please try again.');
        toast.error(err.response?.data?.message || 'Login failed. Please try again.', {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={formik.handleSubmit}>
        <h1 className="auth-title">Welcome Back</h1>

        {serverError && <div className="auth-error">{serverError}</div>}

        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="auth-input"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && (<small className="field-error">{formik.errors.email}</small>)}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="auth-input"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && (<small className="field-error">{formik.errors.password}</small>)}
        </div>

        <button type="submit" className="auth-submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  )
}

export default LogIn