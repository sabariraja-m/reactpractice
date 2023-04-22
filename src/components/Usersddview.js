import { useEffect } from "react"
export default function Userview(props){
    useEffect(()=>{
        console.log("Userview render")
    })
    return  <div className="userddview" onClick={()=>props.selectItem(props.index)}>
                <div>{props.item.name}</div>
                <div>{props.item.designation}</div>
            </div>
}