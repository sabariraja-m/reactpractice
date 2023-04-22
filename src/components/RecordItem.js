import { memo } from "react"

const RecordItem = function RecordItem(props){
    var selectedBgColor = "white";
    if(props.selectedRecordId === props.record.id)
        selectedBgColor = "lightgrey"

    return ( <div className="recordItem" key={props.record.id} onClick={()=>props.showPreview(props.record.id)} >
                <div className="ddCheckbox" style={{backgroundColor:selectedBgColor}}>
                    <input type="checkbox" className="ddCheckboxInner" checked={props.record.isSelected} onChange={()=>console.log("checkbox cliked")}/>
                </div>
                {
                    props.viewFields.map((field,index) =>{
                        return (!field.hidden && <div className="fieldItem" key={field.id+"_"+props.record.id} style={{width:field.reportWidth,maxWidth:field.reportWidth,backgroundColor:selectedBgColor}}><span className="fieldText">{props.getFormattedFieldValue(field,props.record)}</span></div>)
                    })
                }           
            </div>)
}
export default RecordItem;
