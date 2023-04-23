import { useState } from "react";
import { getRecords , addRecord,updateRecord, deleteRecord,updateFields } from "../firebase";
import { useParams, useRouteLoaderData, useSearchParams } from "react-router-dom";
import RecordView from "./RecordView";
import ReportFilter from "./ReportFilter";
import Form from "./Form";
import List from "./List";
import Pagination from "./Pagination";
import { NavLink } from "react-router-dom";
import { useModuleData } from "./ModuleDataContext";
import { useModules } from "./ModulesContext";

export default function ReportComponent(props){
    const {records,fields,isLoading} = useModuleData();
    const [searchParams,setSearchParams]=useSearchParams();
    const [selectedRecordId,setSelectedRecordId]=useState(searchParams.get("id") || null);
    const params = useParams();
    const {modules} = useModules();
    var moduleDetail = modules.find(mo=>mo.apiName === params.moduleName);
    var selectedRecord = (selectedRecordId !== "new")?records.find(re=>re.id === selectedRecordId):null;
    const changeRecord = (newRecordOffset)=>{
        let srIndex = records.findIndex(fi => fi.id === selectedRecordId);
        if(srIndex !== -1 && (srIndex+newRecordOffset) >= 0 && (srIndex+newRecordOffset) < records.length){
            setSelectedRecordId(records[srIndex+newRecordOffset].id);
        }
    }
    const showPreview=(recordId)=>{
        setSelectedRecordId(recordId);
    }
    const changeFields = async(fields)=>{
        if(fields){
            updateFields(fields,params.orgId);
        }
    } 
    
    return (<div className="reportContainer">
                {!moduleDetail? <div className="noRecords">Module Not Found</div>:<>
                <div className="reportHeader">

                    <span className="hdButton">{moduleDetail.apiName}</span>    
                    <NavLink to={"./edit"} className="editModule"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.99512 17.2072V19.5C3.99512 19.7761 4.21897 20 4.49512 20H6.79289C6.9255 20 7.05268 19.9473 7.14645 19.8536L16.5942 10.4058L13.5935 7.40518L4.14163 16.8535C4.04782 16.9473 3.99512 17.0745 3.99512 17.2072Z" fill="#000000"></path> <path d="M14.8322 6.16693L17.8327 9.16734L19.2929 7.7071C19.6834 7.31658 19.6834 6.68341 19.2929 6.29289L17.707 4.70697C17.3165 4.3165 16.6834 4.31644 16.2929 4.70684L14.8322 6.16693Z" fill="#000000"></path> </g></svg></NavLink>
                    <span className="hdButton right" onClick={()=>{setSelectedRecordId("new")}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20" fill="none"><path fill="#000000" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"/></svg>
                        <span style={{marginLeft:"10px"}}>Create {moduleDetail.singularName}</span>
                    </span>

                </div>

                <div className="reportBody">

                    <ReportFilter isLoading={isLoading} fields={fields}></ReportFilter>

                    <div className="listContainer">
                       {isLoading ? <div className="loaderOuter"><div className="reportLoader"></div></div>:(records && records.length > 0)?<> <List records={records} fields={fields} isLoading={isLoading} changeFields={changeFields} showPreview={showPreview} selectedRecordId={selectedRecord?selectedRecordId:null}></List><Pagination recordsLength={records.length}></Pagination></>:<div className="noRecords">No Records Found</div>}
                    </div>    
                    
                    {(selectedRecordId === "new") && <Form fields={fields} moduleDetail={moduleDetail} close={()=>setSelectedRecordId(null)}></Form>}
                    
                    {selectedRecord && <RecordView changeRecord={changeRecord} closeQuickView={()=>{setSelectedRecordId(null)}} record={selectedRecord} fields={fields} recordsLength={records.length} recordIndex={records.findIndex(re=>re.id === selectedRecordId)}></RecordView>}    
                
                </div></>}
            </div>);
}