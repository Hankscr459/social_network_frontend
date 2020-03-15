import React from "react"
import Posts from "../post/Posts"
import Users from "../user/Users"
 
const Admin = () => {
    return (
        <div>
            <div className="jumbotron">
                <h2>Admin Dashboard</h2>
                <p className="lead">Welcome to React Frontend</p>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Posts</h2>
                        <hr />
                        <Posts />
                    </div>
                    <div className="col-md-6">
                        <h2>Users</h2>
                        <hr />
                        <Users />
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Admin