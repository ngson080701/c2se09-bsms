import React, {useState, useContext, useEffect, useRef} from "react";
import "../../styles/login.css";
import {
    AiOutlineArrowRight,
} from "react-icons/ai";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import {isEmpty} from "../../utils";

export default function OTPVerify() {
    const navigate = useNavigate();
    // check show password text
    const [otp, setOtp] = useState('');
    const {user, isFetching, error, dispatch} = useContext(AuthContext);
    const InputHandler = (e) => {
        setOtp(e.target.value);
    };

    const username = localStorage.getItem('username');
    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8800/api/auth/verify-send-otp", {Email: username, Otp: otp});
            if (response?.data?.status === 200) {
                localStorage.setItem('is_verified_otp', 'true');
                await toast.success('OTP Success!!')
                navigate('/home');
                return;
            }
            toast.error('OTP ERROR!!')
        } catch (e) {
            const messageError = e?.response?.data?.error;
            if (!isEmpty(messageError)) {
                toast.error(messageError);
                return;
            }

            toast.error('OTP ERROR!!')
        }
    };

    return (
        <div className="Login">
            <ToastContainer/>
            <div className="login-box">
                <h2>Login Verify OTP</h2>
                <form>
                    <div className="user-box">
                        <input
                            type="text"
                            name="otp"
                            required
                            value={otp}
                            onChange={InputHandler}
                            autoComplete="off"
                        />
                        <label>OTP</label>
                    </div>
                    <button
                        className="button-submit"
                        onClick={handleClick}
                        disabled={isFetching}
                        type="submit"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Submit
                    </button>
                    <div className="user-box">
                        <Link to="/register">
              <span>
                {" "}
                  You don't have account ? Sign Up <AiOutlineArrowRight/>{" "}
              </span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
