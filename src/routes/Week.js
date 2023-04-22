export default function Week(props){
    const intervalDuration = 30;
    const startTime = 0*60
    const endTime = 24*60;
    const days=["SU","MO","TU","WE","TH","FR","SA"];
    // const weeks = [1,2,3,4,5,6];
    var timeIntervals = [];
    let i=0;
    while(startTime + i*intervalDuration <= endTime){
        timeIntervals.push(startTime + i*intervalDuration);
        i++;
    }
    const getTimefromMinutes = (time)=>{
        let hour = parseInt(time/60);
        let mins = time%60;
        if(hour > 12 ){
            return (hour%12) +":"+mins+ " pm";
        }
        return hour+":"+mins+" am";
    }

    return <div className="weekViewContainer">
            <table className="weekTable">
                <tr> <th className="timeRow">{"Time"}</th>{days.map(day=><th className="weekCol" key={day}>{day}</th>)}</tr>
                {
                    timeIntervals.map((time) =>{
                        return <tr className="timeRow">
                            <td className="timeSlot">{getTimefromMinutes(time)}</td>
                            {days.map(day=><th className="weekCol" key={day+"-"+time}></th>)}
                        </tr>;
                    })
                }
            </table>
         </div>;
}