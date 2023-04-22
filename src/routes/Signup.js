
import { Link,Form, useActionData, Navigate} from "react-router-dom";
import Loading from "../components/Loading";
export default function Signup(props){
    console.log("Signup Compnonent");
    const data = useActionData();
    return <div className="signupContainer">
        <Form method="post" className="signupForm">
            <div className="signupTitle">Sign Up</div>
            <div className="signupLabel">Name</div>
            <input name="name" type={"text"}></input>
            <div className="signupLabel">Email</div>
            <input name="email" type={"email"}></input>
            <div className="signupLabel">Password</div>
            <input name="password" type={"password"}></input>
            <button type="submit" className="signupButton">SignUp Now</button>
            {data && data.error&&<div className="error">{data.error}</div>}
            <Link className="signupLink" to="/signin">Sign In</Link>
        </Form>    
     </div>
}