import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { read } from './apiUser'
import DefaultProfile from '../images/avatar.jpg'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import { listByUser } from '../post/apiPost'

const Profile = ({match}) => {
    const [values, setValues] = useState({
        user: {following: [], followers: []},
        redirectToSignin: false,
        following: false,
        error: ''
    })
    const [postsValues, setpostsValues] = useState({
        posts: []
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
                setValues(prev => ({ ...prev, error: data.error}))
            } else {
                setValues(prev => ({ ...prev, user: data, following: !following}))
            }
        })
    }
    const { posts } = postsValues
    const { user, redirectToSignin, following } = values
    
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
                loadPosts(data)
            }
        })
    }
   
    const loadPosts = () => {
        const token = isAuthenticated().token
        const userUId = match.params.userId
        listByUser(userUId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setpostsValues({ posts: data })
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
                <div className='col-md-4'>
                <img
                    style={{ height: '200px', width: 'auto' }}
                    className='img-thumbnail'
                    src={photoUrl} 
                    alt={user.name}
                />
                    {redirect()}
                </div>
                <div className='col-md-8'>
                    <div className='lead mt-2'>
                        <p>Hello {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>{`Joined ${new Date(
                            user.created
                        ).toDateString()}`}</p>
                    
                        {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ? (
                                <div className='d-inline-block'>
                                    <Link
                                        className='btn btn-raised btn-info mr-5'
                                        to={`/post/create`}
                                    >
                                        Create Post
                                    </Link>
                                    <Link
                                        className='btn btn-raised btn-success mr-5'
                                        to={`/user/edit/${user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ): (
                                <FollowProfileButton
                                    following={following} 
                                    onButtonClick={clickFollowButton}
                                />
                        )}
                        <div>
                            {isAuthenticated().user &&
                                isAuthenticated().user.role === "admin" && (
                                    <div className="card mt-5">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                Admin
                                            </h5>
                                            <p className="mb-2 text-danger">
                                                Edit/Delete as an Admin
                                            </p>
                                            <Link
                                                className="btn btn-raised btn-success mr-5"
                                                to={`/user/edit/${user._id}`}
                                            >
                                                Edit Profile
                                            </Link>
                                            <DeleteUser userId={user._id} />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col md-12 mt-5 mb-3'>
                <hr />
                    <p className='lead'>{user.about}</p>
                <hr />
                <ProfileTabs 
                    followers={user.followers} 
                    following={user.following}
                    posts={posts}
                />
                </div>
            </div>
        </div>
    )
}


export default Profile