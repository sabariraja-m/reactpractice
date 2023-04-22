import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,onAuthStateChanged, signOut, sendEmailVerification} from "firebase/auth";
const AuthContext = createContext();
export function AuthProvider(props){
    const auth= useProvideAuth();
    
    return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
}

export function useAuth(){
    return useContext(AuthContext);
}

function useProvideAuth(){
    const [user,setUser] = useState({"state":"loading"});
    const auth = getAuth();

    useEffect(()=>{
        var unsubscribe = onAuthStateChanged(auth,async(user) => {
            console.log("onAuthStateChanged")
            if (user && user.emailVerified) {
                setUser(user)
            } 
            else if(user){
                sendEmailVerification(auth.currentUser);
                setUser({"state":"signOut"})
            }
            else {
                setUser({"state":"signOut"})
            }
        })
        return ()=>unsubscribe();
    },[auth])

    const signIn = async(request)=>{
        let formData = await request.formData();
        return signInWithEmailAndPassword(auth, formData.get("email"), formData.get("password"))
        .then((response) => {
            const user = response.user;
            if(!user.emailVerified){
                sendEmailVerification(auth.currentUser);
                return {"status":"error","error":"Verification email sent to your email id, Please verify it."};
            }
            else{
                setUser(user);
                return {"status":"success"}
            }
        })
        .catch((error) => {
            return {"status":"error","error":error.message};
        });
    };

    const signUp = async(request)=>{
        let formData = await request.formData();
        return createUserWithEmailAndPassword(auth, formData.get("email"), formData.get("password"))
        .then((response) => {
            return {"status":"success"}
        })
        .catch((error) => {
            return {"status":"error","error":error.message};
        });
    };
    
    const signOutAction = ()=>{
        signOut(auth).then(() => {
        }).catch((error) => {
            console.log(error);
        });
    }

    return {user,signIn,signUp,signOutAction};
}