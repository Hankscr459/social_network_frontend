import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { singlePost } from './apiPost'
import DefaultPost from '../images/Forest-Cat.jpg'

const SinglePost = ({match}) => {
    const [values, setValues] = useState({
        post: '',

    })

    const { post } = values
    const postId = match.params.postId
    useEffect(() => {
        
        singlePost(postId).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues(prev => ({ ...prev, post: data }))
            }
        })
    }, [postId])

    const renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
        const posterName = post.postedBy 
            ? post.postedBy.name 
            : 'Unknow';
        return (
                <div className='card-body'>
                    <img src={`${
                            process.env.REACT_APP_API_URL
                        }/post/photo/${post._id}`} 
                        alt={post.title}
                        onError={i => i.target.src = `${DefaultPost}`}
                        className='img-thunbnail mb-3'
                        style={{
                            height: '300px', 
                            width: '50%'
                        }}
                    />
                    <p className='card-text'>
                        {post.body}
                    </p>
                    <br />
                    <p className='font-italic mark'>
                        Posted By 
                        <Link to={`${posterId}`}>
                            {' '}{posterName}{' '}
                        </Link>
                        on {new Date(post.created).toDateString()}
                    </p>
                    <Link
                        to={`/`}
                        className='btn btn-raised btn-primary btn-sm'
                    >
                        Back to posts
                    </Link>
                </div>
        )
    }

    return (
        <div className='container'>
            <h2>{post.title}</h2>
            {!post ? (
                <div className='jumbotron text-center'>
                    <h2>Loading...</h2>
                </div>
            ) : (
                renderPost(post)
            )}
        </div>
    )
}

export default SinglePost
