// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import authService from "../appwrite/auth"
// import { useForm } from "react-hook-form"
// import {login} from "../store/authSlice"
// import {Button, Input, Logo} from "./index"

// const SignUp = () => {
//     const navigate=useNavigate();
//     const dispatch=useDispatch();
//     const {register, handleSubmit}=useForm();
//     const [error, setError] = useState("");

//     const signup=async(data)=>{
//         setError("");
//         try {
//             const userData=await authService.createAccount(data);
//             if(userData){
//                 const currentUser=await authService.getCurrentUser();
//                 if(currentUser){
//                     dispatch(login(currentUser));
//                     navigate("/");
//                 }
//             }
//         } catch (error) {
//             setError(error.message);
//         }
//     }
//    return (
//     <div className="flex items-center justify-center">
//         <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
//             <div className="mb-2 flex justify-center">
//                 <span className="inline-block w-full max-w[100px]">
//                     <Logo width="100%"/>
//                 </span>
//             </div>
//             <h2 className="text-center text-2xl font-bold leading-tight">
//             Sign up to create account
//         </h2>
//         <p className="mt-2 text-center text-base text-black/60">
//             Already have an account?&nbsp;
//             <Link to="/login" className="font-medium text-primary transition-all duration-200 hover:underline">
//                 Sign in
//             </Link>
//         </p> 
//         {error && <p className="text-red-500 mt-8 text-center text-xl">{error}</p>}
//         <form onSubmit={handleSubmit(signup)} className="mt-8">
//             <div className="space-y-5">
//                 <Input label="Full Name: " placeholder="Enter your full name" type="text" {...register("name",{
//                     required:true,
//                 })}/>
//                 <Input label="Email: " placeholder="Enter your email" type="email" {...register("email",{
//                     required:true,
//                     validate:{
//                         matchPatern:(value)=>/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email is not valid",
//                     },
//                 })}/>
//                 <Input label="Password: " placeholder="Enter your password" type="password" {...register("password",{
//                     required:true,
//                 })}/>
//                 <Button type="submit" className="w-full">Create account</Button>
//             </div>
//         </form>
//         </div>
//     </div>
//   )
// }

// export default SignUp
const SignUp = () => {
  return (
    <div>
      Signup
    </div>
  )
}

export default SignUp
