import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { read } from './apiUser'
import DefaultProfile from '../images/avatar.jpg'
import DeleteUser from './DeleteUser'
import FellowProfileButton from './FellowProfileButton'

const Profile = ({match}) => {
    const [values, setValues] = useState({
        user: {following: [], followers: []},
        redirectToSignin: false,
        following: false,
        error: ''
    })

    const checkFllow = (user) => {
        const jwt = isAuthenticated()
        const matches = user.followers.find((follower) => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id
        })
        return matches
    }

    const clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        callApi(userId, token, user._id)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, user: data, following: !following})
            }
        })
    }

    const { user, redirectToSignin, following, error } = values
    
    const userId = match.params.userId
    const init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error) {
                setValues(prev => ({ ...prev, redirectToSignin: true }))
            } else {
                let following = checkFllow(data)
                setValues(prev => ({ ...prev, user: data, following }))
            }
        })
    }
   
    useEffect(() => {
        init(userId)
    },[userId] )

    const redirect = () => {
        if(redirectToSignin) {
            return <Redirect to='/signin' />
        }
    }

    const photoUrl = user.photo !== undefined
        ? `${process.env.REACT_APP_API_URL}/user/photo/${
                user._id
            }?${new Date().getTime()}`
        : DefaultProfile

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Profile</h2>
            <div className='row'>
                <div className='col-md-6'>
                <img
                    style={{ height: '200px', width: 'auto' }}
                    className='img-thumbnail'
                    src={photoUrl} 
                    alt={user.name}
                />
                    {redirect()}
                </div>
                <div className='col-md-6'>
                    <div className='lead'>
                        <p>Hello {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>{`Joined ${new Date(
                            user.created
                        ).toDateString()}`}</p>
                    </div>
                    {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id ? (
                            <div className='d-inline-block'>
                                <Link
                                    className='btn btn-raised btn-success mr-5'
                                    to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ): (
                            <FellowProfileButton
                                following={following} 
                                onButtonClick={clickFollowButton}
                            />
                        )}
                </div>
            </div>
            <div className='row'>
                <div className='col md-12 mt-5 mb-3'>
                <hr />
                    <p className='lead'>{user.about}</p>
                <hr />
                </div>
            </div>
        </div>
    )
}


export default Profile
