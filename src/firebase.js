import { initializeApp } from 'firebase/app';
// import { getFirestore} from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,onAuthStateChanged, signOut, sendEmailVerification} from "firebase/auth";
// import * as firebaseui from 'firebaseui';
import { redirect} from "react-router-dom";
import { doc, setDoc, getDoc, getDocs, addDoc, deleteDoc,collection, limit, getFirestore, query, where,orderBy,startAfter, endBefore, endAt, startAt} from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID 
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

  
export function getSignedInUser(){
  return auth.currentUser;
}
export async function signUp({params,request}){
  let formData = await request.formData();
  console.log(formData);
  return createUserWithEmailAndPassword(auth, formData.get("email"), formData.get("password"))
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    console.log("signed Up")
    return redirect("/signin");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    if(auth.currentUser){
      return redirect("/");
    }
    return errorMessage;
  });
};
export function sendVerificationEmail() {
    sendEmailVerification(auth.currentUser)
    alert('Email Verification sent! Check your mail box');
}


export function signOutAction(){
  signOut(auth).then(() => {
  }).catch((error) => {
    // An error happened.
  });
}



function applyCriteriaLocally(records,criteria){
  var operators = ["is","isn't","contains","doesn't contain","starts with","ends Width","is empty","is not empty","=","<","<=",">",">=","between","not between"]
  if(criteria && criteria.length){
    criteria.forEach(function(cri){
      
    })
  }  
}
async function getDocument(docPath){
  const docSnap = await getDoc(doc(db, docPath ));
  return docSnap.exists()?docSnap.data():null;
}
async function getCollection(collectionPath,criteria,limit_by,order_by,pageQuery,pagination,getPageQuery){
  const constraints = getConstraints(criteria,limit_by,order_by,pageQuery,pagination);
  const q = query(collection(db,collectionPath), ...constraints);
  const querySnapshot = await getDocs(q);
  
  let records =[];
  querySnapshot.forEach((doc) => {
    records.push({"id":doc.id,...doc.data()});
  });
  // records = applyCriteriaLocally(records,criteria);
//   if(order_by && order_by.length){
//     records.sort(function(a,b){ 
//       let diff = a[order_by[0]]-b[order_by[0]]
//       return (order_by[1] == "asc") ? diff:-diff;
//     })
//  }
  if(getPageQuery){
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    const firstVisible = querySnapshot.docs[0];
    return {records,firstVisible,lastVisible};
  }
  return records;  
}

function getConstraints(criteria,limit_by,order_by,pageQuery,pagination){
  let constraints = [];
  if(criteria && criteria.length){
    criteria.forEach(function(cri){
      if(cri[1] === "starts with"){
        constraints.push(where(cri[0],">=",cri[2]));
        constraints.push(where(cri[0],"<=",cri[2]+"\uf8ff"));
      }
      else if(cri[1] === "between"){
        constraints.push(where(cri[0],">=",cri[2][0]));
        constraints.push(where(cri[0],"<=",cri[2][1]));

      }
      else if(cri[1] === "not between"){
        constraints.push(where(cri[0],">",cri[2][1]));
        constraints.push(where(cri[0],"<",cri[2][0]));
      }
      else{
        constraints.push(where(cri[0],getFirebaseOperator(cri[1]),cri[2]));
      }

    })
  }  
  if(order_by && order_by[0] && order_by[1]){
    constraints.push(orderBy(order_by[0],order_by[1]));
  }
  if(limit_by){
    constraints.push(limit(limit_by));
  }
  if(pageQuery && pagination){
    if(pagination === "startAfter"){
      constraints.push(startAfter(pageQuery));
    }
    else if(pagination === "startAt"){
      constraints.push(startAt(pageQuery));
    }
    else if(pagination === "endBefore"){
      constraints.push(endBefore(pageQuery));
    }
    else if(pagination === "endAt"){
      constraints.push(endAt(pageQuery));
    }
  }
  return constraints;
}
function getFirebaseOperator(operator){
   // const fsOperators = ["<","<=","==",">",">=","!=","array-contains","array-contains-any","in","not-in"];
//    const operators={
//     "single_line":["is","isn't","starts with","ends Width","is empty","is not empty"],
//     "multi_line":["is","isn't","starts with","ends Width","is empty","is not empty"],
//     "phone":["is","isn't","starts with","ends Width","is empty","is not empty"],
//     "email":["is","isn't","starts with","ends Width","is empty","is not empty"],
//     "number":["=","<","<=",">",">=","between","not between","is empty","is not empty"],
//     "date":["=","<","<=",">",">=","between","not between","is empty","is not empty"],
//     "date_time":["=","<","<=",">",">=","between","not between","is empty","is not empty"],
//     "checkbox":["is"],
//     "picklist":["is","is not","is empty","is not empty"],
//     "multi-select":["is","isn't","contains","doesn't contain","starts with","ends Width","is empty","is not empty"],
//     // "date":["in the last","due in","On","before","after","between","Today","Yesterday","This Week","This Mont","Last Week","Last Month","This Year","Current FY","Current FQ","Last Year","Previous FY","Previous FQ","Next Year","Next FY","Next FQ","is empty","is not empty"],
//     "lookup":["is","is not","is empty","is not empty"]
// }
  let operatorsMap ={"is":"==","isn't":"!=","starts with":">=","is empty":"==","is not empty":"!=","=":"==","contains":"array-contains-any"};
  if(operatorsMap[operator]){
    return operatorsMap[operator]
  }
  return operator;
}
async function updateDocument(documentPath,docMap,isMerging){
  return await setDoc(doc(db, documentPath),docMap,{merge:isMerging});
}
async function addDocument(collectionPath,docMap){
  return await addDoc(collection(db, collectionPath),docMap);
}

export async function getOrgId(userEmail){
    const data = await getDocument("users/"+userEmail);
    if(data && data.isSetupDone){
      return data.orgId;
    } 
    else {
      return null;
    }
}
export async function setup(request){
  let formData = await request.formData();
  const docRef = await addDocument("orgs", {
    name: formData.get("name"),
    type: formData.get("type"),
    email: formData.get("email")
  });
  await updateDocument("users/"+auth.currentUser.email,{"isSetupDone":true,"orgId":docRef.id},true);
  return docRef.id;
}  

export async function getOrgDetails(params){
  if(params.orgId){
    return await getCollection("orgs/"+params.orgId+"/modules",null,100,["order","asc"]);
  }
  return null;
}
export async function getRecordDetails({request,params}){
  return await getDocument(`orgs/${params.orgId}/modules/${params.moduleName}/records/${params.id}`);
}
export async function getModuleFields({params}){
  return await getCollection(`orgs/${params.orgId}/modules/${params.moduleName}/fields`,[],20,["order","asc"]);
}
export async function addRecord(orgId,recordMap){
  const docRef = await addDoc(collection(db, `orgs/${orgId}/modules/${recordMap.module}/records`),recordMap);
  return docRef.id;
}
export async function addFields(fieldsList,orgId){
  fieldsList.forEach(async(fieldMap)=>{
      await addDoc(collection(db, `orgs/${orgId}/modules/${fieldMap.module}/fields`),fieldMap);
  })
  return true;
}
export async function updateFields(fieldsList,orgId){
  fieldsList.forEach(async(fieldMap)=>{
    fieldMap.mt=new Date().getTime();
    updateDocument(`orgs/${orgId}/modules/${fieldMap.module}/fields/${fieldMap.id}`,fieldMap,true);
  })
  return true;
}
export async function deleteFields(fieldsList,orgId){
  fieldsList.forEach(async(fieldMap)=>{
    await deleteDoc(doc(db, `orgs/${orgId}/modules/${fieldMap.module}/fields/${fieldMap.id}`));
  })
  return true;
}
export async function addModule(moduleMap,orgId){
  const docRef = await updateDocument(`orgs/${orgId}/modules/${moduleMap.apiName}`,moduleMap);
  return true;
}
export async function getReportData({request,params}){
  let records = await getCollection(`orgs/${params.orgId}/modules/${params.moduleName}/records`,[],20,["ct","asc"],"","",true);
  let fields = await getCollection(`orgs/${params.orgId}/modules/${params.moduleName}/fields`,[],20,["order","asc"]);
  return {records,fields};
}
export async function getRecords(orgId,module,criteria,order,limit,pageQuery,pagination){
  return await getCollection(`orgs/${orgId}/modules/${module}/records`,criteria,limit,order,pageQuery,pagination,true);
}
export async function getSettings({request,params}){
  var module = request.url.split("/")[3];
  module = module.substring(0,1).toUpperCase()+module.substring(1);
  let settings = await getCollection("orgs/"+params.orgId+"/settings",[["module", "==", module]],20,["ct","asc"]);
  return settings;
}
export async function updateRecord(orgId,id,dataMap){
  return await updateDocument(`orgs/${orgId}/modules/${dataMap.module}/records/${id}`,dataMap,true);
}
export async function fetchListItems(orgId,module,criteria,searchValue,searchFields,lastVisible){
  if(!criteria){
    criteria = [];
  }
  if(searchValue && searchFields && searchFields.length){
    searchFields.forEach(function(field){
      criteria.push([field,">=",searchValue])
      criteria.push([field,"<=",searchValue+ '~'])
    })
  }
  return await getCollection(`orgs/${orgId}/modules/${module}/records`,criteria,10,["ct","asc"],lastVisible,"startAfter",true);
}

export async function deleteRecord(orgId,module,id){
  return await deleteDoc(doc(db, `orgs/${orgId}/modules/${module}/records/${id}`));
}

// export async function addRecords(){
//   var startdate = new Date();
//   for(var i=1;i<=333;i++){
//     let date = new Date(startdate);
//     let datetime = new Date(startdate);

//     let ctdate = new Date(startdate);

//     let recordMap = {
//       "module":"Tests",
//       "single_line":"SingleLine Test "+i,
//       "multi_line":"MultiLine Test "+i,
//       "email":"Email_"+i+"@Test_"+i+".com",
//       "number":i,
//       "date":new Date(date.setDate(date.getDate()+i)).getTime(),
//       "phone":"+91987654321"+i,
//       "picklist":"Option"+((i%5)?i%5:5),
//       "date_time":new Date(datetime.setHours(datetime.getHours()+i)).getTime(),
//       "multi-select":["Option"+i,"Option"+(i+1)],
//       "lookup":{"name":((i%2 == 0)?"First task":"Second Task"),"id":((i%2 == 0)?"swOYspyP8bCLL7xCn1nt":"vaoxnwIrzIRL058lbiCw")},
//       "checkbox":(i%2 == 0)?true:false,
//       "ct":new Date(ctdate.setMinutes(ctdate.getMinutes()+i)).getTime(),
//       "mt":new Date(ctdate.setMinutes(ctdate.getMinutes()+i)).getTime(),
//     }  
//     addRecord("h7WLEcxdBQQ0H5yfQxYL",recordMap)
//   }
// }

// export async function moveRecords(){
//   var orgId = "h7WLEcxdBQQ0H5yfQxYL";
//   var records = await getCollection("orgs/"+orgId+"/fields");
//   records.forEach(function(record){
//     addDoc(collection(db, "orgs/"+orgId+"/modules/"+record.module+"/fields/"),record);
//   })
// }

// export async function addSubview(){
//   var modules = ["Events","Services","Users","Customers"];
//   for(let i=0;i<modules.length;i++){
//     let fields = await getCollection("orgs/"+orgId+"/fields",["module", "==", modules[i]],10,["order","asc"]);
//     let fieldsArray = [];
//     fields.map(function(field){
//       fieldsArray.push({"id":field.id,"api_name":field.apiName,"width":200});
//     })
//     let viewMap = {
//       "module_name":modules[i],
//       "default":true,
//       "fields":fieldsArray,
//       "view_type":"List",
//       "display_name":"All "+modules[i]+" List",
//       "api_name":"All_"+modules[i]+"_List"
//     }
//     let docref = await addDocument("orgs/"+orgId+"/subviews",viewMap)
//     await updateDocument("orgs/"+orgId+"/modules/"+modules[i],{"subview_id":docref.id})
//   }
 
// }

// export function addModules(){
//   var modules = ["Events","Services","Users","Customers"];
//   var order =1;
//   modules.forEach(function(module){
//     let viewMap = {
//       "api_name":module,
//       "display_name":module,
//       "order":order++
//     }
//     updateDocument("orgs/"+orgId+"/modules/"+module,viewMap,true)
//   });
// }



// export function createModules(){
//   var modules = ["Events","Services","Users","Customers"];
//   var order =1;
//   modules.forEach(function(module){
//     let customView = {
//       access_type: "public",
//       criteria: null,
//       default: true,
//       display_value: "All "+module,
//       isAllFields: true,
//       fields: [],
//       id: "5590724000000087529",
//       last_accessed_time: "2022-12-21T10:03:56+05:30",
//       module: {api_name: module, id: "5590724000000002179"},
//       moduleId:"5590724000000002179",
//       moduleName:module,
//       name: "All "+module,
//       shared_to: null,
//       sort_by: null,
//       sort_order: null,
//       system_defined: true,
//       system_name: "ALLVIEWS",
//       wrap_text: true,
//       created_time: new Date().getTime()
//     }
//     addDoc(collection(db, "orgs/"+orgId+"/custom_views"),customView);
//   })
// }
// export function fieldsCorrection(){
//   let fields = ["vlmP6eHj7vythk07c3iO" , "LPs8ZWoCfYwIFJJlQizI" , "a3vBQ4aUzVYoAyEyjBIs" , "PvzHlxsVWcLsqzHqHqM7" , "Foo8e5A9wvDj7dNI05EM"];
//   fields.forEach(function(field){
//     getDoc(doc(db, "orgs/h7WLEcxdBQQ0H5yfQxYL/fields/"+field)).then(function(docu){
//       setDoc(doc(db, "orgs/h7WLEcxdBQQ0H5yfQxYL/fields/"+field),docu.data().fieldMap);
//     });
//   })
// }
// const services =[
//   {
//       "displayName":"Service Name",
//       "apiName":"name",
//       "type":"text",
//       "order":1,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Duration",
//       "apiName":"duration",
//       "type":"number",
//       "order":2,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "maxLength":50,
//       "maxValue":1440,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Cost",
//       "apiName":"cost",
//       "type":"number",
//       "order":3,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   ,
//   {
//       "displayName":"Break Time",
//       "apiName":"break_time",
//       "type":"number",
//       "order":4,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Description",
//       "apiName":"description",
//       "type":"text",
//       "order":5,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Service Color",
//       "apiName":"color",
//       "type":"text",
//       "order":6,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Assigned Users",
//       "apiName":"assigned_users",
//       "type":"lookup",
//       "isMultiSelect":true,
//       "order":7,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "isEditAllowed":true,
//       "lookupModule":"Users",
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Questions",
//       "apiName":"questions",
//       "type":"lookup",
//       "isMultiSelect":true,
//       "order":7,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Services",
//       "isEditAllowed":true,
//       "lookupModule":"fields",
//       "isCustomField":false,
//       "isFormField":false
//   },
//   {
//       "displayName":"User Name",
//       "apiName":"name",
//       "type":"text",
//       "order":1,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Users",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"User Email",
//       "apiName":"email",
//       "type":"email",
//       "order":2,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Users",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"User Mobile",
//       "apiName":"mobile",
//       "type":"mobile",
//       "order":3,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Users",
//       "maxLength":20,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Designation",
//       "apiName":"designation",
//       "type":"text",
//       "order":4,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Users",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Assigned Services",
//       "apiName":"assigned_services",
//       "type":"lookup",
//       "isMultiSelect":true,
//       "order":5,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Users",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "lookupModule":"Services",
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Customer Name",
//       "apiName":"name",
//       "type":"text",
//       "order":1,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Customers",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Customer Email",
//       "apiName":"email",
//       "type":"email",
//       "order":2,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Customers",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true  
//   },
//   {
//       "displayName":"Customer Mobile",
//       "apiName":"mobile",
//       "type":"mobile",
//       "order":3,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Customers",
//       "maxLength":20,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true   
//   },
//   {
//       "displayName":"Customer Name",
//       "apiName":"name",
//       "type":"text",
//       "order":1,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Customers",
//       "maxLength":50,
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true   
//   },
//   {
//       "displayName":"From DateTime",
//       "apiName":"from_date_time",
//       "type":"date_time",
//       "order":1,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Events",
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"To DateTime",
//       "apiName":"to_date_time",
//       "type":"to_time",
//       "order":2,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Events",
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Service",
//       "apiName":"service",
//       "type":"lookup",
//       "order":3,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Events",
//       "isEditAllowed":false,
//       "lookupModule":"Services",
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"User",
//       "apiName":"user",
//       "type":"lookup",
//       "order":4,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Events",
//       "isEditAllowed":false,
//       "lookupModule":"Users",
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Customer",
//       "apiName":"customer",
//       "type":"lookup",
//       "order":4,
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Events",
//       "isEditAllowed":false,
//       "lookupModule":"Customers",
//       "isCustomField":false,
//       "isFormField":true
//   },
//   {
//       "displayName":"Notes",
//       "apiName":"notes",
//       "type":"text",
//       "reportWidth":200,
//       "hidden": false,
//       "module":"Questions",
//       "isEditAllowed":true,
//       "isCustomField":false,
//       "isFormField":true
//   }
// ]
// const services = [
//   {
//     "displayName":"Cost",
//     "apiName":"cost",
//     "type":"number",
//     "reportWidth":200,
//     "hidden": false,
//     "module":"Events",
//     "isEditAllowed":true,
//     "isCustomField":false,
//     "isFormField":false
//   },
//   {
//     "displayName":"Service Name",
//     "apiName":"service_name",
//     "type":"text",
//     "reportWidth":200,
//     "hidden": false,
//     "module":"Events",
//     "isEditAllowed":false,
//     "isCustomField":false,
//     "isFormField":false
//   },
//   {
//     "displayName":"User Name",
//     "apiName":"user_name",
//     "type":"text",
//     "reportWidth":200,
//     "hidden": false,
//     "module":"Events",
//     "isEditAllowed":false,
//     "isCustomField":false,
//     "isFormField":false
//   },
//   {
//     "displayName":"Customer Name",
//     "apiName":"customer_name",
//     "type":"text",
//     "reportWidth":200,
//     "hidden": false,
//     "module":"Events",
//     "isEditAllowed":false,
//     "isCustomField":false,
//     "isFormField":false
//   },
//   {
//     "displayName":"Reschedule",
//     "apiName":"reschedule",
//     "type":"button",
//     "reportWidth":200,
//     "hidden": false,
//     "module":"Events",
//     "isEditAllowed":false,
//     "isCustomField":false,
//     "isFormField":false
//   },
//   {
//     "displayName":"Cancel",
//     "apiName":"canel",
//     "type":"button",
//     "reportWidth":200,
//     "hidden": false,
//     "module":"Events",
//     "isEditAllowed":false,
//     "isCustomField":false,
//     "isFormField":false
//   }
// ]
// export function addFields(){
//   services.forEach(function(record){
//     record.ct = new Date().getTime();
//     record.mt = new Date().getTime();
//    addDoc(collection(db, "orgs/"+orgId+"/fields"),record);
//   })
// }
// export function addEvents(){
//   let i =1;
//   let currentTime = new Date().getTime();
//   let services = ["X9DlFfMNgBq07xJ6ean2","fEnDsXagpzur0N0zMJvR","sv72iW8FWrlnKZ2RlImG"];
//   let users = ["M6YCpxjGPF4PhjJvccMF","ObgNJ2HkFlVX6hg3e2Kx","oAXDfZDYrJWSdElhsCZH"];
//   let customers = ["b4M7gekIrsqbz7td0LPa","b4M7gekIrsqbz7td0LPa","b4M7gekIrsqbz7td0LPa"];
//   for(i=1;i<101;i++){
//     let event ={};
//     event.from_date_time = currentTime+(i*(180*60000));
//     event.to_date_time = currentTime+(i*(180*60000))+(30*60000);
//     event.service = services[(i-1)%3];
//     event.user =users[(i-1)%3];
//     event.customer =customers[(i-1)%3];
//     event.service_name = "Service_"+i;
//     event.user_name = "User_"+i;
//     event.customer_name = "Customer_"+i;
//     event.cost = 100;
//     event.Questions = [{"Nn3vL5kqUE1nkTgd2jov":"note_"+i}];
//     event.module="Events";
//     event.ct = new Date().getTime();
//     event.mt = new Date().getTime();
//     addDoc(collection(db, "orgs/"+orgId+"/records"),event);
//   }  
// }

export async function changeFieldValues(){
  const q = query(collection(db,"orgs/h7WLEcxdBQQ0H5yfQxYL/records"),where("module","==","Events"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docu) => {

    let docData = docu.data();
    let docMap = {
      "customer_name": {"id":docData.customer,"name":docData.customer_name},
      "user_name": {"id":docData.user,"name":docData.user_name},
      "service_name": {"id":docData.service,"name":docData.service_name},
    }
    setDoc(doc(db,"orgs/h7WLEcxdBQQ0H5yfQxYL/records/"+docu.id),docMap,{merge:true});
  });
}