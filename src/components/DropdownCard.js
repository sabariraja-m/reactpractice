import { useState } from "react";

export default function DropdownCard(props){
    const [isSelected, setSelection]= useState(()=>{return props.isSelected;});

    const selectItem = (e)=>{
        e.stopPropagation();
        console.log(props.item.id);
        setSelection(preProps=>{
            props.setSelection(e,props.item.id,!preProps);
            return !preProps;
        });
     
    }

    return (
            <div className="ddObjectItem" key={props.item.id} onClick={(e)=>selectItem(e)}>
                {props.isMultiSelect && (<div className="ddCheckbox">
                    <input type="checkbox" className="ddCheckboxInner" checked={isSelected} onChange={()=>console.log("checkbox cliked")}/>
                </div>)}
                {(props.icon?true:false)&&<div><img className="ddItemImage" alt="" src={(props.item[props.icon]?props.item[props.icon]:"https://semantic-ui.com/images/avatar2/small/molly.png")}/></div>}
                {props.showField && <div className="ddItem">{props.item[props.showField]}</div>}
                {!props.showField && <div className="ddItemDetails">
                    <div className="ddItemDetailsInner">
                    <div className="ddItemHeader">{props.item.name}</div>
                    <div>{props.item.designation}</div>
                    </div>
                </div>
                }
            </div> 
        );
}
