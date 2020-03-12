import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Menu from './core/Menu'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Profile from './user/Profile'
import Users from './user/Users'
import EditProfile from './user/EditProfile'
import PrivateRoute from './auth/PrivateRoute'
import FindPeople from './user/FindPeople'
import NewPost from './post/NewPost'
import SinglePost from './post/SinglePost'
import EditPost from './post/EditPost'

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path='/' component={Home} />
            <PrivateRoute exact path='/post/create' component={NewPost} />
            <Route exact path='/post/:postId' component={SinglePost} />
            <PrivateRoute exact path='/post/edit/:postId' component={EditPost} />
            <Route exact path='/users' component={Users} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <PrivateRoute exact path='/user/:userId' component={Profile} />
            <PrivateRoute exact path='/findPeople' component={FindPeople} />
            <PrivateRoute exact path='/user/edit/:userId' component={EditProfile} />
        </Switch>
    </div>
)

export default MainRouter