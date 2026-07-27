import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup' 
import Navbar from './Navbar'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
    const navigate = useNavigate()
    const Server_Url = import.meta.env.VITE_SERVER_URL
    const token = localStorage.getItem("token")
    const [error, setError] = useState(null)
    let formik = useFormik({
        initialValues: {
            password: "",
            newpassword: "",
            confirmnewpassword : ""
        },
        validationSchema : yup.object({
            password: yup.string().required("password field is required"),
            newpassword : yup.string().required("New password is required").min(6, "Password must not be less than 6 characters"),
            confirmnewpassword : yup.string().required("Please confirm your password").oneOf([yup.ref("newpassword")], "Password must match")
        }),
        onSubmit : async (value, {setSubmitting})=>{
            try{
                const res = await axios.patch(`${Server_Url}/auth/changePassword`, value, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!res.data.status) {
                  toast.error(res.data.message || "Unable to update profile")
                  setError(res.data.message)
                  return
                }
                toast.success("Password updated")
                navigate("/account")
            }catch(err){
                const message = err.response?.data?.message || "Unable to update password. Try again."
                setError(message === "invalid token" ? "You need to sign in to change your password" : message)
                toast.error(message)
            }finally{
                setSubmitting(false)
            }
        }
    })
  return (
    <>
    <Navbar/>
        <div className="account-page">
            <div className="account-card">
                <h1 className="account-title">Update Password</h1>
                {error && <div className="auth-error">{error}</div>}
                <form action="" onSubmit={formik.handleSubmit}>
                    <div className='form-group'>
                    <input type="password" className='auth-input' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Password' name='password'/>
                    {formik.touched.password && <small className="field-error">{formik.errors.password}</small>}
                    
                    <input type="password" className='auth-input' value={formik.values.newpassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='New Password' name='newpassword'/>
                    {formik.touched.newpassword && <small className="field-error">{formik.errors.newpassword}</small>}
                    
                    <input type="password" className='auth-input' value={formik.values.confirmnewpassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Confirm New Password' name='confirmnewpassword'/>
                    {formik.touched.confirmnewpassword && <small className="field-error">{formik.errors.confirmnewpassword}</small>}
                    </div>
                    <button className='auth-submit' type='submit'>{formik.isSubmitting ? "Updating..." : "Update"}</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default ChangePassword