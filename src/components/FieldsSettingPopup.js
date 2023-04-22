import {useState } from "react";

export default function FieldsSettingPopup(props){
    const [fields,setFields] = useState(props.fields);

    const [dragIndex,setDragIndex]=useState();

    const showHideField =(fieldId)=>{
        setFields((fields)=>{
            return fields.map((field)=>{
                if(field.id === fieldId){
                    return {...field,hidden:!field.hidden}
                }
                return field;
            })
        });
    }
    const applyChanges = (e)=>{
        props.closePopOver(e,fields);
    }
    const onDragStart = (ev, index) => {
        // console.log('dragstart:',index);
        ev.dataTransfer.setData("index", index);
        setDragIndex(index);
    }  
    const onDragOver = (ev,dropIndex) => {
        ev.preventDefault();
        setFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => field.isDragOver);
            if(oldDragoverField === parseInt(dropIndex) || ((oldDragoverField === -1) && (dropIndex === dragIndex))){
                return tmp;
            }
            // console.log("dragIndex: "+dragIndex+"dropOverIndex: "+dropIndex+" oldDragoverField : "+oldDragoverField);
            let newdragIndex = dragIndex;
            if(oldDragoverField !== -1){
                tmp[oldDragoverField].isDragOver = false;
                newdragIndex = oldDragoverField;
            }    
            let dragField =  tmp[newdragIndex];
            if(dragField){
                dragField.isDragOver =true;
                tmp.splice(newdragIndex,1);
                tmp.splice(dropIndex,0,dragField);
            }    
            return tmp;
        });    
    }

    const onDrop = (ev, dropIndex) => {
        let dragIndex = parseInt(ev.dataTransfer.getData("index"));
        setFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => field.isDragOver);
            if(oldDragoverField === -1 && dropIndex === dragIndex){
                return tmp;
            }
            // console.log("dragIndex: "+dragIndex+"dropIndex: "+dropIndex+" oldDragoverField: "+oldDragoverField);
            let newdragIndex = dragIndex;
            if(oldDragoverField !== -1){
                tmp[oldDragoverField].isDragOver = false;
                newdragIndex = oldDragoverField;
            } 
            if(oldDragoverField !== -1 && oldDragoverField === dropIndex){
                return tmp;
            } 
            let dragField =  tmp[newdragIndex];
            if(dragField){
                dragField.isDragOver=false;
                tmp.splice(newdragIndex,1);
                tmp.splice(dropIndex,0,dragField);
            }    
            return tmp;
        }); 
    }
    const dragEnd = (e)=>{
        setFields((viewFields)=>{
            let tmp = JSON.parse(JSON.stringify(viewFields));
            let oldDragoverField = tmp.findIndex(field => field.isDragOver);
            if(oldDragoverField !== -1)
                 tmp[oldDragoverField].isDragOver = false;
            return tmp;
        });    
    }
    return<div><div className="popupOverlay"> </div><div className="fieldsSettingContainer">
        <div className="fieldSettingHeader">Manage Columns</div>
        <div className="fieldsSearchbar">
            <svg width="16px" height="16px"  id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><title>Trade_Icons</title><path d="M6.57,1A5.57,5.57,0,1,1,1,6.57,5.57,5.57,0,0,1,6.57,1m0-1a6.57,6.57,0,1,0,6.57,6.57A6.57,6.57,0,0,0,6.57,0Z"/><rect x="11.84" y="9.87" width="2" height="5.93" transform="translate(-5.32 12.84) rotate(-45)"/></svg>
            <input type={"text"} placeholder={"Search"}></input>
        </div>
        <div className="fieldsContainer" >
        {
            fields.map((field,index) =>{
                return  <div key={field.id+"-setting"} onDragOver={(e)=>onDragOver(e,index)} onDrop={(e)=>{onDrop(e, index)}} onDragEnd={(e)=>dragEnd(e)}>
                            {(field.isDragOver? (<div className="dragover_placeholder"></div>):(<div className="fieldSettingItem"  draggable={true} onDragStart = {(e) => onDragStart(e, index)}>
                                    <span className="dragIcon">
                                        <svg className="svg-icon" style={{"width" : "1em" ,"height": "1em","fill": "currentColor","overflow": "hidden"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M341.333333 85.333333h101.973334v101.973334H341.333333V85.333333z m231.765334 0h101.973333v101.973334h-101.973333V85.333333zM341.333333 326.4h101.973334v101.973333H341.333333V326.4z m231.765334 0h101.973333v101.973333h-101.973333V326.4zM341.333333 567.381333h101.973334v101.973334H341.333333v-101.973334z m231.765334 0h101.973333v101.973334h-101.973333v-101.973334zM341.333333 808.490667h101.973334v101.973333H341.333333v-101.973333z m231.765334 0h101.973333v101.973333h-101.973333v-101.973333z"  /></svg>
                                    </span>
                                    <div className={"fieldCheckbox"+(field.hidden?" unChecked":"")} onClick={()=>showHideField(field.id)}>
                                        <div className="ddCheckbox header">
                                            <input type="checkbox" className="ddCheckboxInner" checked={true} onChange={()=>console.log("checkbox cliked")}/>
                                        </div>
                                        <span className="fieldItem" key={field.id}>{field.displayName}</span>
                                    </div>    
                                </div>))}
                        </div>
            })
        }
        </div>
        <div className="fieldSettingFooter"><div className="fieldSettingButton" onClick={applyChanges}>Apply</div><div className="fieldSettingButton" onClick={props.closePopOver}>Cancel</div></div>
    </div></div>
}