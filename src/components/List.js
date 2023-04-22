import { useState,useEffect } from "react";
import RecordItem from "./RecordItem";
import { memo } from "react";
const List = memo(function List(props) {
    let isAllSelected=false; 
    const [viewFields,setViewFields] = useState(props.fields);
    const [hoverFieldId,setHoverFieldId]=useState(0);
    useEffect(() => {
        return ()=>{
            props.changeFields(viewFields);
        }
    },[])
    useEffect(() => {
        // console.log("hoverField - "+hoverFieldId)
        const handleMouseMove = (event) => {
            event.stopPropagation()
            // console.log("mousemove - "+hoverFieldId);
            if(hoverFieldId && event.movementX){
                setViewFields((oldFields)=>{
                    let newFields = oldFields.map((field)=>{
                        if(hoverFieldId && field.id === hoverFieldId){
                            field.reportWidth=field.reportWidth + event.movementX;
                        }
                        return field
                    })
                    return newFields;
                }) 
            }
        };
        const handleMouseUp = (event) =>{
            event.stopPropagation()
            if(hoverFieldId){
                // console.log("mouseup - "+hoverFieldId);
                setViewFields((oldFields)=>{
                    let newFields = oldFields.map((field)=>{
                        if(field.id === hoverFieldId){
                            field.height="100%";
                        }
                        return field
                    })
                    setHoverFieldId(0);
                    return newFields;
                }) 
            }    
        }
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove',handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [hoverFieldId]);

    const handleMouseDown =(event,fieldId)=>{
        event.stopPropagation();
        // console.log("mousedown - "+hoverFieldId)
        setHoverFieldId((oldfieldId)=>{
            if(!oldfieldId){
                setViewFields((oldFields)=>{
                    let newFields = oldFields.map((field)=>{
                        if(field.id === fieldId){
                            field.height= "100vh";
                        }
                        return field
                    })
                    return newFields;
                }) 
                return fieldId;
            }   
            return oldfieldId; 
        });
    }
    const getFormattedFieldValue =(field,record)=>{
        if(field.apiName && isValid(record[field.apiName])){
            if(field.type === "date"){
                return new Date(record[field.apiName]).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });
            }
            else if(field.type === "date_time"){
                return new Date(record[field.apiName]).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hourCycle: 'h23'
                });
            }
            else if(field.type === "lookup"){
                return record[field.apiName].name;
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
                record[field.apiName].map(val=>values=values+","+val);
                return (values.length>0)?values.slice(1):"-"
            }
            return record[field.apiName];
        }
        return "-";    
    }
    const isValid = (value)=>{
        return (value != "" && value != undefined && value != null);
    }
    return ( <div className="recordsContainerWrapper" >
                <div className="recordsContainer">
                    <div className="recordHeader">
                        <div className="ddCheckbox header">
                            <input type="checkbox" className="ddCheckboxInner" checked={isAllSelected} onChange={()=>console.log("checkbox cliked")}/>
                        </div>
                        {
                            viewFields.map(field =>{
                                return (!field.hidden && <div className="fieldItem header" key={field.id} style={{width:field.reportWidth,maxWidth:field.reportWidth}}><span className="fieldText">{field.displayName}</span><span className="widthResizer" id={"width_"+field.id} style={{height:(field.height)}} onMouseDown={(e)=>{handleMouseDown(e,field.id)}}></span></div> ) 
                            })
                        }
                    </div>
                    {
                        props.records.map(record =>{
                            return  <RecordItem  key={record.id} selectedRecordId={props.selectedRecordId} record={record} showPreview={props.showPreview} viewFields={viewFields} getFormattedFieldValue={getFormattedFieldValue}></RecordItem>
                        })
                    }
                </div>    
           </div>);
})
export default List;