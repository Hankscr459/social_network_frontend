import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { singlePost, update } from './apiPost'
import { isAuthenticated } from '../auth'
import DefaultPost from '../images/Forest-Cat.jpg'


const EditPost = ({match}) => {
    const [values, setValues] = useState({
        post: '',
        id: '',
        title: '',
        body: '',
        formData: '',
        redirectToProfile: false,
        error: '',
        fileSize: 0,
        loading: false
    })

    const postId = match.params.postId
    const { 
        post,
        id, 
        title, 
        body, 
        formData, 
        error, 
        fileSize, 
        redirectToProfile, 
        loading 
    } = values

    const init = (postId) => {
        setValues(prev => ({ ...prev, loading: true }))
        singlePost(postId).then(data => {
            if(data.error) {
                setValues(prev => ({ ...prev, redirectToProfile: true }))
            } else {
                setValues(prev => ({
                    ...prev,
                    post: data,
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    formData: new FormData(),
                    error: '',
                    loading: false
                }))
            }
        })
    }
    
    const redirect = () => {
        if(redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }
    }

    const showError = () => (
        <div
            className='alert alert-danger mt-4 mb-2'
            style={{display: error ? '' : 'none'}}
        >
            {error}
        </div>
    )

    const loadingfile = () => (
        loading && (
            <div className="jumbotron text-center">
                <h2>Loading...</h2>
            </div>
        )
    )

    useEffect(() => {
        init(postId)
    }, [postId])

    const handleChange = name => event => {
        const value =
            name === 'photo' ? event.target.files[0] : event.target.value
        const fileSize = name === 'photo' ? event.target.files[0].size : 0
        formData.set(name, value)
        setValues({ ...values, [name]: value, fileSize })
    }

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

    const clickSubmit = event => {
        setValues({...values, loading: true})
        const postUid = id
        const tokenjwt = isAuthenticated().token
        event.preventDefault()
        if(isValid()) {
            setValues({ ...values, error: false, fileSize })
            update(postUid, tokenjwt, formData)
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
                        loading: false,
                        redirectToProfile: true
                     })
                }
            })
        }
    }

    const EditPostForm = () => (
        <form>
            <div className='form-group'>
                <label className='text-muted mr-2'>Post photo</label>
                <input
                    onChange={handleChange('photo')}
                    type='file'
                    name='photo'
                    accept='image/*'
                />
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
                Update Post
            </button>
        </form>
    )

    const photoUrl = post.photo !== undefined
    ? `${process.env.REACT_APP_API_URL
    }/post/photo/${id}?${new Date().getTime()}`
    : DefaultPost

    return (
        <div className='container'>
            {showError()}
            {loadingfile()}
            <h2 className='mt-5 mb-5'>{title}</h2>
            <img
                style={{ height: '200px', width: 'auto' }}
                className='img-thumbnail'
                src={photoUrl} 
                alt={title} 
            />
            {EditPostForm()}
            {redirect()}
        </div>
    )
}
export default EditPost
