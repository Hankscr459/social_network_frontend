import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../auth'

const Signup = () => {
    const [values, setValues] = useState({
        name:'',
        email:'',
        password:'',
        error: '',
        open: false
    })
    const { name, email, password, error, open } = values
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, error: false })
        // console.log(user)
        signup({name, email, password})
        .then(data => {
            if(data.error) {
                setValues({ ...values, error: data.error, open: false })
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    open: true
                })
            }
        })
    }

    const signupForm = () => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input
                    onChange={handleChange('name')}
                    type='text'
                    className='form-control'
                    value={name}
                />
            </div>
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
    )

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Signup</h2>
            <div
                className='alert alert-danger'
                style={{ display: error ? '' : 'none' }}
            >
                {error}
            </div>
            <div
                className='alert alert-info'
                style={{ display: open ? '' : 'none' }}
            >
                New account is successfully created. Please Sign In.
                <Link to='/signin'>Sign In</Link>
            </div>
            {signupForm()}
        </div>
    )
}

export default Signup
