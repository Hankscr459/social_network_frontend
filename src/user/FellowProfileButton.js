import React from 'react'
import { follow } from './apiUser'

const FellowProfileButton = ({following, onButtonClick}) => {

    const followClick = () =>{
        onButtonClick(follow)
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
                <button className='btn btn-warning btn-raised'>
                    UnFollow
                </button>
            )
        }
        </div>
    )
}

export default FellowProfileButton
