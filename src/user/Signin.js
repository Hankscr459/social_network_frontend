import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { signin, authenticate } from '../auth'

const Signin = () => {
    const [values, setValues] = useState({
        email:'',
        password:'',
        error: '',
        redirectToReferer: false,
        loading: false
    })
    const { email, password, error, redirectToReferer, loading } = values
    const redirectUser = () => {
        if(redirectToReferer) {
            return <Redirect to='/' />
        }
    }
    
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, error: false, loading: true  })
        // console.log(user)
        signin({ email, password})
        .then(data => {
            if(data.error) {
                setValues({ ...values, error: data.error, loading: false })
            } else {
                // authenticate
                authenticate(data, () => {
                    setValues({
                        ...values,
                        redirectToReferer: true
                    })
                })
                // redirect
            }
        })
    }

    const signinForm = () => (
        <>
            <form>
                <div className='form-group'>
                    <label className='text-muted'>Email</label>
                    <input
                        onChange={handleChange('email')}
                        type='email'
                        className='form-control'
                        value={email}
                    />
                </div>
                <div className='form-group'>
                    <label className='text-muted'>Password</label>
                    <input
                        onChange={handleChange('password')}
                        type='password'
                        className='form-control'
                        value={password}
                    />
                </div>
                <button
                    onClick={clickSubmit}
                    className='btn btn-raised btn btn-primary'
                >
                    Submit
                </button>
            </form>
            <p>
                <Link to="/forgot-password" className="text-danger">
                    {" "}
                    Forgot Password
                </Link>
            </p>
        </>
    )
    
    const showLoading = () => (
        loading && (
            <div className='jumbotron text-center'>
                <h2>Loading...</h2>
            </div>
        )
    )

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>SignIn</h2>
            {showLoading()}
            <div
                className='alert alert-danger'
                style={{ display: error ? '' : 'none' }}
            >
                {error}
            </div>
            {signinForm()}
            {redirectUser()}
        </div>
    )
}

export default Signin