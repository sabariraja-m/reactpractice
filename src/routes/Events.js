import { NavLink, Outlet } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import Datepicker from "../components/Datepicker";
export default function Events(){
    console.log("Events Compnonent");
        let users = [{"id":1,"isSelected":true,"name":"Sabari raja dkjs","designation":"Admin"},{"id":2,"isSelected":true,"name":"Raja","designation":"Manager"},{"id":3,"isSelected":true,"name":"Saen","designation":"Staff"}];
        let services = [{"id":1,"isSelected":true,"name":"Hair Cut","duration":"30"},{"id":2,"isSelected":true,"name":"Shaving","duration":"15"},{"id":3,"isSelected":true,"name":"Trimming","duration":"10"}];
        let selectedUsers = JSON.parse(JSON.stringify(users));
        let selectedServices = JSON.parse(JSON.stringify(services));
        const setSelectedUser =(selectedItems)=>{
            console.log(selectedItems);
            selectedUsers = selectedItems;
        }
        const setSelectedService =(selectedItems)=>{
            console.log(selectedItems)
            selectedServices = selectedItems;


        }
        return (<div>
            <nav className="eventsMenu">
                <div className="item">
                    <NavLink className="hdButton leftButton"  to="calendar">Calendar</NavLink>
                    <NavLink className="hdButton rightButton" to="list" >List view</NavLink>
                </div>
                <div className="item">
                    <button className="hdButton">Today</button>
                </div>
                <div className="item">
                        <NavLink className="hdButton leftButton"  to="calendar/day">Day</NavLink>
                        <NavLink className="hdButton middleButton"  to="calendar/week">Week</NavLink>
                        <NavLink className="hdButton rightButton"  to="calendar/month">Month</NavLink>
                </div>
                <div className="item" style={{marginLeft:"auto"}}>
                    <Datepicker></Datepicker>
                </div>
                <div className="item right">
                    <Dropdown title="All Users" items={users} selectedItems={selectedUsers} setSelection={setSelectedUser} modulePluralName={"Users"} moduleName={"user"} icon={"profileImage"} isMultiSelect={true} style={{minWidth:200}}></Dropdown>
                </div>
                <div className="item">
                    <Dropdown title="All Services" items={services} selectedItems={selectedServices} setSelection={setSelectedService} modulePluralName={"Services"} moduleName={"Service"} icon={"ServiceImage"} isMultiSelect={true} style={{minWidth:200}}></Dropdown>
                </div>
            </nav>       
            <div className="eventsBody"><Outlet/></div> 
            
        </div>);
}