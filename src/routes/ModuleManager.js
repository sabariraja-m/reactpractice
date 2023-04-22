import { NavLink, useLoaderData, useParams } from "react-router-dom"
import { useRouteLoaderData, useNavigate } from "react-router-dom"
import { useState,useRef } from "react";
import { addFields,updateFields ,deleteFields, addModule} from "../firebase";
import ModuleManagerComponent from "../components/ModuleMangerComponent";

export default function ModuleManager(props){
    const params = useParams();
    const fields = useLoaderData();
    return <ModuleManagerComponent key={params.moduleName?params.moduleName:"new"} fields={fields} ></ModuleManagerComponent>
}