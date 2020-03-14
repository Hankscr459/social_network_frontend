import React, { useState } from 'react'
import { forgotPasswords } from '../auth'

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        message: '',
        error: ''
    })
    
    const { email, message, error } = values

    const forgotPassword = e => {
        e.preventDefault();
        setValues({ ...values,message: "", error: "" });
        forgotPasswords(email).then(data => {
            if (data.error) {
                console.log(data.error);
                setValues({ ...values, error: data.error });
            } else {
                console.log(data.message);
                setValues({ ...values, message: data.message });
            }
        });
    };

    return (
        <div className="mt-5 mb-5">
            <h2 className="mt-5 mb-5">Ask for Password Reset</h2>
    
            {message && (
                <h4 className="bg-success">{message}</h4>
            )}
            {error && (
                <h4 className="bg-warning">{error}</h4>
            )}

                <form>
                    <div className="form-group mt-5">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Your email address"
                            value={email}
                            name="email"
                            onChange={e =>
                                setValues({
                                    email: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={forgotPassword}
                        className="btn btn-raised btn-primary"
                    >
                        Send Password Rest Link
                    </button>
                </form>
        </div>
    )
}

export default ForgotPassword
