import { useEffect, useState,useRef } from "react"
import { fetchListItems } from "../firebase";
import { useParams } from "react-router-dom";

export default function NewDropdown({showView:ShowView,...props}){
    const params = useParams();
    const ref = useRef(null);
    const [filteredItems,setFilteredItems]=useState(null);
    const [searchValue,setSearchValue]=useState("");
    const [isFetchedAll,setIsFetchedAll]=useState(false);
    const [selectedItems,setSelectedItems]=useState(()=>{
        if(props.isMultiSelect && props.selectedItem && props.selectedItem.length > 0){
            return props.selectedItem;
        }
        return [];
    });
    const [showMenu,setShowMenu]=useState(false);
    const [bottomStyle,setBottomStyle]=useState("");
    const [lastVisible,setLastVisible]=useState();
    const uniqueKey = props.uniqueKey ?? "id";
    const showField = props.showField ?? (props.lookupModule?"name":"");
    // params = ["fieldName","items","selectedItem","selectedItems","showField","showView","returnField","isMultiSelect","setSelection","searchFields","itemName","lookupModule","isFetchItems","fetchCriteria","menustyle","style"]
    const showHideMenu = (e)=>{
        if (!e || (ref.current && !ref.current.contains(e.target))) {
            setShowMenu(preprops =>{
                console.log(ref.current.children[1].getBoundingClientRect());
                let ddBottom = ref.current.children[1].getBoundingClientRect().bottom;
                if(!preprops && (window.innerHeight - ddBottom) < 90){
                    setBottomStyle("33px");
                }
                else{
                    setBottomStyle("");
                }
                return !preprops
            });
        }
    }
    useEffect(()=>{
        console.log("newdropdown render");
        const getFileredItems = async()=>{
            let tmp;
            if(props.lookupModule){
                tmp = await fetchListItems(params.orgId,props.lookupModule,props.fetchCriteria)
            }
            else{
                tmp = {};
            }  
            setFilteredItems(tmp.records);  
            setLastVisible(tmp.lastVisible);
        }
        getFileredItems();   
    },[params.orgId,props.lookupModule,props.fetchCriteria]); 
    useEffect(()=>{
        console.log(showMenu)
        setTimeout(() => {
            if(showMenu)
                window.addEventListener('click', showHideMenu);
            else
                window.removeEventListener('click', showHideMenu);
        }, 0);
        return ()=>{
            window.removeEventListener('click', showHideMenu);
        }
    },[showMenu]);    
    const selectItem = (item)=>{
        if(props.isMultiSelect){
            setSelectedItems((_selectedItems)=>{
                let tmp =JSON.parse(JSON.stringify(_selectedItems));
                let itemIndex;
                if(typeof item == "object" && item[uniqueKey]){
                    itemIndex = tmp.findIndex(it=>it[uniqueKey] === item[uniqueKey]);
                }
                else if(typeof item == "object"){
                    itemIndex = tmp.findIndex(it=>JSON.stringify(it) === JSON.stringify(item));
                }
                else{
                    itemIndex = tmp.indexOf(item);
                }
                if(itemIndex !== -1){
                    tmp.splice(itemIndex,1);
                }
                else{
                    // if(props.returnField)
                    //     tmp.push(item[props.returnField]);
                    // else
                        tmp.push(item);
                }   
                props.setSelection(props.fieldName,tmp);
                return tmp;                    
            });    
        }
        else{
            props.setSelection(props.fieldName,(props.returnField?item[props.returnField]:item));
            setShowMenu(false);
        }
    }
    const isSelected = (item)=>{
        if(typeof item == "object"){
            if(item[uniqueKey]){
                return (selectedItems.find(it=>it[uniqueKey] === item[uniqueKey]))? true:false;
            }
            else{
                return (selectedItems.find(it=>JSON.stringify(it) === JSON.stringify(item)))? true:false;
            }
        }
        else{
            return (selectedItems.indexOf(item) !== -1)? true:false;
        }
    }
    const filterItems = async (e)=>{
        var _searchValue = e.target.value.trim();
        setSearchValue(_searchValue);
        isFetchedAll && setIsFetchedAll(false);
        if(props.lookupModule){
            let tmp = await fetchListItems(params.orgId,props.lookupModule,props.fetchCriteria,_searchValue,props.searchFields);
            setFilteredItems(tmp.records);
            setLastVisible(tmp.lastVisible);
        }
        else if(_searchValue && props.items){
            let tmp = props.items.filter((item)=>{
                if(typeof item == "object"){
                    if(props.searchFields && props.searchFields.length){
                        return (props.searchFields.findIndex((searchField)=>{ 
                            return item[searchField] && (item[searchField].toLowerCase().indexOf(_searchValue.toLowerCase())!== -1)
                        }) !== -1);
                    }
                    else if(showField){
                        return item[showField] && (item[showField].toLowerCase().indexOf(_searchValue.toLowerCase())!== -1)
                    }  
                } 
                else{
                    return item && (item.toLowerCase().indexOf(_searchValue.toLowerCase())!== -1)
                }   
            })
            setFilteredItems(tmp);
        }
        else{
            setFilteredItems(null);
        }
    }
    const handleScroll = async(e)=>{
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) { 
            console.log("bottom");
            if(props.lookupModule && !isFetchedAll && filteredItems && filteredItems.length){
                let tmp = await fetchListItems(params.orgId,props.lookupModule,props.fetchCriteria,searchValue,props.searchFields,lastVisible);
                if(tmp){
                    if(tmp.records && tmp.records.length < 10){
                        setIsFetchedAll(true);
                    }   
                    setLastVisible(tmp.lastVisible);
                    setFilteredItems((preFetchList)=>{
                        let tmp2= preFetchList.concat(tmp.records);
                        return tmp2;
                    });
                }    
            }

        }
    }
    const getSelectedItemView = (item)=>{
        if(item){
            if(typeof item === "object"){
                return showField?item[showField]:item[uniqueKey];
            }
            else{
                if(showField && props.returnField && props.items && props.items.length && typeof props.items[0] === "object"){
                    let sField = props.items.find(it=>it[props.returnField] === item)
                    return sField?sField[showField]:item;
                }
                return item;
            }
        }
        else{
            return "-None-"
        }
    }
    return  (<div className="ddContainer" ref={ref} style={props.style}>
                <div className="ddSelectedContainer" onClick={()=>showHideMenu()}>
                    {props.children}

                    {!props.children && 
                        <div className="ddSelectedItems">
                            {props.isMultiSelect && 
                                <div className="ddMultiSelectedItems">
                                    { (selectedItems.length > 0) &&  
                                        <>
                                        {
                                            selectedItems.map((item)=>{
                                                return <span className="multiSelectItem">{getSelectedItemView(item)}</span>
                                            })
                                        }
                                        </>
                                    }
                                    {!selectedItems.length && <div>{"-None-"}</div>}
                                </div>
                            }
                            {!props.isMultiSelect && <div className="ddSelectedItem"> {getSelectedItemView(props.selectedItem)}</div>}
                        </div>
                    }
                    <div className="ddArrow">
                        <div className={"arrow "+(showMenu?'up':'down')}></div>
                    </div>    
                </div>
                <div className="ddMenu" style={{visibility:(showMenu?"visible":"hidden"),bottom:bottomStyle}}>
                    { (props.items && props.items.length > 1) &&
                        <div className="ddSearchbar">
                            <svg width="16px" height="16px"  id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><title>Trade_Icons</title><path d="M6.57,1A5.57,5.57,0,1,1,1,6.57,5.57,5.57,0,0,1,6.57,1m0-1a6.57,6.57,0,1,0,6.57,6.57A6.57,6.57,0,0,0,6.57,0Z"/><rect x="11.84" y="9.87" width="2" height="5.93" transform="translate(-5.32 12.84) rotate(-45)"/></svg>
                            <input type={"text"} placeholder={"Search"} onChange={filterItems}></input>
                        </div>
                    }    
                    {filteredItems && 
                        <div className="ddItemsContainer" onScroll={handleScroll}>
                            { (typeof filteredItems[0] !== "object") &&
                                <div>
                                {    
                                    filteredItems.map((item,index)=> {
                                        return <div className="ddItem" onClick={()=>selectItem(item)} key={item[uniqueKey]?item[uniqueKey]:index}>{ props.isMultiSelect && <input type="checkbox" checked={isSelected(item)} readOnly></input>}<div>{item}</div></div>
                                    }) 
                                }      
                                </div>
                            }
                            { (!ShowView && showField)&& 
                                <div>
                                {    
                                    filteredItems.map((item,index)=> {
                                        return <div className="ddItem" onClick={()=>selectItem(item)} key={item[uniqueKey]?item[uniqueKey]:index}>{ props.isMultiSelect && <input type="checkbox" checked={isSelected(item)} readOnly></input>}<div>{item[showField]}</div></div>
                                    }) 
                                }      
                                </div>
                            }
                            {ShowView &&
                                <div>
                                {
                                    filteredItems.map((item,index)=>{
                                        return (<div className="ddItem" onClick={()=>selectItem(item)} key={item[uniqueKey]?item[uniqueKey]:index}>{ props.isMultiSelect && <input type="checkbox" checked={isSelected(item)} readOnly></input>}<ShowView item={item}></ShowView></div>)
                                    })
                                }    
                                </div>    
                            }
                        </div>    
                    }
                    {(!filteredItems && props.items) &&
                        <div className="ddItemsContainer">
                            { (typeof props.items[0] !== "object") &&
                                <div>
                                {    
                                    props.items.map((item,index)=> {
                                        return <div className="ddItem" onClick={()=>selectItem(item)} key={item[uniqueKey]?item[uniqueKey]:index}>{ props.isMultiSelect && <input type="checkbox" checked={isSelected(item)} readOnly></input>}<div>{item}</div></div>
                                    }) 
                                }      
                                </div>
                            }
                            {(!ShowView && showField) && 
                                <div>
                                {    
                                    props.items.map((item,index)=> {
                                        return <div className="ddItem" onClick={()=>selectItem(item)} key={item[uniqueKey]?item[uniqueKey]:index}>{ props.isMultiSelect && <input type="checkbox" checked={isSelected(item)} readOnly></input>}<div>{item[showField]}</div></div>
                                    }) 
                                }      
                                </div>
                            }
                            {ShowView &&
                                <div>
                                {
                                    props.items.map((item,index)=>{
                                        return (<div className="ddItem" onClick={()=>selectItem(item)} key={item[uniqueKey]?item[uniqueKey]:index}>{ props.isMultiSelect && <input type="checkbox" checked={isSelected(item)} readOnly></input>}<ShowView item={item}></ShowView></div>)
                                    })
                                }    
                                </div>    
                            }
                        </div>   
                    }  
                </div>  
            </div>)
}    