import { useLoaderData, useParams, useLocation } from "react-router-dom"
import ModuleManagerComponent from "../components/ModuleMangerComponent";

export default function ModuleManager(props){
    const params = useParams();
    const fields = useLoaderData();
    return <ModuleManagerComponent key={params.moduleName?params.moduleName:"new"} fields={fields}></ModuleManagerComponent>
}