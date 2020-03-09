import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list } from './apiUser'
import DefaultProfile from '../images/avatar.jpg'

const Users = () => {
    const [values, setValues] = useState({
        users: []
    })
    const { users } = values
    useEffect(() => {
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues(prev => ({ ...prev, users: data}))
            }
        })
    }, [])

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
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Users</h2>
            <div>
                {renderUsers(users)}
            </div>
        </div>
    )
}

export default Users

