import React, {useEffect} from 'react'

const Home = () => {
    useEffect(() => {
        console.log(`${process.env.REACT_APP_TEST}`)
    })
    return (
        <div className='jumbotron'>
            <h2>Home</h2>
            <p className='lead'>Welcome to React Frontend</p>
        </div>
    )
}

export default Home
