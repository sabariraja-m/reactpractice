
import ReportComponent from "../components/ReportComponent";
import ReportComponentNew from "../components/ReportComponentNew";

import { useLoaderData, useParams } from "react-router-dom";
import ModuleDataProvider from "../components/ModuleDataContext";
export default function Report(){
    const reportData = useLoaderData();
    const params = useParams();
    // return <ReportComponent reportData={reportData} key={reportData.params.moduleName}></ReportComponent>
    return (<ModuleDataProvider moduleData={reportData.records} key={params.moduleName}>
        <ReportComponentNew fields={reportData.fields}></ReportComponentNew>
    </ModuleDataProvider>)
}