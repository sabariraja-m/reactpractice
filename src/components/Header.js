import { useState } from "react";
import { NavLink} from "react-router-dom";
import ProfileSlider from "./ProfileSlider";
import { useModules } from "./ModulesContext";
export default function Header(props){
    const {modules}= useModules();
    const [showProfileSlider,setShowProfileSlider] = useState(false);
    return (<div className="headerContainer">
                <nav className="mainMenu">
                    <NavLink className="item brand" to="/">
                        <svg className="brandLogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="26" height="5" x="8" y="51" fill="#dbdbdb"/><path fill="#ebebeb" d="M6,8H48a2,2,0,0,1,2,2V52a0,0,0,0,1,0,0H4a0,0,0,0,1,0,0V10A2,2,0,0,1,6,8Z"/><path fill="#e06661" d="M6,8H48a2,2,0,0,1,2,2v6H4V10A2,2,0,0,1,6,8Z"/><circle cx="12" cy="24" r="2" fill="#cbcbcb"/><circle cx="22" cy="24" r="2" fill="#cbcbcb"/><circle cx="32" cy="24" r="2" fill="#cbcbcb"/><circle cx="12" cy="32" r="2" fill="#cbcbcb"/><circle cx="22" cy="32" r="2" fill="#f9adb1"/><circle cx="12" cy="40" r="2" fill="#cbcbcb"/><circle cx="22" cy="40" r="2" fill="#cbcbcb"/><circle cx="44" cy="43" r="16" fill="#5d9aa4"/><circle cx="44" cy="43" r="12" fill="#f9f9f9"/><path fill="#fbb540" d="M44,45a.873.873,0,0,1-.144-.011,1,1,0,0,1-.688-.434l-2-3a1,1,0,0,1,1.664-1.11l1.383,2.075,5.145-4.289a1,1,0,0,1,1.28,1.538l-6,5A1,1,0,0,1,44,45Z"/><path fill="#dbdbdb" d="M44 51a1 1 0 0 0-1 1v2.95c.331.027.662.05 1 .05s.669-.023 1-.05V52A1 1 0 0 0 44 51zM44 31c-.338 0-.669.023-1 .05V34a1 1 0 0 0 2 0V31.05C44.669 31.023 44.338 31 44 31z"/><path fill="#c3c3c3" d="M12 5h0a2 2 0 0 1 2 2v4a0 0 0 0 1 0 0H10a0 0 0 0 1 0 0V7A2 2 0 0 1 12 5zM22 5h0a2 2 0 0 1 2 2v4a0 0 0 0 1 0 0H20a0 0 0 0 1 0 0V7a2 2 0 0 1 2-2zM32 5h0a2 2 0 0 1 2 2v4a0 0 0 0 1 0 0H30a0 0 0 0 1 0 0V7A2 2 0 0 1 32 5zM42 5h0a2 2 0 0 1 2 2v4a0 0 0 0 1 0 0H40a0 0 0 0 1 0 0V7A2 2 0 0 1 42 5z"/><path fill="#dbdbdb" d="M35 45a1 1 0 0 0 0-2H32a11.986 11.986 0 0 0 .18 2zM52 44a1 1 0 0 0 1 1h2.82A11.986 11.986 0 0 0 56 43H53A1 1 0 0 0 52 44z"/></svg>
                        <span className="brandName">Schedule My Slot</span>
                    </NavLink>
                    {(modules && modules.length > 0) &&
                        modules.map(function(module){
                            return  <NavLink className="item hoverlinks" key={module.apiName} to={`module/${module.apiName}`}>
                                        {module.apiName}
                                    </NavLink>
                        })
                    }
                    <NavLink className="item right" to={"module/new"}>
                        <button className="hdButton hoverlinks">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20" fill="none"><path fill="#000000" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"/></svg>
                            <span className="buttonText">Create New Module</span>
                        </button>
                    </NavLink>

                    <div className="item" onClick={()=>setShowProfileSlider(preprops=>!preprops)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#000" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm3-12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 7a7.489 7.489 0 0 1 6-3 7.489 7.489 0 0 1 6 3 7.489 7.489 0 0 1-6 3 7.489 7.489 0 0 1-6-3Z" /></svg>
                    </div>
                    {showProfileSlider && <ProfileSlider authUser={props.authUser}/>}
                </nav>
            </div>);
    
}