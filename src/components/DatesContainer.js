export default function DatesContainer(props){
    const days=["SU","MO","TU","WE","TH","FR","SA"];
    const weeks = [1,2,3,4,5,6];
    let startDate = new Date(props.year,props.month,1);
    startDate.setDate(startDate.getDate()-startDate.getDay()-1);
    startDate.setHours(props.selectedDate.getHours());
    startDate.setMinutes(props.selectedDate.getMinutes());
    console.log(startDate)
    return (<table id={props.month}>
        <thead>
        <tr>{days.map(day=><th key={day+"/"+startDate.getMonth()}>{day}</th>)}</tr>
        </thead>
        <tbody>
        {weeks.map((week)=>{
            return (<tr key={week}>
            {
                days.map(()=>{
                    startDate.setDate(startDate.getDate()+1);
                    let date = new Date(startDate);
                    return <td className={(props.selectedDate &&(date.getTime() === props.selectedDate.getTime()))?"dpSeletedDate":""} key={startDate.getDate()+"/"+startDate.getMonth()} onClick={()=>props.setSelectedDate(date)}>{startDate.getDate()}</td>
                })
            }    
            </tr>)
        })}
        </tbody>
    </table>)

}