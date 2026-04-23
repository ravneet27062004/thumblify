import {createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../configs/api";
import toast from "react-hot-toast";


interface AuthContextProps{
    isLoggedIn:boolean;
    setIsLoggedIn:(isLoggedIn:boolean)=>void; 
     user:IUser | null;
     setUser:(user:IUser | null)=>void;
     login:(user:{email:string,password:string})=>Promise<void>;
     signUp:(user:{name:string,email:string,password:string})=>Promise<void>;
     logOut:()=>Promise<void>;
}
const AuthContext = createContext<AuthContextProps >({
    isLoggedIn:false,
    setIsLoggedIn:()=>{},
    user:null,
    setUser:()=>{},
    login:async()=>{},
    signUp:async()=>{},
    logOut:async()=>{}
})

export const AuthProvider=({children}:{children: React.ReactNode})=>{
const [user,setUser]=useState<IUser | null>(null);
const [isLoggedIn,setIsLoggedIn]=useState<boolean>(false);
const signUp=async({name,email,password}:{name:string,email:string,password:string })=>{
try{
    const {data}=await api.post('/api/auth/register',{name,email,password});
    if(data.user){
        setUser(data.user as IUser);
        setIsLoggedIn(true);
    }
    toast.success(data.message);
}
catch(error){
    toast.error("Error occurred while signing up");
}
}
const login=async({email,password}:{email:string,password:string})=>{
  try{
    const {data}=await api.post('/api/auth/login',{email,password});
    if(data.user){
        setUser(data.user as IUser);
        setIsLoggedIn(true);
    }
    toast.success(data.message);
  }
  catch(error){
    toast.error("Error occurred while logging in");
  }

}
const logOut=async()=>{
try{
    const {data}=await api.post('/api/auth/logout');
    setUser(null);
    setIsLoggedIn(false);
    toast.success(data.message);
}
catch(error){
    toast.error("Error occurred while logging out");
}
}
const fetchUser=async()=>{
try{
    const {data}=await api.get('/api/auth/verify');
    if(data.user){
        setUser(data.user as IUser);
        setIsLoggedIn(true);
    }
}
catch(error){
    toast.error("Error occurred while fetching user");
}
}
useEffect(()=>{
    (async()=>{
        await fetchUser();
    })();
},[])


const value={
    user,setUser,isLoggedIn,setIsLoggedIn,signUp,login,logOut

}
    return (
        <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=>useContext(AuthContext);