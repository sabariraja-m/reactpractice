import Dropdown from "./Dropdown";
import Datepicker from "./Datepicker";
import { addRecord } from "../firebase";
export default function EventPopup(props){
    const services = ["One Service","Two Service","Three Service"];
    const users = ["One User","Two User","Three User"];
    const timeSlots = ["09:00 am", "10:00 am", "12:00 pm", "01:00 pm"];
    const customers = ["One Customer","Two Customer","Three Customer"];
    const selectedItems ={};
    const setSelectedItem = (module,selectedItem)=>{
        selectedItems[module]=selectedItem;
    }
    const addEvent = ()=>{
        selectedItems["module"]="Events";
        console.log(selectedItems);
        addRecord(selectedItems);
    }
    return <div><div className="popupOverlay"></div><div className="eventPopupContainer">
        <div className="title"><h2>Add Event</h2></div>
        <div className="item">
            <span className="label">Select Service</span>
            <div className="itemDropdown"><Dropdown selectedItem={(services.length === 1)?services[0]:""} items={services} setSelection={setSelectedItem} moduleName={"Service"} icon={"serviceImage"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">Select User</span>   
            <div className="itemDropdown"><Dropdown selectedItem={(users.length === 1)?users[0]:""} items={users} setSelection={setSelectedItem} moduleName={"User"} icon={"profileImage"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">Select Date</span>   
            <div className="itemDropdown"><Datepicker setSelection={setSelectedItem} fieldName="date"></Datepicker></div>
        </div> 
        <div className="item">
            <span className="label">Select Time</span>   
            <div className="itemDropdown"><Dropdown items={timeSlots} setSelection={setSelectedItem} moduleName={"Time"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">Select Customer</span>   
            <div className="itemDropdown"><Dropdown items={customers} setSelection={setSelectedItem} moduleName={"Customer"} icon={"profileImage"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item buttons">
            <button className="addButton" onClick={addEvent}>Add</button>
            <button className="cancelButton" onClick={()=>{props.closePopup("Event")}}>Close</button>
        </div>    
    </div></div>
}