import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider
} from 'react-router-dom'
import { useState } from 'react';
import {setup,getOrgDetails,getModuleFields,getReportData,getOrgId} from "./firebase";
import './index.css';
import Signin from './routes/Signin';
import Signup from './routes/Signup';
import Setup from './routes/Setup';
import Main from './routes/Main';
import Report from './routes/Report';
import ModuleManager from './routes/ModuleManager';
import ErrorElement from './components/ErrorElement';
import { useAuth } from './components/AuthContext';
export default function App(){
    const [orgId,setOrgId] = useState("loading");
    const {user,signIn,signUp} = useAuth();
    const userEmail = user?user.email:null;

    useEffect(()=>{
        async function _getData(userEmail){
            let res = await getOrgId(userEmail);
            setOrgId(res);
        }
        if(userEmail)
            _getData(userEmail)

    },[userEmail]);

    if(user.state === "loading"){
        return <div></div>;
    }
    if(user.uid && orgId === "loading"){
        return <div></div>;
    }
    let routes = [];
    if(user.state === "signOut"){
        routes= [
            { 
                path : "/*",
                element : <Navigate to={"/signin"} replace={true}/>,
                errorElement : <ErrorElement/>
            },
            {
                path : "/signin",
                element : <Signin/>,
                action : async({request})=>{
                    return await signIn(request);
                },
                errorElement : <ErrorElement/>
            },
            {
                path : "/signup",
                element : <Signup/>,
                action : async({request})=>{
                    let res = await signUp(request);
                    if(res.status === "success")
                        return redirect("/signin");
                    return res;
                }
            }
        ]
    }
    else if(user.uid && !orgId){
        const setupOrg = async({request})=>{
            let orgId = await setup(request);
            setOrgId(orgId)
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
    else if(user.uid && orgId){
        const checkOrgId = ({params})=>{
            if(["signin","signup","setup"].indexOf(params.orgId) !== -1)
                return redirect("/");
            if(params.orgId !== orgId)
                return redirect('/error')
            return getOrgDetails(params);
        }
        routes = [
            { 
                path : "/",
                element : <Navigate to={`/${orgId}`} replace={true}/>,
                errorElement : <ErrorElement/>
            },
            {
                path : "/:orgId",
                element : <Main user={user}/>,
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