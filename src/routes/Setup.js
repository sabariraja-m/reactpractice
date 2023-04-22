
import { useEffect } from "react";
import { Link,Form, useNavigate, useActionData} from "react-router-dom";
export default function Setup(){
    console.log("Setup Compnonent");
    const error = useActionData();
    return <div className="signupContainer">
        <Form method="post" className="signupForm">
            <div className="signupTitle">Setup</div>
            <div className="signupLabel">Business Name</div>
            <input name="name" type={"text"}></input>
            <div className="signupLabel">Business Type</div>
            <input name="type" type={"text"}></input>
            <div className="signupLabel">Business Email</div>
            <input name="email" type={"text"}></input>
            <button type="submit" className="signupButton">Setup Now</button>
            {error&&<div className="error">{error}</div>}
        </Form>    
     </div>;
}