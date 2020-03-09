import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { read, update, updateUser } from './apiUser'
import DefaultProfile from '../images/avatar.jpg'

const EditProfile = ({match}) => {
    const [values, setValues] = useState({
        user: '',
        id: '',
        name: '',
        email: '',
        redirectToSignup: false,
        error: '',
        password: '',
        photo: '',
        about: '',
        formData: '',
        fileSize: 0,
        loading: false
    })

    const { 
        user,
        id, 
        name, 
        email, 
        password, 
        redirectToSignup, 
        error,
        about,
        formData,
        loading,
        fileSize
    } = values
    const userId = match.params.userId
    

    const redirect = () => {
        if(redirectToSignup) {
            return <Redirect to={`/user/${id}`} />
        }
    }

    const isValid = () => {
        if(fileSize > 100000) {
            setValues({ ...values, error: 'File size should be less then 100kb' })
            return false
        }
        if(name.length === 0) {
            setValues({...values, error: 'Name is required', loading: false})
            return false
        }
        if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setValues({...values, error: 'A valid Email is required', loading: false})
            return false
        }
        if(password.length >= 1 && password.length <= 5) {
            setValues({
                ...values, error: 'Password must be at least 6 characters long',
                loading: false
            })
            return false
        }
        return true
    }

    const showError = () => (
        <div
            className='alert alert-danger'
            style={{display: error ? '' : 'none'}}
        >
            {error}
        </div>
    )

    const init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error) {
                setValues(prev => ({ ...prev, redirectToSignup: true }))
            } else {
                setValues(prev => ({
                    ...prev,
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    user: data,
                    about: data.about,
                    formData: new FormData()
                }))
            }
        })
    }
    
    useEffect(() => {
        init(userId)
    }, [userId])

    const handleChange = name => event => {
        const value =
            name === 'photo' ? event.target.files[0] : event.target.value
        const fileSize = name === 'photo' ? event.target.files[0].size : 0
        formData.set(name, value)
        setValues({ ...values, [name]: value, fileSize })
    }

    const clickSubmit = event => {
        setValues({...values, loading: true})
        const tokenjwt = isAuthenticated().token
        event.preventDefault()
        if(isValid()) {
            setValues({ ...values, error: false, fileSize })
            // console.log(values)
            // const updatePassword = {password: password || undefined}
            update(userId, tokenjwt, formData)
            .then(data => {
                if(data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    updateUser(data, () => {
                        setValues({
                            ...values,
                            name: '',
                            email: '',
                            password: '',
                            redirectToSignup: true,
                            loading: false
                        })
                    })
                }
            })
        }
    }
    const loadingfile = () => (
        loading && (
            <div className="jumbotron text-center">
                <h2>Loading...</h2>
            </div>
        )
    )
    const updatedForm = () => (
        <form>
            <div className='form-group'>
                <label className='btn btn-secondary'>
                    <input
                        onChange={handleChange('photo')}
                        type='file'
                        name='photo'
                        accept='image/*'
                    />
                </label>
            </div>
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
                <label className='text-muted'>About</label>
                <textarea
                    onChange={handleChange('about')}
                    type='text'
                    className='form-control'
                    value={about}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>password</label>
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
                Update
            </button>
        </form>
    )

    const photoUrl = user.photo !== undefined
        ? `${process.env.REACT_APP_API_URL
            }/user/photo/${id}?${new Date().getTime()}`
        : DefaultProfile

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Edit Profile</h2>
            {loadingfile()}
            {showError()}
            <img
                style={{ height: '200px', width: 'auto' }}
                className='img-thumbnail'
                src={photoUrl} 
                alt={userId.name} 
            />
            {updatedForm()}
            {redirect()}
        </div>
    )
}

export default EditProfile
