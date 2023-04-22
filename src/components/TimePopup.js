import Dropdown from "./Dropdown";
import { addRecord } from "../firebase";
import Datepicker from "./Datepicker";
export default function UserPopup(props){
    const users = ["One User","Two User","Three User"];
    const timeList =  ["09:00 am", "10:00 am", "12:00 pm", "01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];
    const timeTypes =["Time Off", "Special Time"];

    const selectedItems ={};
    const setSelectedItem = (module,selectedItem,isInput)=>{
        if(isInput)
            selectedItems[module]=selectedItem.target.value;
        else
            selectedItems[module]=selectedItem;

    }
    const addUser = ()=>{
        selectedItems["module"]="Time"
        console.log(selectedItems);
        addRecord(selectedItems);
    }
    return <div><div className="popupOverlay"></div><div className="eventPopupContainer">
        <div className="title"><h2>Add Time Off / Special Time</h2></div>
        <div className="item">
            <span className="label">Select Type</span>
            <div className="itemDropdown"><Dropdown items={timeTypes} setSelection={setSelectedItem} moduleName={"timeType"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">From Date</span>   
            <div className="itemDropdown"><Datepicker setSelection={setSelectedItem} fieldName="fromDate"></Datepicker></div>
        </div> 
        <div className="item">
            <span className="label">From Time</span>   
            <div className="itemDropdown"><Dropdown items={timeList} setSelection={setSelectedItem} moduleName={"fromTime"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">To Date</span>   
            <div className="itemDropdown"><Datepicker setSelection={setSelectedItem} fieldName="toDate"></Datepicker></div>
        </div> 
        <div className="item">
            <span className="label">To Time</span>   
            <div className="itemDropdown"><Dropdown items={timeList} setSelection={setSelectedItem} moduleName={"toTime"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item buttons">
            <button className="addButton" onClick={addUser}>Add</button>
            <button className="cancelButton" onClick={()=>{props.closePopup("Time")}}>Close</button>
        </div>    
    </div></div>
}