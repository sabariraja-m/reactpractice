import { useEffect, useState } from "react"
import NewDropdown from "./NewDropdown";
import Datepicker from "./Datepicker";
import { useNavigate } from "react-router-dom";
import { useModuleDispatch } from "./ModuleDataContext";
import { createElement } from "react";
export default function RecordView(props){
    const [showMoreActions,setShowMoreActions]=useState(false);
    const [editFields,setEditFields]=useState({});
    const [showDeleteConfirmPopup,setShowDeleteConfirmPopup]=useState(false);
    const navigate = useNavigate();
    const {status,error,setStatus,setError,handleModuleDispatch} = useModuleDispatch();
    const isLoading = status === "loading";
    const isError = status === "error";
    const inputFields=["single_line","multi_line","email","phone","number","checkbox"];
    const dropdownFields = ["picklist","multi-select","lookup"];
    const dataType = {"single_line":"text","multi_line":"text","email":"email","phone":"text","number":"number","checkbox":"checkbox"};
    const fieldsTag = {"single_line":"input","multi_line":"textarea","email":"input","phone":"input","number":"input","checkbox":"input","picklist":NewDropdown,"multi-select":NewDropdown,"lookup":NewDropdown,"date":Datepicker,"date_time":Datepicker};

    useEffect(()=>{
        if(status === "success"){
            setEditFields({});
            setStatus(null);
        }    
    },[status])
    const handleButtonClick = (action)=>{
        if(action === "detailView"){
            navigate("../"+props.record.id);
        }
        else if(action === "edit"){
            let editFields = {};
            props.fields.map(field =>{
                editFields[field.apiName]= props.record[field.apiName];
            })
            setEditFields(editFields);
        }
        else if(action === "delete"){
            setShowDeleteConfirmPopup(true)
        }  
        else if(action === "prev"){
            props.changeRecord(-1)
        }  
        else if(action === "next"){
            props.changeRecord(1);
        } 
        else if(action === "close") {
            props.closeQuickView();
        }
        else{
            console.log(action);
        }
    }

    const editField = (apiName)=>{
        setEditFields({[apiName]:props.record[apiName]});
    }
    const updateEditField = (apiName,value)=>{
        setEditFields({...editFields,[apiName]:getAPIFormattedValue(apiName,value)});
    }
    const updateFields = async()=>{
        await handleModuleDispatch({"type":"update","id":props.record.id,editFields,"fields":props.fields})
    }
    const deleteRecord =async()=>{
        await handleModuleDispatch({"type":"delete","id":props.record.id});
        props.closeQuickView();
    }
   
    const cancelEdit = ()=>{
        setEditFields({})
        setStatus(null);
        setError(null);
    }
    const getAPIFormattedValue = (apiName,value)=>{
        let field = props.fields.find(fi => fi.apiName === apiName);
        if(field.type === "date" || field.type === "date_time"){
            return new Date(value).getTime();
        }    
        else if(field.type === "lookup"){
            return {"name":value.name,"id":value.id};
        }
        return value;
    }
    const getFormattedFieldValue =(field)=>{
        if(field.apiName && isValid(props.record[field.apiName])){
            if(field.type === "date"){
                return new Date(props.record[field.apiName]).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });
            }
            else if(field.type === "date_time"){
                return new Date(props.record[field.apiName]).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hourCycle: 'h23'
                });
            }
            else if(field.type === "lookup"){
                return props.record[field.apiName].name;
            }
            else if(field.type === "checkbox"){
                return <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
              >
                <rect width={16} height={16} id="icon-bound" fill="none" />
                <path d="M0,9.014L1.414,7.6L5.004,11.189L14.593,1.6L16.007,3.014L5.003,14.017L0,9.014Z" />
              </svg>;
            }
            else if(field.type === "multi-select"){
                let values ="";
                props.record[field.apiName].map(val=>values=values+","+val);
                return (values.length>0)?values.slice(1):"-"
            }
            return props.record[field.apiName];
        }
        return "-";    
    }
    const isValid = (value)=>{
        return (value != "" && value != undefined && value != null);
    }
    var isAllFieldEditable = false;
    if(Object.keys(editFields).length === props.fields.length)
        isAllFieldEditable = true;
    console.log(editFields);

    
    const getInputProps = (field)=>{
        if(field.type === "date" || field.type === "date_time")
            return {style:{"width":"206px"}, leftPos:"-40px", fieldName:field.apiName, setSelection:updateEditField, selectedDate:editFields[field.apiName], ...((field.type === "date_time") ? {leftPos:"-80px", innnerStyle:{"left":"-80px"}, showTimePicker:true}:{})};
            
        else if(field.type === "checkbox")
            return {type:"checkbox", checked:editFields[field.apiName], onChange:(e)=>{setEditFields({...editFields,[field.apiName]:e.target.checked})}};
        
        else if(dropdownFields.indexOf(field.type) !== -1)
            return {style:{"width":"206px"}, items:field.options, setSelection:updateEditField, fieldName:field.apiName, selectedItem:editFields[field.apiName], isMultiSelect:(field.type === "multi-select"), lookupModule:field.lookupModule};
        
        else if (inputFields.indexOf(field.type) !== -1)
            return {type:dataType[field.type], value:editFields[field.apiName], onChange:(e)=>{setEditFields({...editFields,[field.apiName]:e.target.value})}}
        
        return {};
    }
    return  <div className="recordPreviewContainer">
                <div className="recordPreviewInner">
                        <div className="recordButtons">
                            <span className="buttonItem" onClick={()=>handleButtonClick("edit")}>Edit</span>
                            <div className="buttonItem">
                                <div className="buttonListInner">
                                    <span className="" onClick={()=>handleButtonClick("delete")}> Delete</span>
                                  
                                </div>
                            </div>
                            <span className={"buttonItem" + ((props.recordIndex === 0)? " disabled":"")} onClick={()=>handleButtonClick("prev")}>
                                <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" width="12" height="12" viewBox="0 0 256 256" >
                                    <defs>
                                    </defs>
                                    <g  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <polygon points="20.48,45 59.75,90 69.52,81.48 37.69,45 69.52,8.52 59.75,0 "  transform="  matrix(1 0 0 1 0 0) "/>
                                    </g>
                                </svg>
                            </span>

                            <span className={"buttonItem"+ ((props.recordIndex >= props.pageLimit-1)? " disabled":"")} onClick={()=>handleButtonClick("next")}>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" viewBox="0 0 256 256" >
                                    <defs>
                                    </defs>
                                    <g  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <polygon points="69.52,45 30.25,90 20.48,81.48 52.31,45 20.48,8.52 30.25,0 " transform="  matrix(1 0 0 1 0 0) "/>
                                    </g>
                                </svg>
                            </span>
                            <span className="buttonItem" onClick={()=>handleButtonClick("close")}>Close</span>
                        </div>
                        <div className="recordFieldsContainer"><div className="recordFieldsContainerInner">
                        {
                            props.fields.map(field =>{
                                return field.isFormField && <div className="fieldView" key={field.id}>
                                    <span className="fieldlabel">{field.displayName}</span>
                                        {editFields.hasOwnProperty(field.apiName)?
                                            (<div className="fieldValue">
                                                <div>{createElement(fieldsTag[field.type],getInputProps(field))}  
                                                
                                                    {!isAllFieldEditable && 
                                                        <span className="editIcon" >
                                                            <svg onClick={updateFields} width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="circleOkIconTitle" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title id="circleOkIconTitle">OK</title> <polyline points="7 13 10 16 17 9"></polyline> <circle cx="12" cy="12" r="10"></circle> </g></svg>
                                                            <svg onClick={cancelEdit} fill="#000000" width="24px" height="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,17.4,10,7.41,7.41,0,0,1,10,17.4ZM13.29,5.29,10,8.59,6.71,5.29,5.29,6.71,8.59,10l-3.3,3.29,1.42,1.42L10,11.41l3.29,3.3,1.42-1.42L11.41,10l3.3-3.29Z"></path> </g> </g></svg>
                                                        </span>
                                                    } 
                                                </div>     
                                                {isError && error[field.id] && <div className="fieldError">{error[field.id]}</div>} 
                                            </div>) : 
                                            (<div className="fieldValue view">
                                                <span>{getFormattedFieldValue(field)}</span>
                                                <span className="editIcon" onClick={()=>editField(field.apiName)}>
                                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.99512 17.2072V19.5C3.99512 19.7761 4.21897 20 4.49512 20H6.79289C6.9255 20 7.05268 19.9473 7.14645 19.8536L16.5942 10.4058L13.5935 7.40518L4.14163 16.8535C4.04782 16.9473 3.99512 17.0745 3.99512 17.2072Z" fill="#000000"></path> <path d="M14.8322 6.16693L17.8327 9.16734L19.2929 7.7071C19.6834 7.31658 19.6834 6.68341 19.2929 6.29289L17.707 4.70697C17.3165 4.3165 16.6834 4.31644 16.2929 4.70684L14.8322 6.16693Z" fill="#000000"></path> </g></svg>
                                                </span>
                                            </div>)  
                                        }    
                                </div>
                            })
                            
                        }
                        </div></div>
                        {isAllFieldEditable && 
                            <div className="filterFooter">
                                <div className={"applyButton"+(isLoading?" disabled":"")} onClick={updateFields}>Save</div>
                                <div className="clearButton" onClick={cancelEdit}>Cancel</div>
                            </div>   
                        }
                        {showDeleteConfirmPopup &&
                            <div className="deleteConfirmPopup">
                                <div className="popupContent">Are you sure to delete this record?</div>
                                <div className="popupButtons">
                                    <button className="confirm" onClick={deleteRecord}>Confirm</button>
                                    <button className="cancel" onClick={()=>setShowDeleteConfirmPopup(false)}>Cancel</button>
                                </div>
                            </div>
                        }
                        
                </div>
            </div>    
}