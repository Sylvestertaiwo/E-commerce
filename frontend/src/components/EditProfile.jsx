import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import Navbar from './Navbar'
import './Account.css'

const EditProfile = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(true)
  const Server_Url = import.meta.env.VITE_SERVER_URL
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string(),
      email: Yup.string().email('Please enter a valid email').required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.put(`${Server_Url}/auth/me`, values, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.data.status) {
          toast.error(res.data.message || "Unable to update profile", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
          return
        }
        toast.success("Profile updated", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
        navigate("/account")
      } catch (err) {
        toast.error(err.response?.data?.message || "Update failed. Please try again.", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (!token) {
      navigate("/signin")
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${Server_Url}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        formik.setValues({
          firstname: res.data.user.firstname || '',
          lastname: res.data.user.lastname || '',
          email: res.data.user.email || '',
        })
      } catch (err) {
        toast.error("Unable to load your profile", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="account-page">
          <p className="account-message">Loading your profile...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="account-page">
        <div className="account-card">
          <h1 className="account-title">Edit Profile</h1>

          <form onSubmit={formik.handleSubmit} className="account-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstname"
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
                  placeholder="Last Name"
                  name="lastname"
                  className="auth-input"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastname && (<small className="field-error">{formik.errors.lastname}</small>)}
              </div>
            </div>

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

            <button type="submit" className="auth-submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProfile