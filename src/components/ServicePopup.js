import Dropdown from "./Dropdown";
import { addRecord } from "../firebase";
export default function ServicePopup(props){
    const services = ["One Service","Two Service","Three Service"];
    const users = ["One User","Two User","Three User"];
    const timeSlots = ["09:00 am", "10:00 am", "12:00 pm", "01:00 pm"];
    const customers = ["One Customer","Two Customer","Three Customer"];
    const selectedItems ={};
    const setSelectedItem = (module,selectedItem,isInput)=>{
        if(isInput)
            selectedItems[module]=selectedItem.target.value;
        else
            selectedItems[module]=selectedItem;

    }
    const addService = ()=>{
        selectedItems["module"]="Services"
        console.log(selectedItems);
        addRecord(selectedItems);
    }
    return<div><div className="popupOverlay"></div> <div className="eventPopupContainer">
        <div className="title"><h2>Add Service</h2></div>
        <div className="item">
            <span className="label">Service Name</span>
            <input name="name" type="name" onChange={(e)=>setSelectedItem("name",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">Service Duration</span>   
            <input name="name" type="name" onChange={(e)=>setSelectedItem("duration",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">Service Cost</span>   
            <input name="name" type="name" onChange={(e)=>setSelectedItem("cost",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">Assign Users</span>   
            <div className="itemDropdown"><Dropdown items={users} setSelection={setSelectedItem} moduleName={"User"} icon={"profileImage"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">Service Description</span>   
            <textarea name="name" type="name" onChange={(e)=>setSelectedItem("description",e,"input")}></textarea>

        </div> 
        <div className="item buttons">
            <button className="addButton" onClick={addService}>Add</button>
            <button className="cancelButton" onClick={()=>{props.closePopup("Service")}}>Close</button>
        </div>    
    </div></div>
}