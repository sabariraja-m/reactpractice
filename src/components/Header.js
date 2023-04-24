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
                        <svg className="brandLogo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs/><g id="Layer_2" data-name="Layer 2"><g id="layer_1-2" data-name="layer 1"><path className="cls-1" d="M47 48H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h46a1 1 0 0 1 1 1v46a1 1 0 0 1-1 1zM2 46h44V2H2z"/><path className="cls-1" d="M11 21H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2zm-4-6v4h4v-4zM11 32H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2zm-4-6v4h4v-4zM11 43H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2zm-4-6v4h4v-4zM4 4h2v2H4zM8 4h2v2H8zM12 4h2v2h-2zM1 8h46v2H1zM16 16h27v2H16zM16 27h27v2H16zM16 38h27v2H16z"/></g></g></svg>
                        <span className="brandName">Forms & Reports</span>
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