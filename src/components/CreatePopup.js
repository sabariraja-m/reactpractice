export default function CreatePopup(props){
    return <div className="createPopupContainer">
        <div className="createItem" onClick={()=>{props.openPopup("Event")}}>
            Add Event
        </div>
        <div className="createItem" onClick={()=>{props.openPopup("Time")}}>
            Add Special/Time Off
        </div>
        <div className="createItem" onClick={()=>{props.openPopup("Service")}}>
            Add Service
        </div>
        <div className="createItem" onClick={()=>{props.openPopup("User")}}>
            Add User
        </div>
        <div className="createItem" onClick={()=>{props.openPopup("Customer")}}>
            Add Customer
        </div>
        
    </div>
}