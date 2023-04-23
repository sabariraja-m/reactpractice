import Header from "../components/Header";
import {Navigate, Outlet, useLocation, useParams} from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import ModulesProvider from "../components/ModulesContext";
export default function Main(props){
    console.log("Main Component");
    const modules=useLoaderData();
    const location = useLocation();
    const params = useParams();
    const isNewModule = location.pathname.split("/")[3] === "new";
    return  <ModulesProvider modules={modules}>
                {<Header authUser={props.authUser}/>}
                {(!params.moduleName && !isNewModule) && <Navigate to={`module/${modules?.length ? modules[0].apiName:"new"}`}/>}
                <Outlet/>
            </ModulesProvider>;
}