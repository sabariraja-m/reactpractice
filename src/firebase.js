import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, addDoc, deleteDoc,collection, limit, getFirestore, query, where,orderBy,startAfter, endBefore, endAt, startAt} from "firebase/firestore"; 
import { defer } from 'react-router-dom';
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
  await updateDocument(`orgs/${orgId}/modules/${moduleMap.apiName}`,moduleMap);
  return true;
}
export async function getReportData(params){
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