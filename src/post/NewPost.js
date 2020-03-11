import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { create } from './apiPost'
// import DefaultProfile from '../images/avatar.jpg'

const NewPost = () => {
    const [values, setValues] = useState({
        title: '',
        body: '',
        photo: '',
        error: '',
        user: {},
        fileSize: 0,
        formData: '',
        redirectToProfile: false,
        loading: false
    })

    useEffect(() => {
        setValues(prev => ({
            ...prev, 
            formData: new FormData(),
            user: isAuthenticated().user
        }))
    }, [])

    const {
        user,
        title,
        body,
        loading,
        redirectToProfile, 
        fileSize,
        error,
        formData
    } = values
    const userId = isAuthenticated().user._id

    const isValid = () => {
        if( fileSize > 100000) {
            setValues({ ...values, error: 'File size should be less then 100kb', loading: false })
            return false
        }
        if(title.length === 0 || body.length === 0) {
            setValues({...values, error: 'All field are required', loading: false})
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
            create(userId, tokenjwt, formData)
            .then(data => {
                if(data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    // console.log('New Post: ', data)
                    setValues({ 
                        ...values,
                        title: '',
                        body: '',
                        photo: '',
                        redirectToProfile: true
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
    const newPostForm = () => (
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
                <label className='text-muted'>Title</label>
                <input
                    onChange={handleChange('title')}
                    type='text'
                    className='form-control'
                    value={title}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Body</label>
                <textarea
                    onChange={handleChange('body')}
                    type='text'
                    className='form-control'
                    value={body}
                />
            </div>
            <button
                onClick={clickSubmit}
                className='btn btn-raised btn btn-primary'
            >
                Create Post
            </button>
        </form>
    )

    // const photoUrl = user.photo !== undefined
    //     ? `${process.env.REACT_APP_API_URL
    //         }/user/photo/${id}?${new Date().getTime()}`
    //     : DefaultProfile

    const ToProfile = () => {
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }
    }
        
    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Create Post</h2>
            {loadingfile()}
            {showError()}
            {newPostForm()}
            {ToProfile()}
        </div>
    )
}

export default NewPost
