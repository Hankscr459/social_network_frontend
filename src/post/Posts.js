import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list } from './apiPost'
import DefaultPost from '../images/Forest-Cat.jpg'

const Posts = () => {
    const [values, setValues] = useState({
        posts: [],
        page: 1
    })
    const { posts, page } = values
    useEffect(() => {
        loadPosts(page)
    }, [page])

    const loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues(prev => ({ ...prev, posts: data}))
            }
        });
    };

    const loadMore = number => {
        setValues(prev => ({ ...prev,page: page + number }))
        loadPosts(page + number)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    };
 
    const loadLess = number => {
        setValues(prev => ({ ...prev,page: page - number }))
        loadPosts(page - number)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const renderPosts = posts => {
        return (
            <div className='row'>
                {posts.map((post, i) => {
                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
                    const posterName = post.postedBy 
                        ? post.postedBy.name 
                        : 'Unknow';
                    return (
                        <div className='card col-md-4' style={{ width: '18rem' }} key={i}>
                            <div className='card-body'>
                                <img src={`${
                                        process.env.REACT_APP_API_URL
                                    }/post/photo/${post._id}`} 
                                    alt={post.title}
                                    onError={i => i.target.src = `${DefaultPost}`}
                                    className='img-thunbnail mb-3'
                                    style={{height: '200px', width: 'auto'}}
                                />
                                <h5 className='card-title'>{post.title.substring(0, 40)}</h5>
                                <p className='card-text'>
                                    {post.body.substring(0, 100)}
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
                                    to={`/post/${post._id}`}
                                    className='btn btn-raised btn-primary btn-sm'
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>
                {!posts.length ? 'Loading...' : 'Recent Posts'}
            </h2>
                {renderPosts(posts)}
                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => loadLess(1)}
                    >
                        Previous ({page - 1})
                    </button>
                ) : (
                    ""
                )}

                {posts.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
        </div>
    )
}

export default Posts

