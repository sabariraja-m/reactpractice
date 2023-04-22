import { useState, useRef, useEffect } from "react";
import DatesContainer from "./DatesContainer";
import NewDropdown from "./NewDropdown";
export default function Datepicker(props){
    const ref = useRef(null);
    const getViewFormattedDate =(date)=>{
        if(date){
            if(props.showTimePicker){
                return date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hourCycle: 'h23'
                });
            }
            else{
                return date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });
            }    
        }
        return ;    
    }
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const years= [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
    const [selectedDate,setSelectedDate]=useState(()=>{
        return props.selectedDate?new Date(props.selectedDate):new Date();
    });
    const [viewDate,setViewDate]=useState(()=>{
        if(props.selectedDate){
            return getViewFormattedDate(new Date(props.selectedDate));
        }
        return "";
    });
    const [month,setMonth]=useState(new Date().getMonth());
    const [year,setYear]=useState(new Date().getFullYear());
    const [showCal,setShowCal]=useState(false);
    const [bottomStyle,setBottomStyle]=useState("")
    const showHideCalendar = (e)=>{
        if (!e || (ref.current && !ref.current.contains(e.target))) {
            setShowCal(preprops =>{
                console.log(ref.current.children[1].getBoundingClientRect());
                let ddBottom = ref.current.children[1].getBoundingClientRect().bottom;
                if(!preprops && (window.innerHeight - ddBottom) < 90){
                    setBottomStyle("33px");
                }
                else{
                    setBottomStyle("");
                }
                if(!e){
                    return true;
                }
                return !preprops
            });
        }
    }
    
    const setDateFromView = (e)=>{
        let viewDate = new Date(e.target.value.trim());
        if(viewDate == "Invalid Date"){
            console.log(viewDate);
        }
        else{
            setViewDate(e.target.value.trim());
            if(viewDate.getDate()){
                setSelectedDate(viewDate);
                setMonth(viewDate.getMonth());
                setYear(viewDate.getFullYear());
            }
            else{
                setSelectedDate(null)
            }
        }    
    }
    useEffect(()=>{
        setTimeout(() => {
            if(showCal)
                window.addEventListener('click', showHideCalendar);
            else
                window.removeEventListener('click', showHideCalendar);
        }, 0);
        return ()=>{
            window.removeEventListener('click', showHideCalendar);
        }
    },[showCal]); 

    const setViewDateFromSelection = (selectedDate)=>{
        console.log(selectedDate);
        setViewDate(getViewFormattedDate(selectedDate));
        setSelectedDate(selectedDate);
        setMonth(selectedDate.getMonth());
        setYear(selectedDate.getFullYear());
        
        !props.showTimePicker && setShowCal(false);
        props.setSelection && props.setSelection(props.fieldName,selectedDate);
    }
    
    
    const increaseDate=()=>{
        if(selectedDate){
            setSelectedDate(date=>{
                let tempDate = new Date(date);
                tempDate.setDate(tempDate.getDate()+1);
                setMonth(tempDate.getMonth());
                setYear(tempDate.getFullYear());
                setViewDate(getViewFormattedDate(tempDate));
                return tempDate;
            })
        }    
    }
    const decreaseDate=()=>{
        if(selectedDate){
            setSelectedDate(date=>{
                let tempDate = new Date(date);
                tempDate.setDate(tempDate.getDate()-1);
                setMonth(tempDate.getMonth());
                setYear(tempDate.getFullYear());
                setViewDate(getViewFormattedDate(tempDate));
                return tempDate;
            })
        }    
    }
    const setSelectedMonth = (fieldName,selectedMonth)=>{
        setMonth(months.indexOf(selectedMonth));
    }
    const increaseMonth=()=>{
        setMonth(month => month+1);
    }
    const decreaseMonth=()=>{
        setMonth(month => month-1);
    }
    const setSelectedYear = (fieldName,selectedYear)=>{
        setYear(selectedYear);
    }

    const hoursList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const minutesList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
    const setTime = (fieldName,value)=>{
        if(fieldName === "hour"){
            setSelectedDate(prevDate=>{
                let tmp = new Date(prevDate.setHours(value))
                setViewDateFromSelection(tmp);
                return tmp;
            })
        }
        else{
            setSelectedDate(prevDate=>{
                let tmp = new Date(prevDate.setMinutes(value))
                setViewDateFromSelection(tmp);
                return tmp;
            })
        }  
    }
    return (
        <div className="dpContainer" ref={ref} style={props.style}>
            <div className="dpDateViewer" >
                { (props.showArrow) && <span className="dpPreIcon" onClick={decreaseDate}>
                    <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" width="12" height="12" viewBox="0 0 256 256" >
                        <defs>
                        </defs>
                        <g  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                            <polygon points="20.48,45 59.75,90 69.52,81.48 37.69,45 69.52,8.52 59.75,0 "  transform="  matrix(1 0 0 1 0 0) "/>
                        </g>
                    </svg>
                </span>
                }
                <span className="dpDate" onClick={()=>showHideCalendar()}><input style={props.style} placeholder={"MMM D, YYYY"+(props.showTimePicker?", HH:mm":"")} type={"text"}  value={viewDate} onChange={setDateFromView}></input></span>
                { (props.showArrow) && <span className="dpNextIcon" onClick={increaseDate}>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" viewBox="0 0 256 256" >
                        <defs>
                        </defs>
                        <g  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                            <polygon points="69.52,45 30.25,90 20.48,81.48 52.31,45 20.48,8.52 30.25,0 " transform="  matrix(1 0 0 1 0 0) "/>
                        </g>
                    </svg>
                </span>
                }
            </div>
            <div className="dpInnerContainer" style={{visibility:(showCal?"visible":"hidden"),bottom:bottomStyle,left:(props.leftPos?props.leftPos:0)}}>
                <div className="dateSection">
                    <div className="dpMonthYearViewer">
                        <span className="dpPreIcon" onClick={decreaseMonth}>
                            <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" width="12" height="12" viewBox="0 0 256 256" >
                                <defs>
                                </defs>
                                <g  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                    <polygon points="20.48,45 59.75,90 69.52,81.48 37.69,45 69.52,8.52 59.75,0 "  transform="  matrix(1 0 0 1 0 0) "/>
                                </g>
                            </svg>
                        </span>
                        <span className="dpMonthYear">
                            <NewDropdown selectedItem={months[month]} items={months} fieldName={"month"} setSelection={setSelectedMonth}></NewDropdown>
                            <NewDropdown selectedItem={year} items={years} fieldName={"year"} setSelection={setSelectedYear} yearDropDown={true} ></NewDropdown>
                        </span>
                        <span className="dpNextIcon" onClick={increaseMonth}>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" viewBox="0 0 256 256" >
                                <defs>
                                </defs>
                                <g  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                    <polygon points="69.52,45 30.25,90 20.48,81.48 52.31,45 20.48,8.52 30.25,0 " transform="  matrix(1 0 0 1 0 0) "/>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div className="dpDateContainer">
                        <DatesContainer month={month} year={year} selectedDate={selectedDate} setSelectedDate={setViewDateFromSelection}></DatesContainer>
                    </div>
                </div>
                {props.showTimePicker &&
                <div className="timeSection">
                    <div className="hoursList">
                        {hoursList.map(hour=><div className={"timeItem"+(selectedDate.getHours() === hour ? " selected":"")} onClick={()=>setTime("hour",hour)}>{hour}</div>)}
                    </div>
                    <div className="minutesList">
                        {minutesList.map(minute=><div className={"timeItem"+(selectedDate.getMinutes() === minute ? " selected":"")} onClick={()=>setTime("minute",minute)}>{minute}</div>)}
                    </div>
                </div>
                }
            </div>
        </div>
    )
}