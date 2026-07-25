import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CSS/Login.css'

const Login = () => {
    const api_url = import.meta.env.VITE_API_URL

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                `${api_url}/api/user/login`,
                formData
            )

            if (res.status === 200) {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.userData)
                )

                alert("Login Successfully")

                setFormData({
                    email: "",
                    password: ""
                })

                navigate("/dashboard")
            }
        } catch (error) {
            console.log(error)
            alert("Invalid Email or Password")
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>

                <form onSubmit={loginUser}>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value
                            })
                        }
                    />

                    <button className="login-btn" type="submit">
                        Login
                    </button>

                    <button
                        type="button"
                        className="forgot-btn"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login