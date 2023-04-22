export default function Day(props){
    const intervalDuration = 30;
    const startTime = 0*60
    const endTime = 24*60;
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

    return <div className="dayViewContainer">
            <table className="dayTable">
                {
                    timeIntervals.map((time) =>{
                        return <tr className="timeRow"><td className="timeSlot">{getTimefromMinutes(time)}</td><td className="eventSlot"></td></tr>;
                    })
                }    
            </table>
         </div>;
         

}