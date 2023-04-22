import { NavLink, useLoaderData, useParams } from "react-router-dom"
import { useRouteLoaderData, useNavigate } from "react-router-dom"
import { useState,useRef } from "react";
import { addFields,updateFields ,deleteFields, addModule} from "../firebase";
import NewDropdown from "./NewDropdown";

export default function ModuleManagerComponent(props){
    const params = useParams();
    const modules = useRouteLoaderData("main");
    const fields = props.fields;
    const [selectedField,setSelectedField]=useState({});
    const [moduleFields,setModuleFields]=useState(()=>{
        if(params.moduleName){
            return fields;
        }
        return [{"id":"single_line_1","new":true,"type":"single_line","default":true,"required":true}]
    });
    const [moduleName,setModuleName]=useState(()=>{
        if(params.moduleName){
            return modules.find(mo=>mo.apiName === params.moduleName)
        }
        return {"singularName":"","pluralName":"","apiName":""};
    });
    const [dragIndex,setDragIndex]=useState('');
    const fieldsCount = useRef(2);
    const navigate = useNavigate();
    var fieldsTypeNameMap = {'single_line':"Single Line","multi_line":"Multi Line","email":"Email","phone":"Phone","date":"Date","date_time":"Date Time","number":"Number","checkbox":"Checkbox","picklist":"PickList","multi-select":"Multi-Select","lookup":"Lookup"};    
    const fieldsList = ["single_line","multi_line","email","phone","date","date_time","number","checkbox","picklist","multi-select","lookup"];
    var optionFields = ["picklist","multi-select"];
    var maxLengthFields = ["single_line","multi_line"];
    const deleteField = (fieldId)=>{
        let newFields = moduleFields.filter(field=>field.id !== fieldId);
        setModuleFields(newFields);
    }
    const handleInput = (e)=>{
        setModuleFields(moduleFields.map(fi=>{
            if(fi.id === e.target.name){
                return (e.target.type=== "text"|| e.target.type=== "number")? {...fi,displayName:e.target.value}:{...fi,required:e.target.checked}
            }
            return fi;
        }))
    }
    const handleModuleNameInput = (e)=>{
        setModuleName({...moduleName,[e.target.name]:e.target.value});
    }
    const handleSelectedFieldInput = (e)=>{
        let optionIndex = e.target.name.indexOf("options_")
        if(optionIndex !== -1){
            let options = selectedField.options?[...selectedField.options]:[];
            options[parseInt(e.target.name.slice(optionIndex+8))]=e.target.value;
            setSelectedField({...selectedField,"options":options});
        }
        else{
            setSelectedField({...selectedField,[e.target.name]:((e.target.type=== "text" || e.target.type=== "number")?e.target.value:e.target.checked)})
        }
    }
    const updateLookupField = (fieldId,value)=>{
        setSelectedField({...selectedField,"lookupModule":value.apiName});
    }
    const saveModule = async()=>{
        let moduleMap = {...moduleName};
        if(!params.moduleName){
            moduleMap.apiName = moduleName.pluralName.replace(" ","_");
            moduleMap.order = modules[modules.length-1].order+1;
            moduleMap.ct = new Date().getTime();
        }    
        moduleMap.mt=new Date().getTime();
        await addModule(moduleMap,params.orgId);

        let newFields = [];
        let updatedFields = [];
        let deletedFields= [];
        moduleFields.map((field,index) =>{
            if(field.new){
                let fieldMap = {...field,"apiName":field.displayName.toLowerCase().replace(" ","_"),"hidden":false,"isCustomField":true,"isEditAllowed":true,"isFormField":true,"module":moduleName.pluralName,"mt":new Date().getTime(),"ct":new Date().getTime(),"order":index,"reportWidth":150};
                delete fieldMap.id;
                delete fieldMap.new;
                newFields.push(fieldMap);
            }
            else{
                updatedFields.push({...field,"order":index});
            }
        })
        if(params.moduleName){
            deletedFields= fields.filter(field=> {
                if(moduleFields.findIndex(fi=>fi.id === field.id) === -1)
                    return true;
                return false;    
            })
        }    
        if(newFields.length)
            await addFields(newFields,params.orgId);
        if(updatedFields.length)
            await updateFields(updatedFields,params.orgId)
        if(deletedFields.length)
            await deleteFields(deletedFields,params.orgId);      
        navigate("../module/"+moduleName.pluralName)
    };
        
    const resetModule =()=>{
        fieldsCount.current=2;
        if(params.moduleName){
            setModuleFields(fields);
        }
        else{
            setModuleFields([{"id":"single_line_1","new":true,"type":"single_line","default":true,"required":true}]);
        }
        setSelectedField({})
    }

    const saveFieldSettings = ()=>{
        setModuleFields(moduleFields.map((field)=>{
            if(field.id === selectedField.id)
                return {...selectedField}
            return field
        }))
        setSelectedField({})
    }
    const closeFieldSettings = ()=>{
        setSelectedField({})
    }
    const addNewOption = ()=>{
        setSelectedField({...selectedField,"options":(selectedField.options?[...selectedField.options,""]:[""])})
    }
    const setFieldProps=(fieldId,propName,value)=>{
        setModuleFields(moduleFields.map((field)=>{
            if(field.id === fieldId)
                return {...field,[propName]:value}
            return field
        }))
    }


    const onDragStart = (ev, index) => {
        console.log('dragstart:',index);
        ev.dataTransfer.setData("index", index);
        setDragIndex(index);
    }  
    const onDragOver = (ev,dropIndex) => {
        ev.preventDefault();
        setModuleFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => field.isDragOver);
            if(oldDragoverField === parseInt(dropIndex) || ((oldDragoverField === -1) && (dropIndex === dragIndex))){
                return tmp;
            }
            console.log("dragIndex: "+dragIndex+"dropOverIndex: "+dropIndex+" oldDragoverField : "+oldDragoverField);
            let newdragIndex = dragIndex;
            if(oldDragoverField !== -1){
                tmp[oldDragoverField].isDragOver = false;
                newdragIndex = oldDragoverField;
            }    
            let dragField ;
            if(newdragIndex.toString().indexOf("new_") === 0){
                let field = newdragIndex.substring(4);
                dragField = {"id":fieldsCount.current+"_"+field,"new":true,"type":field}
                dragField.isDragOver =true;
                tmp.splice(dropIndex,0,dragField);
            }
            else{
                dragField =  tmp[newdragIndex];
                if(dragField){
                    dragField.isDragOver =true;
                    tmp.splice(newdragIndex,1);
                    tmp.splice(dropIndex,0,dragField);
                }    
            }    
            return tmp;
        });    
    }

    const onDrop = (ev, dropIndex) => {
        let dragIndex = parseInt(ev.dataTransfer.getData("index"));
        setModuleFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => field.isDragOver);
            if(oldDragoverField === -1 && dropIndex === dragIndex){
                return tmp;
            }
            console.log("dragIndex: "+dragIndex+"dropIndex: "+dropIndex+" oldDragoverField: "+oldDragoverField);
            let newdragIndex = dragIndex;
            if(oldDragoverField !== -1){
                tmp[oldDragoverField].isDragOver = false;
                newdragIndex = oldDragoverField;
            } 
            if(oldDragoverField !== -1 && oldDragoverField === dropIndex){
                return tmp;
            } 
            let dragField ;
            if(newdragIndex.toString().indexOf("new_") === 0){
                let field = newdragIndex.substring(4);
                dragField = {"id":fieldsCount.current+"_"+field,"new":true,"type":field}
                dragField.isDragOver=false;
                tmp.splice(dropIndex,0,dragField);
            }
            else{
                dragField =  tmp[newdragIndex];
                if(dragField){
                    dragField.isDragOver=false;
                    tmp.splice(newdragIndex,1);
                    tmp.splice(dropIndex,0,dragField);
                }   
            }     
            return tmp;
        }); 
    }
    const onDragEnd = (e)=>{
        console.log("dragEnd")
        setModuleFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => field.isDragOver);
            console.log("dragEnd : oldDragoverField: "+oldDragoverField);
            if(oldDragoverField !== -1)
                 tmp[oldDragoverField].isDragOver = false;
            return tmp;
        });    
    }

    const onNewDragStart = (ev,field)=>{
        ev.dataTransfer.setData("index", "new_"+field);
        setDragIndex("new_"+field);
    }
    const onNewDragEnd = (e)=>{
        console.log("onNewDragEnd")
        setModuleFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => (field.id.indexOf(fieldsCount.current+"_") === 0 && field.new));
            if(oldDragoverField !== -1){
                fieldsCount.current+=1;
                tmp[oldDragoverField].isDragOver = false;
            }     
            return tmp;
        });    
    }
    return (<div className="moduleManagerContainer">
                <div className="moduleList">
                    <div className="mmtitle">Modules</div>
                    { modules &&
                        <>
                        <NavLink className="moduleItem" to={"../module/new"}> <span className="plusSign">+</span> New Module</NavLink>
                        {modules.map(module =>{
                            return <NavLink className="moduleItem" to={`../module/${module.apiName}/edit`}>{module.pluralName}</NavLink>
                        })}
                        </>
                    }
                </div>
                <div className="moduleForm" key={moduleName?moduleName.apiName:"new"}>
                    <div className="moduleFormInner">
                        <div className="fieldsHolder moduleName">
                            <div className="ftype">Module Name</div>
                            <div className="fNameInput"><input type="text" name="pluralName" placeholder="Plural Name" value={moduleName.pluralName} onChange={handleModuleNameInput}></input></div>
                            <div className="fNameInput"><input type="text" name="singularName" placeholder="Singluar Name" value={moduleName.singularName} onChange={handleModuleNameInput}></input></div>
                            <div className="fdelete scButtons">
                                <button className="saveButton" onClick={saveModule}>Save</button>
                                <button className="resetButton" onClick={resetModule}>Reset</button>
                            </div>
                        </div>
                        <div className="fieldsHolder header">
                            <div className="ftype">Fields List</div>
                        </div> 
                        <div class="fieldsAddContainer">
                            <div className="fieldsListContainer">
                            {  moduleFields.map((field,index) =>{
                                    return (
                                            <div className="fieldsHolderOuter" key={field.id} onDragOver={(e)=>onDragOver(e,index)} onDrop={(e)=>{onDrop(e, index)}} onDragEnd={(e)=>onDragEnd(e)}>
                                                    {(field.isDragOver? (<div className="dragover_placeholder"></div>):(<div className="fieldsHolder"  draggable={true} onDragStart = {(e) => onDragStart(e, index)}>
                                                    <div className={"fieldEditContainer"+((field.id === selectedField.id)?" selected":"")+(field.isDefault?" disabled":"")}>
                                                        <span className="fieldType disabled">{fieldsTypeNameMap[field.type]}</span>
                                                        <div className="labelInput"><input  type="text" name={field.id} placeholder="Field Name" value={field.displayName} onChange={(e)=>setFieldProps(field.id,"displayName",e.target.value)}></input></div>
                                                        <span className="fsettingsIcon">
                                                            <input type="checkbox" name={field.id} checked={field.required} onChange={(e)=>setFieldProps(field.id,"required",e.target.checked)}></input>
                                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 512 512" version="1.1"><title>mandatory</title><g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd"><g id="icon" fill="#000000" transform="translate(143.376623, 149.333333)"><polygon id="*" points="152.103896 213.333333 198.372294 180.08658 144.069264 119.411255 225.246753 103.619048 208.34632 49.3160173 131.324675 83.3939394 140.744589 2.84217094e-14 84.2251082 2.84217094e-14 93.6450216 83.3939394 16.6233766 49.3160173 0 103.619048 80.9004329 119.411255 26.5974026 180.08658 73.1428571 213.333333 112.484848 141.298701"></polygon></g></g></svg>
                                                        </span>
                                                        <span className="fsettingsIcon">
                                                            {!field.hidden && <svg onClick={()=>setFieldProps(field.id,"hidden",true)} xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z" fill="#000000"/></svg>}
                                                            {field.hidden && <svg onClick={()=>setFieldProps(field.id,"hidden",false)} xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z" fill="#000000"/></svg>}
                                                        </span>
                                                        <span className="fsettingsIcon">
                                                            <svg onClick={()=> deleteField(field.id)} xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                                        </span>
                                                        <span className="fsettingsIcon settingsIcon" onClick={()=>{setSelectedField(field)}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M11 3H13C13.5523 3 14 3.44772 14 4V4.56879C14 4.99659 14.2871 5.36825 14.6822 5.53228C15.0775 5.69638 15.5377 5.63384 15.8403 5.33123L16.2426 4.92891C16.6331 4.53838 17.2663 4.53838 17.6568 4.92891L19.071 6.34312C19.4616 6.73365 19.4615 7.36681 19.071 7.75734L18.6688 8.1596C18.3661 8.46223 18.3036 8.92247 18.4677 9.31774C18.6317 9.71287 19.0034 10 19.4313 10L20 10C20.5523 10 21 10.4477 21 11V13C21 13.5523 20.5523 14 20 14H19.4312C19.0034 14 18.6318 14.2871 18.4677 14.6822C18.3036 15.0775 18.3661 15.5377 18.6688 15.8403L19.071 16.2426C19.4616 16.6331 19.4616 17.2663 19.071 17.6568L17.6568 19.071C17.2663 19.4616 16.6331 19.4616 16.2426 19.071L15.8403 18.6688C15.5377 18.3661 15.0775 18.3036 14.6822 18.4677C14.2871 18.6318 14 19.0034 14 19.4312V20C14 20.5523 13.5523 21 13 21H11C10.4477 21 10 20.5523 10 20V19.4313C10 19.0034 9.71287 18.6317 9.31774 18.4677C8.92247 18.3036 8.46223 18.3661 8.1596 18.6688L7.75732 19.071C7.36679 19.4616 6.73363 19.4616 6.34311 19.071L4.92889 17.6568C4.53837 17.2663 4.53837 16.6331 4.92889 16.2426L5.33123 15.8403C5.63384 15.5377 5.69638 15.0775 5.53228 14.6822C5.36825 14.2871 4.99659 14 4.56879 14H4C3.44772 14 3 13.5523 3 13V11C3 10.4477 3.44772 10 4 10L4.56877 10C4.99658 10 5.36825 9.71288 5.53229 9.31776C5.6964 8.9225 5.63386 8.46229 5.33123 8.15966L4.92891 7.75734C4.53838 7.36681 4.53838 6.73365 4.92891 6.34313L6.34312 4.92891C6.73365 4.53839 7.36681 4.53839 7.75734 4.92891L8.15966 5.33123C8.46228 5.63386 8.9225 5.6964 9.31776 5.53229C9.71288 5.36825 10 4.99658 10 4.56876V4C10 3.44772 10.4477 3 11 3Z" stroke="#000000" stroke-width="1.5"/><path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" stroke="#000000" stroke-width="1.5"/></svg>
                                                        </span>
                                                    </div>
                                                </div>))}
                                            </div>    
                                    )
                                })
                            }  
                            </div>
                            { selectedField.id && <div><div className="fieldSettingsPopupOuter"></div>
                            <div className="fieldSettingsPopup">
                                <div className="fieldSettingsItem">
                                    <div>Field Label</div>
                                    <div className="fsInput"><input type="text" name="displayName" value={selectedField.displayName} onChange={handleSelectedFieldInput}></input></div>
                                </div>
                                <div className="fieldSettingsItem">
                                    <div>Mark as required</div>
                                    <div className="fsInput"><input type="checkbox" name="required" checked={selectedField.required} onChange={handleSelectedFieldInput}></input></div>
                                </div>
                                <div className="fieldSettingsItem">
                                    <div>Hide in Report</div>
                                    <div className="fsInput"><input type="checkbox" name="hidden" checked={selectedField.hidden} onChange={handleSelectedFieldInput}></input></div>
                                </div>
                                {selectedField.type === "number" && <>
                                <div className="fieldSettingsItem">
                                    <div>Min Value</div>
                                    <div className="fsInput"><input type="number" name="minValue" value={selectedField.minValue?selectedField.minValue:""} onChange={handleSelectedFieldInput}></input></div>
                                </div>
                                <div className="fieldSettingsItem">
                                    <div>Max value</div>
                                    <div className="fsInput"><input type="number" name="maxValue" value={selectedField.maxValue?selectedField.maxValue:""} onChange={handleSelectedFieldInput}></input></div>
                                </div>
                                </>}
                                {(maxLengthFields.indexOf(selectedField.type) !== -1) &&
                                <div className="fieldSettingsItem">
                                    <div>Max Length</div>
                                    <div className="fsInput"><input type="number" name="maxLength" value={selectedField.maxLength?selectedField.maxLength:""} onChange={handleSelectedFieldInput}></input></div>
                                </div>
                                }
                                { (optionFields.indexOf(selectedField.type) !== -1) &&
                                <div className="fieldSettingsItem">
                                    <div>Options</div>
                                    <div className="optionsContainer">
                                        <div className="addOptionButton" onClick={addNewOption}>
                                            {/* <span className="addIcon">+</span>  */}
                                            <span>Add New Option</span>
                                        </div>
                                        { selectedField.options && <>{
                                            selectedField.options.map((opt,index)=>{
                                                return (
                                                    <div className="fsInput"><input type="text" name={"options_"+index} value={opt} onChange={handleSelectedFieldInput}></input></div>
                                                )
                                            })
                                        }</>}
                                    </div>
                                </div>
                                }
                                {selectedField.type === "lookup" &&
                                    <div className="fieldSettingsItem">
                                        <div>Choose Module</div>
                                        <NewDropdown items={modules} setSelection={updateLookupField} showField={"apiName"} uniqueName="apiName" fieldName={selectedField.id} selectedItem={selectedField.lookupModule}></NewDropdown>
                                    </div>
                                }
                                <div className="fieldSettingsItem">
                                    <div className="sfEdit scButtons">
                                        <button className="saveButton" onClick={saveFieldSettings}>Save</button>
                                        <button className="resetButton" onClick={closeFieldSettings}>Cancel</button>
                                    </div>
                                </div>
                            </div></div>
                            }
                        </div>    
                    </div>    
                </div>
                <div className="fieldsList">
                    <div className="mmtitle">Fields</div>
                {
                    fieldsList.map(field=>{
                        return <div key={field} className="templateField" draggable={true} onDragStart = {(e) => onNewDragStart(e, field)} onDragEnd={(e)=>onNewDragEnd(e)}>
                           <div className="fieldName">{field[0].toUpperCase()+field.slice(1).replace("_"," ")}</div> 
                          {/* <div className="addButton" onClick={()=>addField(field)}>Add</div> */}
                        </div>
                    })
                }   
                </div>
            </div>)
}