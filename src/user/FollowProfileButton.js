import React from 'react'
import { follow, unfollow } from './apiUser'

const FellowProfileButton = ({following, onButtonClick}) => {

    const followClick = () =>{
        onButtonClick(follow)
    }
    const unfollowClick = () =>{
        onButtonClick(unfollow)
    }

    return (
        <div className='d-inline-block'>
        {
            !following ?
            (
                <button onClick={followClick} className='btn btn-success btn-raised mr-5'>
                    Follow
                </button>
            )  :  (
                <button onClick={unfollowClick} className='btn btn-warning btn-raised'>
                    UnFollow
                </button>
            )
        }
        </div>
    )
}

export default FellowProfileButton