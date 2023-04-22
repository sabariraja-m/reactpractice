import { useState } from "react";
import { getRecords , addRecord,updateRecord, deleteRecord,updateFields } from "../firebase";
import { useRouteLoaderData } from "react-router-dom";
import RecordView from "./RecordView";
import ReportFilter from "./ReportFilter";
import Form from "./Form";
import List from "./List";
import Pagination from "./Pagination";
import { NavLink } from "react-router-dom";

export default function ReportComponent(props){
    const [records,setRecords]=useState(props.reportData.records["records"]);
    const [filterObject,setFilterObject]=useState({"sortBy":"ct","sortOrder":"Asc","criteriaList":[],"pageLimit":20,"currentPage":1,"firstVisible":props.reportData.records["firstVisible"],"lastVisible":props.reportData.records["lastVisible"]})
    const [showForm,setShowForm]=useState(false);
    const [selectedRecordId,setSelectedRecordId]=useState();
    const {fields,params} = props.reportData;
    const modulesDetail = useRouteLoaderData("main");
    var moduleDetail = modulesDetail.find(mod=>mod.apiName === params.moduleName)
    var selectedRecord = records.find(re=>re.id === selectedRecordId);

    const getModuleRecords=async (_filterObject,filterKey)=>{
        setFilterObject(_filterObject);
        if(filterKey === "sortOrder" && !_filterObject.sortBy)
            return;
        let sortOrder = _filterObject.sortOrder.toLowerCase();
        if(filterKey === "prevPage")
            sortOrder = "desc";
        let tmp = await getRecords(params.orgId,params.moduleName,_filterObject.criteriaList,[_filterObject.sortBy,sortOrder],_filterObject.pageLimit,_filterObject.pageQuery,_filterObject.pagination);
        let pageQueryMap= {"firstVisible":tmp.firstVisible,"lastVisible":tmp.lastVisible}
        if(filterKey === "prevPage"){
            tmp.records = tmp.records.reverse();
            pageQueryMap= {"firstVisible":tmp.lastVisible,"lastVisible":tmp.firstVisible};
        }    
        setRecords(tmp.records);
        setFilterObject((preProps)=>{
            return {...preProps,...pageQueryMap}
        })
            
    }
    const addModuleRecord = async(dataMap)=>{
        dataMap.module = moduleDetail.apiName;
        dataMap.ct=new Date().getTime();
        Object.keys(dataMap).map(key=>{
            if(dataMap[key] === undefined)
                delete dataMap[key];
            return key;
        })
        let recordId = await addRecord(params.orgId,dataMap);
        dataMap.id = recordId;
        setRecords([dataMap,...records]);
        setShowForm(false);
        setSelectedRecordId(recordId);
    }
    const updateModuleRecord = async(recordId,dataMap)=>{
        Object.keys(dataMap).map(key=>{
            if(dataMap[key] === undefined)
                delete dataMap[key];
            return key;
        })
        dataMap.module = moduleDetail.apiName;
        updateRecord(params.orgId,recordId,dataMap);
        setRecords((preRecords)=>{
            let newRecords = preRecords.map((record)=>{
                if(record.id === recordId){
                    return {...record,...dataMap};
                }
                return record;
            })
            return newRecords;
        })
    }
    const deleteModuleRecord = (recordId)=>{
        deleteRecord(params.orgId,moduleDetail.apiName,recordId);
        setRecords((preRecords)=>{
            let newRecords = preRecords.filter((record)=>{
                return record.id !== recordId
            })
            return newRecords;
        })
        setSelectedRecordId(null);
    }
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
        
                <div className="reportHeader">

                    <span className="hdButton">{moduleDetail.apiName}</span>    
                    <NavLink to={"./edit"} className="editModule"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.99512 17.2072V19.5C3.99512 19.7761 4.21897 20 4.49512 20H6.79289C6.9255 20 7.05268 19.9473 7.14645 19.8536L16.5942 10.4058L13.5935 7.40518L4.14163 16.8535C4.04782 16.9473 3.99512 17.0745 3.99512 17.2072Z" fill="#000000"></path> <path d="M14.8322 6.16693L17.8327 9.16734L19.2929 7.7071C19.6834 7.31658 19.6834 6.68341 19.2929 6.29289L17.707 4.70697C17.3165 4.3165 16.6834 4.31644 16.2929 4.70684L14.8322 6.16693Z" fill="#000000"></path> </g></svg></NavLink>
                    <span className="hdButton right" onClick={()=>{setShowForm(true);setSelectedRecordId(null)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20" fill="none"><path fill="#000000" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"/></svg>
                        <span style={{marginLeft:"10px"}}>Create {moduleDetail.singularName}</span>
                    </span>

                </div>

                <div className="reportBody">

                    <ReportFilter filterObject={filterObject} getModuleRecords={getModuleRecords} fields={props.reportData.fields}></ReportFilter>

                    <div className="listContainer">
                       <List records={records} fields={fields} changeFields={changeFields} showPreview={showPreview} selectedRecordId={selectedRecordId}></List> 
                    
                        <Pagination filterObject={filterObject} getModuleRecords={getModuleRecords} recordsLength={records.length}></Pagination>
                    </div>    
                    
                    {showForm &&  <div className="recordPreviewContainer"><Form fields={fields} moduleDetail={moduleDetail} addModuleRecord={addModuleRecord} close={()=>setShowForm(false)}></Form></div>}
                    
                    {selectedRecord && <RecordView updateModuleRecord={updateModuleRecord} deleteModuleRecord={deleteModuleRecord} changeRecord={changeRecord} closeQuickView={()=>{setSelectedRecordId(null)}} record={selectedRecord} fields={fields} pageLimit={filterObject.pageLimit} recordIndex={records.findIndex(re=>re.id === selectedRecordId)}></RecordView>}    
                
                </div>
            </div>);
}