import { createContext , useContext , useState } from "react";
const ModulesContext = createContext(null); 

export default function ModulesProvider(props){
    const [modules,setModules]=useState(props.modules);
    return (<ModulesContext.Provider value={{modules,setModules}}>
                        {props.children}
            </ModulesContext.Provider>)
}
export function useModules(){
    return useContext(ModulesContext);
}
