import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { findPeople, follow } from './apiUser'
import { isAuthenticated } from '../auth'
import DefaultProfile from '../images/avatar.jpg'

const FindPeople = () => {
    const [values, setValues] = useState({
        users: [],
        open: false,
        error: '',
        followMessage: null
    })
    const { users, followMessage, open  } = values
    
    useEffect(() => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        findPeople(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues(prev => ({ ...prev, users: data}))
            }
        })
    }, [])

    const clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        follow(userId, token, user._id)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                let toFollow = users
                toFollow.splice(i, 1)
                setValues({
                    ...values,
                    users:toFollow,
                    open: true,
                    followMessage: `Following ${user.name}`
                })
            }
        })
    }

    const renderUsers = users => (
        <div className='row'>
            {users.map((user, i) => (
                <div className='card col-md-4' style={{ width: '18rem' }} key={i}>
                    <img
                        className='card-img-top'
                        src={`${process.env.REACT_APP_API_URL
                        }/user/photo/${user._id}?${new Date().getTime()}`}
                        style={{
                            width: '100%',
                            height: '20vw',
                            objectFit: 'cover'
                        }}
                        alt={user.name}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                    />
                    <div className='card-body'>
                        <h5 className='card-title'>{user.name}</h5>
                        <p className='card-text'>
                            {user.email}
                        </p>
                        <Link
                            to={`/user/${user._id}`}
                            className='btn btn-raised btn-primary btn-sm'
                        >
                            View Profile
                        </Link>
                        <button onClick={() => clickFollow(user, i)} className='btn btn-raised btn-info float-right btn-sm'>
                            Follow
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>FindPeople</h2>
            {open &&  (
                <div className='alert alert-success'>
                    <p>{followMessage}</p>
                </div>
            )}
            <div>
                {renderUsers(users)}
            </div>
        </div>
    )
}

export default FindPeople

