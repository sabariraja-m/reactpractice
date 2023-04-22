import Dropdown from "./Dropdown";
import { addRecord } from "../firebase";
export default function UserPopup(props){
    const services = ["One Service","Two Service","Three Service"];
    const users = ["One User","Two User","Three User"];
    const timeSlots = ["09:00 am", "10:00 am", "12:00 pm", "01:00 pm"];
    const customers = ["One Customer","Two Customer","Three Customer"];
    const designations = ["Admin","Manager","Staff"];
    const selectedItems ={};
    const setSelectedItem = (module,selectedItem,isInput)=>{
        if(isInput)
            selectedItems[module]=selectedItem.target.value;
        else
            selectedItems[module]=selectedItem;

    }
    const addUser = ()=>{
        selectedItems["module"]="Users"
        console.log(selectedItems);
        addRecord(selectedItems);
    }
    return <div><div className="popupOverlay"></div><div className="eventPopupContainer">
        <div className="title"><h2>Add User</h2></div>
        <div className="item">
            <span className="label">User Name</span>
            <input name="name" type="name" onChange={(e)=>setSelectedItem("name",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">User Email</span>   
            <input name="email" type="name" onChange={(e)=>setSelectedItem("email",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">Designation</span>   
            Assign Service
            <div className="itemDropdown"><Dropdown items={designations} setSelection={setSelectedItem} moduleName={"designation"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item">
            <span className="label">Assign Services</span>   
            <div className="itemDropdown"><Dropdown items={services} setSelection={setSelectedItem} moduleName={"Service"} icon={"profileImage"} style={{minWidth:200}}></Dropdown></div>
        </div> 
        <div className="item buttons">
            <button className="addButton" onClick={addUser}>Add</button>
            <button className="cancelButton" onClick={()=>{props.closePopup("User")}}>Close</button>
        </div>    
    </div></div>
}