
import ReportComponent from "../components/ReportComponent";
import ModuleDataProvider from "../components/ModuleDataContext";
import React from "react";
export default function Report(){
    return <ModuleDataProvider><ReportComponent></ReportComponent></ModuleDataProvider>
}