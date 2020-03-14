import React, { useState } from 'react'
import { resetPasswords } from "../auth"

const ResetPassword = ({match}) => {
    const [values, setValues] = useState({
        newPassword: '',
        message: '',
        error: ''
    })

    const { newPassword, message, error } = values

    const resetPassword = e => {
        e.preventDefault();
        setValues({ ...values, message: "", error: "" });
 
        resetPasswords({
            newPassword: newPassword,
            resetPasswordLink: match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                setValues({ ...values, error: data.error });
            } else {
                console.log(data.message);
                setValues({ ...values, message: data.message, newPassword: "" });
            }
        });
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Reset your Password</h2>

            {message && (
                <h4 className="bg-success">{message}</h4>
            )}
            {error && (
                <h4 className="bg-warning">{error}</h4>
            )}

            <form>
                <div className="form-group mt-5">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Your new password"
                        value={newPassword}
                        name="newPassword"
                        onChange={e =>
                            setValues({
                                newPassword: e.target.value,
                                message: "",
                                error: ""
                            })
                        }
                        autoFocus
                    />
                </div>
                <button
                    onClick={resetPassword}
                    className="btn btn-raised btn-primary"
                >
                    Reset Password
                </button>
            </form>
        </div>
    )
}

export default ResetPassword
