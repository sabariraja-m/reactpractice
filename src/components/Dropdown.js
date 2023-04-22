import { useState, useEffect } from "react";
import DropdownCard from "./DropdownCard";

export default function Dropdown(props){
    const [isListOpen, setListOpen]= useState(()=>{return false;});
    const [title, setTitle]= useState(()=>{return (props.selectedItem?props.selectedItem:"Select "+props.moduleName)});
    const [selectedItems,setSelectedItems] = useState(()=>{
        let tmpItems = (props.selectedItem?[props.selectedItem]:(props.selectedItems?props.selectedItems:[]));
        return tmpItems;
    });
    let moduleName = (props.moduleName?props.moduleName:"Item");
    let modulePluralName = (props.modulePluralName?props.modulePluralName:"Items");
    const openCloseList = async()=>{
        // if(!isListOpen && !props.items && props.fetchOptions){
        //     props.items = props.fetchOptions();
        // }
        // else{
            setListOpen(preProps=>{
                    if(preProps){
                        props.setSelection(moduleName,props.isMultiSelect?selectedItems:selectedItems[0]);
                    }
                    return !preProps;
                }
            );
        // }    
        
    };
    const setDropdownTitle =(_selectedItems)=>{
        if(_selectedItems.length === 0){
            setTitle("Select "+moduleName);
        }
        else if(_selectedItems.length === 1){
            setTitle((typeof _selectedItems[0] === "object")?(props.showField?_selectedItems[0][props.showField]:_selectedItems[0].name):_selectedItems[0]);
        }
        else if(_selectedItems.length < props.items.length){
            setTitle(_selectedItems.length+" "+modulePluralName);
        }
        else if(_selectedItems.length === props.items.length){
            setTitle("All "+modulePluralName);
        }
    }
    useEffect(()=>{
        setSelectedItems(selectedItems=>{
            let tmpItems = (props.selectedItem?[props.selectedItem]:(props.selectedItems?props.selectedItems:[]));
            setDropdownTitle(tmpItems)
            return tmpItems;
        })
    },[props.selectedItem,props.selectedItems]); 

    useEffect(()=>{
        setTimeout(() => {
            if (isListOpen) {
                window.addEventListener('click', openCloseList);
            }
        }, 0);
        return ()=>{
            window.removeEventListener('click', openCloseList);
        }
    })
    const selectItem = (e,idorItem,isSelected,isNoObject)=>{
        console.log(idorItem);
        !props.isMultiSelect && e.stopPropagation();
        setSelectedItems(selectedItems=>{
            if(isNoObject){
                if(props.isMultiSelect) 
                    (selectedItems.indexOf(idorItem) === -1 && isSelected) && selectedItems.push(idorItem);
                else
                    selectedItems[0]=idorItem;
            }
            else if(props.isMultiSelect){    
                const itemIndex = selectedItems.findIndex((i) => i.id === idorItem);
                if(itemIndex !== -1 && !isSelected){
                    selectedItems.splice(itemIndex,1);
                }
                else if( itemIndex === -1 && isSelected){
                    const index = props.items.findIndex((i) => i.id === idorItem);
                    selectedItems.push(props.items[index]);
                    
                }  
            }  
            else{
                const index = props.items.findIndex((i) => i.id === idorItem);
                selectedItems[0]=props.items[index];
            }  
            setDropdownTitle(selectedItems);
            !props.isMultiSelect && openCloseList();
            return selectedItems;
        })    
    }

    return (
            <div className="ddContainer" onClick={openCloseList} style={props.style}>
                <div className="ddTitleContainer">
                   {title}
                </div>
                {   
                isListOpen && 
                <div className="ddMenu" style={props.menuPos?props.menuPos:{top:43}}>
                { 
                    props.items.map((item,index)=> {
                        
                        return ((typeof item === "object") ?(<DropdownCard key={item.id} isSelected={(selectedItems.find(i=>i.id === item.id))?true:false} setSelection={selectItem} item={item} icon={props.icon} isMultiSelect={props.isMultiSelect} showField={props.showField}></DropdownCard>)
                            : (<div className={(selectedItems.find(i=>i === item))?'ddItem selected':'ddItem'} key={index} onClick={(e)=>{selectItem(e,item,true,true)}}>{item}</div>)
                        )
                    })
                }    
                </div>
                }
            </div>);
}
