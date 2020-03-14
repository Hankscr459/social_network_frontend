import React, { useState } from 'react'
import { Addcomment, Adduncomment } from './apiPost'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/avatar.jpg'

const Comment = ({ comments, postId, updateComments }) => {
    const [values, setValues] = useState({
        text: '',
        error: ''
    })

    const { text, error } = values

    const isValid = () => {
        if(!text.length > 0 || text.length > 150 ) {
            setValues({ 
                ...values,
                error: 'Comment should not be empty and less than 150 characters long' 
            })
            return false
        }
        return true
    }

    const handleChange= (event) => {
        setValues({ ...values, text: event.target.value, error: false })
    }

    const Addcomments = e =>{
        e.preventDefault();
        if(!isAuthenticated()) {
            setValues({error: 'Please Signin to leave a comment'})
            return false
        }
        if(isValid()) {
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
    }
    const deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postUId = postId;

        Adduncomment(userId, token, postUId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                updateComments(data.comments);
            }
        })
    }
    const deleteConfirmed = comment => {
        let answer = window.confirm(
            "Are you sure you want to delete your comment?"
        );
        if (answer) {
            deleteComment(comment);
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

    return (
        <div>
            <h2 className='mt-5 mb-5'>Leave a comment</h2>
            <form onSubmit={Addcomments}>
                <input 
                    type='text' 
                    onChange={handleChange} 
                    className='form-control' 
                    value={text}
                    placeholder='Leave a comment...'
                />
                <button className='btn btn-raised btn-success mt-2'>
                    Post
                </button>
            </form>
            {showError()}
            <div className='col-md-12'>
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
                                    </Link>
                                        <div>
                                            <p className='lead'>{comment.text}</p>
                                            <p className='font-italic mark'>
                                                Posted By 
                                                <Link to={`/user/${comment.postedBy._id}`}>
                                                    {' '}{comment.postedBy.name}{' '}
                                                </Link>
                                                on {new Date(comment.created).toDateString()}
                                                <span>
                                                    {isAuthenticated().user &&
                                                        isAuthenticated().user._id === comment.postedBy._id && (
                                                        <>
                                                            <span 
                                                                onClick={() => deleteConfirmed(comment)} 
                                                                className='text-danger float-right mr-1'
                                                            >
                                                                Remove
                                                            </span>
                                                        </>
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    
                                </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default Comment
