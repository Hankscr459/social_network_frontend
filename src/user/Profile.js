import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { read } from './apiUser'

const Profile = ({match}) => {
    const [values, setValues] = useState({
        user: '',
        redirectToSignin: false
    })
    const { user, redirectToSignin } = values

    const init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error) {
                setValues(prev => ({ ...prev, redirectToSignin: true }))
            } else {
                setValues(prev => ({ ...prev, user: data}))
            }
        })
    }

    useEffect(() => {
        const userId = match.params.userId
        init(userId)
    },[] )

    const redirect = () => {
        if(redirectToSignin) {
            return <Redirect to='/signin' />
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
                    <h2 className='mt-5 mb-5'>Profile</h2>
                    <p>Hello {isAuthenticated().user.name}</p>
                    <p>Email: {isAuthenticated().user.name}</p>
                    <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                    {redirect()}
                </div>
                <div className='col-md-6'>
                    {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id && (
                            <div className='d-inline-block mt-5'>
                                <Link
                                    className='btn btn-raised btn-success mr-5'
                                    to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <button className='btn btn-raised btn-danger'>
                                    Delete Profile
                                </button>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}


export default Profile
