import { useState } from "react";
import NewDropdown from "./NewDropdown";
import Datepicker from "./Datepicker";
import { useModuleDispatch } from "./ModuleDataContext";
import { createElement } from "react";
export default function Form(props){
    const {status,error,handleModuleDispatch} = useModuleDispatch();
    if(status === "success")
        props.close();
    const [editFields,setEditFields]=useState({});
    const isLoading = status === "loading";
    const isError = status === "error";
    const inputFields=["single_line","multi_line","email","phone","number","checkbox"];
    const dropdownFields = ["picklist","multi-select","lookup"];
    const dataType = {"single_line":"text","multi_line":"text","email":"email","phone":"text","number":"number","checkbox":"checkbox"};
    const fieldsTag = {"single_line":"input","multi_line":"textarea","email":"input","phone":"input","number":"input","checkbox":"input","picklist":NewDropdown,"multi-select":NewDropdown,"lookup":NewDropdown,"date":Datepicker,"date_time":Datepicker};

    const updateEditField = (apiName,value)=>{
        setEditFields({...editFields,[apiName]:getAPIFormattedValue(apiName,value)});
        console.log(value)
    }
    const addRecord = ()=>{
        handleModuleDispatch({"type":"add",editFields,"fields":props.fields})
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
    return (
        <div className="recordPreviewContainer">
            <div className="recordPreviewInner">
                <div className="formHeader">
                    <span>Create {props.moduleDetail.singularName}</span>
                </div>
                <div className="recordFieldsContainer"><div className="recordFieldsContainerInner">
                {
                    props.fields.map(field =>{
                        return field.isFormField && <div className="fieldView" key={field.id}>
                            <span className="fieldlabel">{field.displayName}</span>
                            <div className="fieldValue"> 
                                {createElement(fieldsTag[field.type],getInputProps(field))}  
                                {isError && error[field.id] && <div className="fieldError">{error[field.id]}</div>}
                            </div>
                        </div>
                    })
                }
                </div></div>
                <div className="filterFooter">
                    <div className={"applyButton" +(isLoading?" disabled":"")} onClick={addRecord}>Save</div>
                    <div className="clearButton" onClick={props.close}>Cancel</div>
                </div>    
            </div>
            </div>
    )
}

