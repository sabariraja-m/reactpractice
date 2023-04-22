import Datepicker from "./Datepicker"
import NewDropdown from "./NewDropdown"
export default function DateTimepicker(props){
    const hoursList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const minutesList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
    const setDateTime = (fieldName,value)=>{
        let dateTime = new Date();
        props.setSelection(props.fieldName,dateTime)
    }
    return (<div>
        <Datepicker {...props} fieldName={"date"} setSelection={setDateTime}></Datepicker>
        <NewDropdown items={hoursList} fieldName={"hour"} setSelection={setDateTime}></NewDropdown>
        <NewDropdown items={minutesList} fieldName={"minute"} setSelection={setDateTime}></NewDropdown>
      </div>)
}      