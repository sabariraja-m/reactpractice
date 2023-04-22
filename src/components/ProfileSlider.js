import { useActionData } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function ProfileSlider(props){
    const {user,signOutAction} = useAuth()
    return <div className="profileSliderContainer">
        <div className="profileDetails">
            <div>
                <img className="profileImage" src={user.photoURL?user.photoURL:"https://dreamvilla.life/wp-content/uploads/2017/07/dummy-profile-pic.png"}></img>
            </div>
            <div>{user.displayName}</div>
            <div>{user.email}</div>
        </div>
        <div className="signout" onClick={signOutAction}>
            Sign Out
        </div>
        
    </div>
}