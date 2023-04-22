import Header from "../components/Header";
import {Navigate, Outlet, useLocation, useParams} from "react-router-dom";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useLoading } from "../components/ModuleDataContext";
export default function Main(props){
    console.log("Main Component");
    const params = useParams();
    const modules = useLoaderData();
    const location = useLocation();
    const isNewModule = location.pathname.split("/")[3] === "new";
    return <div>
                {modules && <Header modules={modules} authUser={props.authUser}/>}
                {(!params.moduleName && !isNewModule) && modules && modules.length && <Navigate to={`module/${modules[0].apiName}`}/>}
                <Outlet/>
            </div>;
}