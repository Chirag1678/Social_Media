import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {login as authLogin} from "../store/authSlice"
import {Button, Input, Logo} from "./index"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { loginUser } from "../utils/User.js"

const Login = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {register, handleSubmit}=useForm();
    const [error, setError] = useState("");

    const login=async(data)=>{
        console.log(data);
        setError("");
        try {
            const response = await loginUser(data.email, data.password); // Using loginUser from user.js
            dispatch(authLogin(response.user));
            navigate("/");
            window.location.reload();
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "An error occurred during login";
            setError(errorMessage);
        }
    }
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
            <span className="inline-block w-full max-w-[100px]">
                <Logo width="100%" />
            </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
            Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
            Don&apos;t have an account?&nbsp;
            <Link to="/signup" className="font-medium text-primary transition-all duration-200 hover:underline">
                Sign up
            </Link>
        </p>
        {error && <p className="text-red-500 mt-8 text-center text-xl">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
                <Input label="Email: " placeholder="Enter your email" type="email" name="email" {...register("email",{
                    required:true,
                    validate:{
                        matchPatern:(value)=>/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email is not valid",
                    },
                })}/>
                <Input label="Password: " placeholder="Enter your password" type="password" name="password" {...register("password",{
                    required:true,
                })}/>
                <Button type="submit" className="w-full">Sign in</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login