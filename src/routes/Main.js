import Header from "../components/Header";
import {Navigate, Outlet, useLocation, useParams,useNavigate} from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import ModulesProvider from "../components/ModulesContext";
import { addSampleData } from "../firebase";
import { useState } from "react";
export default function Main(props){
    console.log("Main Component");
    const modules=useLoaderData();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate()
    const [isLoading,setLoading] = useState(false);
    const isNewModule = location.pathname.split("/")[3] === "new";
    const _addSampleData = async()=>{
        setLoading(true);
        await addSampleData();
        navigate("/");
    }
    return  <ModulesProvider modules={modules}>
                {<Header authUser={props.authUser}/>}
                {(!modules || modules.length === 0) ?(isLoading?<div className="loaderOuter fixed"><div className="reportLoader"></div></div>:<div className="addSample"><span onClick={_addSampleData}>Add Sample Data</span></div>):
                (!params.moduleName && !isNewModule) ? <Navigate to={`module/${modules?.length ? modules[0].apiName:"new"}`}/>:<Outlet/> }
            </ModulesProvider>
        
}