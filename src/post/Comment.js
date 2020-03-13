import React, { useState } from 'react'
import { Addcomment, Adduncomment } from './apiPost'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/avatar.jpg'

const Comment = ({ comments, postId, updateComments }) => {
    const [values, setValues] = useState({
        text: ''
    })

    const { text } = values

    const handleChange= (event) => {
        setValues({ ...values, text: event.target.value })
    }

    const Addcomments = e =>{
        e.preventDefault();
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const postUId = postId
        const comment = { text: text }
        Addcomment(userId, token, postUId, comment)
        .then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues({...values, text: ''})
                // dispatch fresh
                updateComments(data.comments)
            }
        })
    }

    return (
        <div>
            <h2 className='mt-5 mb-5'>Leave a comment</h2>
            <form onSubmit={Addcomments}>
                <input 
                    type='text' 
                    onChange={handleChange} 
                    className='form-control' 
                />
            </form>
            {JSON.stringify(comments)}
            <hr />
            <div className='col-md-8 col-md-off'>
                <h3 className='text-primary'>{comments.length} Comments</h3>
                <hr />
                {comments.map((comment, i) => 
                    (
                        <div key={i}>
                                <div>
                                    <Link to={`/user/${comment.postedBy._id}`}>
                                        <img 
                                            style={{borderRadius: '50%', border: '1px solid black'}}
                                            className='float-left mr-2'
                                            height='30px'
                                            width= '30px'
                                            src={`${
                                                process.env
                                                .REACT_APP_API_URL
                                            }/user/photo/${comment.postedBy._id}`}
                                            alt={comment.postedBy.name}
                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                        />
                                        <div>
                                            <p className='lead'>{comment.text}</p>
                                        </div>
                                    </Link>
                                </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default Comment
