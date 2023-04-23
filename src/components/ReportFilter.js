import { useState } from "react";
import Datepicker from "./Datepicker";
import NewDropdown from "./NewDropdown";
import { useModuleDispatch, useModuleFilter } from "./ModuleDataContext";

export default function ReportFilter(props){
    const [criteriaMap,setCriteriaMap]=useState({});
    const [filterApplied,setFilterApplied]=useState(true);
    const {filter,setFilter}= useModuleFilter();
    const {handleModuleDispatch} = useModuleDispatch();
    const sortBy =filter.sortBy;
    const sortOrder=filter.sortOrder;
    const operators={
        "single_line":["is","isn't","starts with","is empty","is not empty"],
        "multi_line":["is","isn't","starts with","is empty","is not empty"],
        "phone":["is","isn't","starts with","is empty","is not empty"],
        "email":["is","isn't","starts with","is empty","is not empty"],
        "number":["=","<","<=",">",">=","between","is empty","is not empty"],
        "date":["=","<","<=",">",">=","between","is empty","is not empty"],
        "date_time":["=","<","<=",">",">=","between","is empty","is not empty"],
        "checkbox":["is"],
        "picklist":["is","isn't","is empty","is not empty"],
        "multi-select":["is","isn't","contains","is empty","is not empty"],
        "lookup":["is","isn't","is empty","is not empty"]
    }
    const dataType = {"single_line":"text","multi_line":"text","email":"text","phone":"text","mobile":"text","number":"number"};
    const doubleInputOperators = ["between","not between"];
    const singleInputOperators = ["is","isn't","contains","doesn't contain","starts with","ends Width","=","<","<=",">",">="];
    const dropDownFields = ["picklist","checkbox","lookup","multi-select"];
    const checkboxOptions=["Selected","Not Selected"];
    
    const setSelectedSortOrder = (field,_sortOrder)=>{
        let filterObject = {...filter,...{"sortOrder":_sortOrder,"currentPage":1,"pageQuery":"","pagination":""}};
        setFilter(filterObject);
        handleModuleDispatch({"type":"get","filter":filterObject,"filterKey":"sortOrder"})       
    }
    const setSelectedSortBy = (field,_sortBy)=>{
        let filterObject = {...filter,...{"sortBy":_sortBy,"currentPage":1,"pageQuery":"","pagination":""}}
        setFilter(filterObject);
        handleModuleDispatch({"type":"get","filter":filterObject,"filterKey":"sortBy"})             
    }
    const clearFilter = ()=>{
        setCriteriaMap({});
        setFilterApplied(true);
        if(filter.criteriaList.length){
            let criteriaList = []
            let filterObject = {...filter,criteriaList,...{"currentPage":1,"pageQuery":"","pagination":""}};
            setFilter(filterObject);
            handleModuleDispatch({"type":"get","filter":filterObject})     
        }        
    }
    const applyFilter=()=>{
        setFilterApplied(true);
        let criteriaList=getCriteriaList();
        let filterObject = {...filter,criteriaList,...{"sortBy":"","currentPage":1,"pageQuery":"","pagination":""}};
        setFilter(filterObject);
        handleModuleDispatch({"type":"get","filter":filterObject})     
    }
    const getCriteriaList = ()=>{
        let criteriaList=[];
        Object.keys(criteriaMap).forEach(function(fieldId){
            let field = props.fields.find(fi=>fi.id === fieldId)
            let criteria = [];
            criteria[0]=field.apiName;
            criteria[1]=criteriaMap[fieldId].operator;
            criteria[2]=criteriaMap[fieldId].values[0]?criteriaMap[fieldId].values[0]:"";
            if(doubleInputOperators.indexOf(criteria[1]) !== -1)
                criteria[2]=criteriaMap[fieldId].values;
            if(field.type == "checkbox")
                criteria[2] = (criteria[2] == "Selected")?true:false;
            if((field.type == "picklist" || field.type == "lookup") && (criteria[1] == "is" || criteria[1] == "isn't")){
                criteria[1] = (criteria[1] == "is")?"in":"not-in";
            }
            if(field.type == "lookup" && criteria[2] && criteria[2].length){
                criteria[2] = criteria[2].map(cri => {return {"id":cri.id,"name":cri.name}});
            }
            if(criteria[1] == "is empty" || criteria[1] == "is not empty")
                criteria[2]='';
            criteriaList.push(criteria);
        })
        return criteriaList;
    }
    const showHideFilterOprions = (fieldId)=>{
        setFilterApplied(false);
        setCriteriaMap((oldcriteriaMap)=>{
            let tmp = JSON.parse(JSON.stringify(oldcriteriaMap));
            if(tmp[fieldId]){
                delete tmp[fieldId];
            }
            else{
                let field = props.fields.find(fi=>fi.id === fieldId);
                if(field){
                   tmp = {};
                   tmp[fieldId]={"operator" : operators[field.type][0],"values":[]}
                }    
            }
            return tmp;
        })
    }
    const setSelectedOperator =(fieldId,operator)=>{
        setFilterApplied(false);
        setCriteriaMap((oldcriteriaMap)=>{
            let tmp = JSON.parse(JSON.stringify(oldcriteriaMap));
            let field = props.fields.find(fi=>fi.id === fieldId);
            if(field){
                tmp[fieldId].operator=operator;
            }    
            return tmp;
        })
    }
    const handleDropdownChange = (_fieldId,value)=>{
        setFilterApplied(false);
        setCriteriaMap((oldcriteriaMap)=>{
            let fieldId = _fieldId.substring(0,_fieldId.indexOf("_input_"));
            let inputIndex = _fieldId.substring(_fieldId.indexOf("_input_")+7);
            let tmp = JSON.parse(JSON.stringify(oldcriteriaMap));
            let field = props.fields.find(fi=>fi.id === fieldId);
            if(field){
                tmp[fieldId].values[inputIndex]=value;
            }    
            return tmp;
        })
    }
    const handleInputChange = (e)=>{
        setFilterApplied(false);
        setCriteriaMap((oldcriteriaMap)=>{
            let fieldId = e.target.id.substring(0,e.target.id.indexOf("_input_"));
            let inputIndex = e.target.id.substring(e.target.id.indexOf("_input_")+7);
            let tmp = JSON.parse(JSON.stringify(oldcriteriaMap));
            let field = props.fields.find(fi=>fi.id === fieldId);
            if(field){
                tmp[fieldId].values[inputIndex]= (e.target.type === "number")?parseInt(e.target.value):e.target.value;
            }    
            return tmp;
        })
    }
    const handleDateChange = (_fieldId,value)=>{
        setFilterApplied(false);
        setCriteriaMap((oldcriteriaMap)=>{
            let fieldId =_fieldId.substring(0,_fieldId.indexOf("_input_"));
            let inputIndex = _fieldId.substring(_fieldId.indexOf("_input_")+7);
            let tmp = JSON.parse(JSON.stringify(oldcriteriaMap));
            let field = props.fields.find(fi=>fi.id === fieldId);
            if(field){
                tmp[fieldId].values[inputIndex]= new Date(value).getTime();
            }    
            return tmp;
        })
    }
    return  <div className="reportFilter">
                {props.isLoading ? <div className="loaderOuter"><div className="reportLoader"></div></div>:
                <>
                <div className="filterTitle">Sort By</div>
                <div className={"sortbyField"+(Object.keys(criteriaMap).length !== 0 ? " disabled":"")}>
                    <NewDropdown items={["Asc","Desc"]} setSelection={setSelectedSortOrder} selectedItem={sortOrder} style={{height:"25px",maxWidth:55}}></NewDropdown>
                    <NewDropdown items={props.fields} setSelection={setSelectedSortBy} showField={"displayName"} returnField={"apiName"} selectedItem={sortBy} style={{minWidth:200,height:"25px"}}></NewDropdown>
                </div>
                <div className="filterbyField">
                    <div className="filterTitle">Filter By</div>
                    <div className="filterFieldsList">
                    {
                        props.fields.map(field =>{
                            return (!field.hidden && 
                                <div className="filterFieldItem" key={field.id} >
                                    <div>
                                        <input id={field.id+"_checkbox"} className="filterFieldCheckbox" type={"checkbox"} onClick={()=>showHideFilterOprions(field.id)} checked={criteriaMap[field.id]?true:false}></input>
                                        <label htmlFor={field.id+"_checkbox"}><span className="filterFieldCheckbox">{field.displayName}</span></label>
                                    </div>
                                    { criteriaMap[field.id] &&
                                        <div className="filters">
                                            <div className="filterOperators">
                                                <NewDropdown items={operators[field.type]} setSelection={setSelectedOperator} selectedItem={criteriaMap[field.id].operator} fieldName={field.id} ></NewDropdown>
                                            </div>
                                            <div className="filterValues">

                                                {(doubleInputOperators.indexOf(criteriaMap[field.id].operator) !== -1) &&
                                                    <div className="doubleInput">
                                                        {(field.type === "date" || field.type === "date_time")?<Datepicker showTimePicker={field.type === "date_time"} style={{height:"25px",textAlign:"center",width:"111px"}} fieldName={field.id+"_input_0"} setSelection={handleDateChange}></Datepicker>:<input className={"filterInput"} type={dataType[field.type]} value={criteriaMap[field.id].values[0]} id={field.id+"_input_0"} onChange={handleInputChange}></input>}
                                                        <span className="doubleInputSeparator"> - </span>
                                                        {(field.type === "date" || field.type === "date_time")?<Datepicker showTimePicker={field.type === "date_time"} style={{height:"25px",textAlign:"center",width:"111px"}} fieldName={field.id+"_input_1"} setSelection={handleDateChange}></Datepicker>:<input className={"filterInput"} type={dataType[field.type]} value={criteriaMap[field.id].values[1]} id={field.id+"_input_1"} onChange={handleInputChange}></input>}
                                                    </div>    
                                                }

                                                {(singleInputOperators.indexOf(criteriaMap[field.id].operator) !== -1 && dropDownFields.indexOf(field.type) === -1) && 
                                                ((field.type === "date" || field.type === "date_time")?<Datepicker showTimePicker={field.type === "date_time"} style={{height:"25px",textAlign:"center",width:"192px"}} fieldName={field.id+"_input_0"} setSelection={handleDateChange}></Datepicker>:<input  className={"filterInput"} type={dataType[field.type]} value={criteriaMap[field.id].values[0]} id={field.id+"_input_0"} onChange={handleInputChange}></input>)
                                                }

                                                { (["is empty","is not empty"].indexOf(criteriaMap[field.id].operator) === -1) &&
                                                ((dropDownFields.indexOf(field.type) !== -1) && <NewDropdown style={{"width":"206px"}} isMultiSelect={(field.type !== "checkbox")} items={(field.type === "checkbox")?checkboxOptions:field.options} isFetchItems={field.type === "lookup"} lookupModule={field.lookupModule} setSelection={handleDropdownChange} moduleName={field.id} fieldName={field.id+"_input_0"} selectedItems={criteriaMap[field.id].values[0]} selectedItem={criteriaMap[field.id].values[0]} showField="name"></NewDropdown>)}

                                            </div>    
                                        </div>
                                    } 
                                </div> )
                        })
                    }
                    </div>
                </div>
                <div className="filterFooter">
                    <div className={"applyButton"+(!filterApplied?"":" disabled")} onClick={applyFilter}>Apply Filter</div>
                    <div className={"clearButton"+(Object.keys(criteriaMap).length?"":" disabled")} onClick={clearFilter}>Clear</div>

                </div></>}  
            </div>
        
}    