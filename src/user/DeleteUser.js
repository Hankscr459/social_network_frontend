import React, { useState } from 'react'
import { isAuthenticated } from '../auth'
import { remove } from './apiUser'
import { signout } from '../auth'
import { Redirect } from 'react-router-dom'

const DeleteUser = ({ userId }) => {
    const [values, setValues] = useState({
        redirect: false
    })
    const { redirect } = values
    const redirectToHome = () => {
        if(redirect) {
            return <Redirect to='/' />
        }
    }

    const deleteAccount = () => {
        const token = isAuthenticated().token
        remove(userId, token)
        .then(data => {
            if(data.error) {
                console.log(data.error)
            } else if(isAuthenticated().user.role === "admin") {
                setValues(prev => ({ ...prev, redirect: true }))
            } else {
                // signout user
                signout(() => console.log('User is deleted'))
                // redirect
                setValues(prev => ({ ...prev, redirect: true }))
            }
        })
    }

    const deleteConfirmed = () => {
        let answer = window.confirm(
            'Are you sure you want to delete your account?'
        )
        if (answer) {
            deleteAccount()
        }
    }

    return (
        <>
            <button onClick={deleteConfirmed} className='btn btn-raised btn-danger'>
                Delete Profile
            </button>
            {redirectToHome()}
        </>
    )
}

export default DeleteUser
