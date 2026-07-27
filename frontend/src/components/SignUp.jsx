import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import './SignUp.css'

const SignUp = () => {
  const [serverError, setServerError] = useState("")
  const navigate = useNavigate()
  const Server_Url = import.meta.env.VITE_SERVER_URL
  const formik = useFormik({
  initialValues: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: ''
  },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string(),
      email: Yup.string().email('Please enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmpassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
  }),
    onSubmit: async (values, {setSubmitting}) => {
      try{
        const res = await axios.post(`${Server_Url}/auth/signup`, values)
        if(!res.data.status){ 
          setServerError(res.data.message || "unable to register")
          return;
        }
        localStorage.setItem("token", res.data.token)
        navigate("/")
     }catch(err){
        setServerError(err.response?.data?.message || 'SignUp failed. Please try again.');
     }finally{
      setSubmitting(false)
     }
  },
  });
  console.log(formik)
  return (
    <div className="auth-page">
      <form className="auth-card" action="" onSubmit={formik.handleSubmit}>
        <h1 className="auth-title">Create Account</h1>

        {serverError && (
          <div className="auth-error">
            {serverError} <Link to="/signin">Sign In</Link>
          </div>
        )}

        <div className="form-group">
          <input 
          type="text" 
          placeholder='First Name'
          name='firstname'
          className="auth-input"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          />
          {formik.touched.firstname && (<small className="field-error">{formik.errors.firstname}</small>)}
        </div>

        <div className="form-group">
          <input 
          type="text" 
          placeholder='Last Name'
          name='lastname'
          className="auth-input"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          />
          {formik.touched.lastname && (<small className="field-error">{formik.errors.lastname}</small>)}
        </div>

        <div className="form-group">
          <input 
          type="text" 
          placeholder='Email'
          name='email'
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
          placeholder='Password'
          name='password'
          className="auth-input"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          />
          {formik.touched.password && (<small className="field-error">{formik.errors.password}</small>)}
        </div>

        <div className="form-group">
          <input 
          type="password" 
          placeholder='Confirm Password'
          name='confirmpassword'
          className="auth-input"
          value={formik.values.confirmpassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          />
          {formik.touched.confirmpassword && (<small className="field-error">{formik.errors.confirmpassword}</small>)}
        </div>

        <button type='submit' className="auth-submit">
          {formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p className="auth-switch">Already have an account? <Link to="/signin">Sign In</Link></p>
      </form>
    </div>
  )
}

export default SignUp