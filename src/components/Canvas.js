import { useState } from "react";
import Dropdown from "./Dropdown";
import FieldsSettingPopup from "./FieldsSettingPopup";
export default function Canvas(props){
    let isAllSelected=false;
    const [isShowFieldSetting,setShowFieldSetting]=useState(false);
    const pagesList = [20,40,60,80,100];
    const closePopup =()=>{
        setShowFieldSetting(preProps=>!preProps);
    }
    return (<div>
            <div className="listHeader">
               <Dropdown items={pagesList} selectedItem={pagesList[0]}></Dropdown>
               <div className="pagination">
               <span>Total Records : 100</span>
               <span>pre</span>
               <span>1</span>
               <span>Next</span>
               </div>
            </div>
            <div className="listBody">
            { isShowFieldSetting && <FieldsSettingPopup close={closePopup} fields={props.fields}/>}
            <div className="recordsContainer">
                <div className="recordHeader">
                    <div className="ddCheckbox header">
                        <input type="checkbox" className="ddCheckboxInner" checked={isAllSelected} onChange={()=>console.log("checkbox cliked")}/>
                    </div>
                    {
                        props.fields.map(field =>{
                            return (!field.hidden && <div className="fieldItem header" key={field.id} style={{minWidth:field.reportWidth}}>{field.displayName}<span className="widthResizer"></span></div> )
                        })
                       
                    }
                    <span className="fieldSetting" onClick={closePopup}>Settings</span>
                </div>
                {
                    props.records.map(record =>{
                        return  <div className="recordItem" key={record.id}>
                                    <div className="ddCheckbox">
                                        <input type="checkbox" className="ddCheckboxInner" checked={record.isSelected} onChange={()=>console.log("checkbox cliked")}/>
                                    </div>
                                    {
                                        props.fields.map(field =>{
                                            return (!field.hidden && <div className="fieldItem" key={record.id+"-"+field.id} style={{minWidth:field.reportWidth}}>{record[field.apiName]}</div>)
                                        })
                                    }           
                                </div>
                    })
                }
            </div></div></div>);
}