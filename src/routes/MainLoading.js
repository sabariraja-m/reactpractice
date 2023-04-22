import {Navigate} from "react-router-dom";

export default function MainLoading(props){
    console.log("MainLoading Component");
    return  <Navigate to={(props.authUser.orgId? `/${props.authUser.orgId}`: "/setup")} replace={true}/>;
}