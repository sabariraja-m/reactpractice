import { createContext , useContext , useEffect, useReducer, useState } from "react";
import { getRecords , addRecord,updateRecord, deleteRecord,updateFields, getReportData } from "../firebase";
import { useParams } from "react-router-dom";
const ModuleContext = createContext(null); 
const ModuleDispatchContext = createContext(null);
const FilterContext = createContext(null);

export default function ModuleDataProvider(props){
    const {moduleName,orgId} = useParams();
    const [moduleData,dispatch]=useReducer(handleModuleData,{"records":[],"fields":[],"isLoading":false});
    const [filter,setFilter]=useState({"sortBy":"created_time","sortOrder":"Asc","criteriaList":[],"pageLimit":20,"currentPage":1,"firstVisible":null,"lastVisible":null})
    
    useEffect(()=>{
        async function setInitData(){
            dispatch({"type":"setLoading","isLoading":true})
            let reportData = await getReportData({moduleName,orgId});
            dispatch({"type":"setInit","state":{"fields":reportData.fields,"records":reportData.records.records,"isLoading":false}})
            setFilter({"sortBy":"created_time","sortOrder":"Asc","criteriaList":[],"pageLimit":20,"currentPage":1,"firstVisible":reportData.records.firstVisible,"lastVisible":reportData.records.lastVisible})
        }
        setInitData()
    },[moduleName,orgId])
    
    return (<ModuleContext.Provider value={moduleData}>
                <ModuleDispatchContext.Provider value={dispatch}>
                    <FilterContext.Provider value={{filter,setFilter}}>
                        {props.children}
                    </FilterContext.Provider>
                </ModuleDispatchContext.Provider>
            </ModuleContext.Provider>)
}

export function useModuleFilter(){
    return useContext(FilterContext);
}
export function useModuleData(){
    return useContext(ModuleContext);
}

function handleModuleData(state,action){
    switch (action.type){
        case 'setLoading':{
            return {...state,"isLoading":action.isLoading};
        }
        case 'setInit':{
            return action.state;
        }
        case 'set':{
            return {...state,"records":action.records};
        }
        case 'add':{
            return {...state,"records":[action.record,...state.records]};
        }
        case 'update':{
            let records = state.records.map((record)=>{
                if(record.id === action.id)
                    return {...record,...action.record};
                return record;
            })
            return {...state,records};
        }
        case 'delete':{
            let records = state.records.filter((record)=>{
                return record.id !== action.id;
            })
            return {...state,records};
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        } 
    }
}

export function useModuleDispatch(props){
    const dispatch = useContext(ModuleDispatchContext);
    const [status,setStatus] = useState(null);
    const [error,setError] = useState(null);
    const {setFilter}=useContext(FilterContext);
    const params = useParams();
   
    const handleModuleDispatch = async(action)=>{
        let functionMap = {"get":getModuleRecords,"add":addModuleRecord,"update":updateModuleRecord,"delete":deleteModuleRecord}
        if(functionMap[action.type]){
            setStatus("loading");
            let res = await functionMap[action.type](action,params);
            if(res.status === "success"){
                if(res.action && res.action.filter)
                    setFilter({...res.action.filter})
                dispatch(res.action);
            }    
            setStatus(res.status);
            setError(res.error);
        }
    }
    return {status,error,setStatus,setError,handleModuleDispatch};
}

const getModuleRecords=async (action,params)=>{   
    let filter = action.filter
    let sortOrder = filter.sortOrder.toLowerCase();
    if(action.filterKey === "prevPage")
        sortOrder = "desc";
    let tmp = await getRecords(params.orgId,params.moduleName,filter.criteriaList,[filter.sortBy,sortOrder],filter.pageLimit,filter.pageQuery,filter.pagination);
    let pageQueryMap= {"firstVisible":tmp.firstVisible,"lastVisible":tmp.lastVisible}
    if(action.filterKey === "prevPage"){
        tmp.records = tmp.records.reverse();
        pageQueryMap= {"firstVisible":tmp.lastVisible,"lastVisible":tmp.firstVisible};
    }  
    return {"status":"success","action":{"type":"set","records":tmp.records,"filter":{...filter,...pageQueryMap}}};
}
const addModuleRecord = async(action,params)=>{
    let error = validateFields(action.editFields,action.fields);
    if(error){
        return {"status":"error",error};
    }    
    let dataMap = action.editFields;
    dataMap.module = params.moduleName;
    dataMap.created_time=new Date().getTime();
    Object.keys(dataMap).map(key=>{
        if(dataMap[key] === undefined)
            delete dataMap[key];
        return key;
    })
    let recordId = await addRecord(params.orgId,dataMap); 
    dataMap.id = recordId;
    return {"status":"success","action":{"type":"add","record":dataMap}};
}
const updateModuleRecord = async(action,params)=>{
    let error = validateFields(action.editFields,action.fields);
    if(error){
        return {"status":"error",error};
    }    
    let dataMap = {...action.editFields};
    Object.keys(dataMap).map(key=>{
        if(dataMap[key] === undefined)
            delete dataMap[key];
        return key;
    })
    dataMap.module = params.moduleName;
    let res = await updateRecord(params.orgId,action.id,dataMap);
    return {"status":"success","action":{"type":"update","id":action.id,"record":dataMap}};
}
const deleteModuleRecord = async(action,params)=>{
    await deleteRecord(params.orgId,params.moduleName,action.id);
    return {"status":"success",action};
}

const validateFields = (fieldValues,fields)=>{
    let errors={};
    let keys = Object.keys(fieldValues); 
    if(keys.length === 1){
        let fi = fields.find(fi=>fi.apiName === keys[0])
        let error=getError(fi,fieldValues[fi.apiName]);
        error && (errors[fi.id]=error);
    }
    else{
        fields.forEach(fi => {
            let error=getError(fi,fieldValues[fi.apiName]);
            error && (errors[fi.id]=error);
        });
    }    
    if(Object.keys(errors).length)
        return errors;
    return null;
}
const getError =(field,value)=>{
    if(field.required && !value)
        return "Field is required."
    else if(value){
        if(field.maxLength && value.length > field.maxLength)
            return "Length is greater than Max Length allowed."
        else if(field.maxValue && value > field.maxValue)
            return"Length is greater than Max Value allowed."
        else if(field.minValue && value < field.minValue)
            return"Length is smaller than Min Value allowed."
    }
    return null;
}