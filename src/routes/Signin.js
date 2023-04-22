import { Link,Form, useActionData} from "react-router-dom";
export default function Signin(){
    console.log("Signin Compnonent");
    const data = useActionData();
    return <div className="signupContainer">
    <Form method="post" className="signupForm">
        <div className="signupTitle">Sign In</div>
        <div className="signupLabel">Email</div>
        <input name="email" type={"email"}></input>
        <div className="signupLabel">Password</div>
        <input name="password" type={"password"}></input>
        <button type="submit" className="signupButton">SignIn Now</button>
        {data && data.error &&<div className="error">{data.error}</div>}
        <Link className="signupLink" to="/signup">Sign Up</Link>
    </Form>
 </div>
}