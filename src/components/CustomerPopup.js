import Dropdown from "./Dropdown";
import { addRecord } from "../firebase";
export default function UserPopup(props){
    const selectedItems ={};
    const setSelectedItem = (module,selectedItem,isInput)=>{
        if(isInput)
            selectedItems[module]=selectedItem.target.value;
        else
            selectedItems[module]=selectedItem;

    }
    const addCustomer = ()=>{
        selectedItems["module"]="Customers"
        console.log(selectedItems);
        addRecord(selectedItems);
    }
    return <div><div className="popupOverlay"></div><div className="eventPopupContainer">
        <div className="title"><h2>Add Customer</h2></div>
        <div className="item">
            <span className="label">Customer Name</span>
            <input name="name" type="name" onChange={(e)=>setSelectedItem("name",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">Customer Email</span>   
            <input name="email" type="name" onChange={(e)=>setSelectedItem("email",e,"input")}></input>
        </div> 
        <div className="item">
            <span className="label">Customer PhoneNumber</span>   
            <input name="email" type="name" onChange={(e)=>setSelectedItem("phone",e,"input")}></input>
        </div> 
        <div className="item buttons">
            <button className="addButton" onClick={addCustomer}>Add</button>
            <button className="cancelButton" onClick={()=>{props.closePopup("Customer")}}>Close</button>
        </div>    
    </div></div>
}