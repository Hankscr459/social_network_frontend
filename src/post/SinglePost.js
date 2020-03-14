import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { singlePost, remove, Addlike, Addunlike } from './apiPost'
import DefaultPost from '../images/Forest-Cat.jpg'
import { isAuthenticated } from '../auth'
import Comment from './Comment'

const SinglePost = ({match}) => {
    const [values, setValues] = useState({
        post: '',
        deleted: false,
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    })

    const { post, redirectToHome, redirectToSignin,like, likes, comments } = values
    const postId = match.params.postId

    const checkLike = (likes) => {
        const userId =  isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match
    }

    useEffect(() => {
        
        singlePost(postId).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues(prev => ({ 
                    ...prev, 
                    post: data, 
                    likes: data.likes.length, 
                    like: checkLike(data.likes),
                    comments: data.comments
                }))
            }
        })
    }, [postId])

    const updateComments = comments => {
        setValues(prev => ({  ...prev, comments }))
    }

    const likeToogle = () => {
        if(!isAuthenticated()) {
            setValues({...values, redirectToSignin: true})
            return false
        }
        let callApi = like ? Addunlike : Addlike
        const userId = isAuthenticated().user._id
        const postId = post._id
        const token = isAuthenticated().token
        callApi(userId, token, postId).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues({...values, like: !like, likes: data.likes.length })
            }
        })
    }

    const ToSignin = () => {
        if(redirectToSignin) {
            return <Redirect to={`/signin`} />
        }
    }

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
                    {like ?  (
                        <h3 onClick={likeToogle}>
                            <i 
                                className='fa fa-thumbs-up text-success bg-dark'
                                style={{padding: '10px', borderRadius: '50%' }}
                            />{' '}
                            {likes} Like
                        </h3>
                    ) : (
                        <h3 onClick={likeToogle}>
                            <i 
                                className='fa fa-thumbs-up text-warning bg-dark'
                                style={{padding: '10px', borderRadius: '50%' }}
                            />{' '}
                            {likes} Like
                        </h3>
                    )}

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
                    
                    <div className='d-inline-block'>
                        <Link
                            to={`/`}
                            className='btn btn-raised btn-primary btn-sm mr-5'
                        >
                            Back to posts
                        </Link>
                        {isAuthenticated().user &&
                            isAuthenticated().user._id === post.postedBy._id && 
                            <>  
                                <Link
                                    to={`/post/edit/${post._id}`}
                                >
                                    <button className='btn btn-raised btn-warning mr-5'>
                                        Update Post
                                    </button>
                                </Link>
                                <button onClick={deletePost} className='btn btn-raised btn-danger'>
                                    Delete Post
                                </button>
                            </>
                        }
                    </div>
                </div>
        )
    }

    const deletePost = () => {
        const token = isAuthenticated().token
        const postUId = match.params.postId
        let answer = window.confirm(
            'Are you sure you want to delete your Post?'
        )
        if (answer) {
            remove(postUId, token).then (data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    setValues({...values, deleted: true, redirectToHome: true})
                }
            })
        }
    }

    const redirect = () => {
        if(redirectToHome) {
            return <Redirect to={`/`} />
        }
    }

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>{post.title}</h2>
            {!post ? (
                <div className='jumbotron text-center'>
                    <h2>Loading...</h2>
                </div>
            ) : (
                renderPost(post)
            )}
            {redirect()}
            {ToSignin()}
            <Comment postId={post._id} comments={comments.reverse()} updateComments={updateComments} />
        </div>
    )
}

export default SinglePost
