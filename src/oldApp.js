import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider
} from 'react-router-dom'
import {signIn,signUp,setup,getOrgDetails,getModuleFields,getReportData, getOrgId , sendVerificationEmail} from "./firebase";
import './index.css';
import Signin from './routes/Signin';
import Signup from './routes/Signup';
import Setup from './routes/Setup';
import Main from './routes/Main';
import Report from './routes/Report';
import ModuleManager from './routes/ModuleManager';
import ErrorElement from './components/ErrorElement';
import { useState,useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
export default function App(){
    const [authUser ,setAuthUser]=useState({"state":"loading"});
    useEffect(()=>{
        console.log("useAuthUser didMount");
        var unsubscribe = onAuthStateChanged(getAuth(),async(user) => {
            console.log("onAuthStateChanged Main")
            if (user && user.emailVerified) {
                var orgId = await getOrgId(user);
                user.orgId = orgId;
                setAuthUser(user)
            } 
            else if(user){
                sendVerificationEmail()
                setAuthUser({"state":"signOut"})
            }
            else {
                setAuthUser({"state":"signOut"})
            }
        })
        return ()=>unsubscribe();
    },[])
   
    if(authUser.state === "loading"){
        return <div></div>
    }
    let routes = [];
    if(authUser.state === "signOut"){
        routes= [
            { 
                path : "/*",
                element : <Navigate to={"/signin"} replace={true}/>,
                errorElement : <ErrorElement/>
            },
            {
                path : "/signin",
                element : <Signin/>,
                action : signIn,
                errorElement : <ErrorElement/>
            },
            {
                path : "/signup",
                element : <Signup/>,
                action : signUp
            }
        ]
    }
    else if(authUser.uid && !authUser.orgId){
        const setupOrg = async({request})=>{
            let orgId = await setup(request);
            setAuthUser({...authUser,orgId})
            return redirect("/");
        }
        routes = [
            { 
                path : "/*",
                element : <Navigate to={"/setup"} replace={true}/>,
                errorElement : <ErrorElement/>
            },
            {
                path : "/setup",
                element : <Setup/>,
                action : setupOrg
            },
        ]
    }   
    else if(authUser.uid && authUser.orgId){
        const checkOrgId = ({params})=>{
            if(["signin","signup","setup"].indexOf(params.orgId) !== -1)
                return redirect("/");
            if(params.orgId !== authUser.orgId)
                return redirect('/error')
            return getOrgDetails(params);
        }
        routes = [
            { 
                path : "/",
                element : <Navigate to={`/${authUser.orgId}`} replace={true}/>,
                errorElement : <ErrorElement/>
            },
            {
                path : "/:orgId",
                element : <Main authUser={authUser}/>,
                loader : checkOrgId,
                id :"main",
                children : [
                    {
                        path: "/:orgId/module/new",
                        element : <ModuleManager/>
                    },
                    {
                        path : "/:orgId/module/:moduleName",
                        loader : getReportData,
                        element : <Report/>
                    },
                    {  
                        path : "/:orgId/module/:moduleName/edit",
                        loader :getModuleFields,
                        element : <ModuleManager/>
                    }
                ]
            },
            {
                path : "/error",
                element : <ErrorElement/>
            }
        ]
    }    
    return  <RouterProvider router={createBrowserRouter(routes)} />;

}