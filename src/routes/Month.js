export default function Month(props){
    const days=["SU","MO","TU","WE","TH","FR","SA"];
    const weeks = [1,2,3,4,5,6];
    // let startDate = new Date(props.year,props.month,1);
    let startDate = new Date();
    startDate.setDate(startDate.getDate()-startDate.getDay()-1);
    console.log(startDate)
    return (<div className="monthViewContainer">
        <div className="monthTable">
            <div className="monthRow header">{days.map(day=><div key={day+"/"+startDate.getMonth()} className="monthCol">{day}</div>)}</div>
            {weeks.map((week)=>{
                return (<div className="monthRow" key={week}>
                {
                    days.map(()=>{
                        startDate.setDate(startDate.getDate()+1);
                        return <div key={startDate.getDate()+"/"+startDate.getMonth()} className="monthCol">{startDate.getDate()}</div>
                    })
                }    
                </div>)
            })}
        </div>
    </div>)

}