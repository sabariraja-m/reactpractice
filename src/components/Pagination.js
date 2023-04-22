import { useModuleDispatch, useModuleFilter} from "./ModuleDataContext";
import NewDropdown from "./NewDropdown";
export default function Pagination(props){
    const {filter,setFilter} = useModuleFilter();
    const {handleModuleDispatch,status}= useModuleDispatch();
    const isLoading = status === "loading";
    const pagesList = [20,40,60,80,100];
    const setSelectedPageLimit = (field,pageLimit)=>{
        let filterObject={...filter,pageLimit, ...{"currentPage":1,"pageQuery":"","pagination":""}}
        setFilter(filterObject);  
        handleModuleDispatch({"type":"get","filter":filterObject})     
    }
    const loadPrevPage = ()=>{
        if(filter.currentPage > 1){
            let filterObject={...filter, ...{"currentPage":filter.currentPage-1,"pageQuery":filter.firstVisible,"pagination":"startAfter"}}
            setFilter(filterObject);    
            handleModuleDispatch({"type":"get","filter":filterObject,"filterKey":"prevPage"})     
        }    
    }
    const loadNextPage = ()=>{
        if(props.recordsLength === filter.pageLimit){
            let filterObject={...filter, ...{"currentPage":filter.currentPage+1,"pageQuery":filter.lastVisible,"pagination":"startAfter"}}
            setFilter(filterObject);
            handleModuleDispatch({"type":"get","filter":filterObject})  
        }
    }
    return  (<div className="reportFooter">
                <div className="pageLimit">
                    <span style={{marginRight:"5px"}}>Records per page</span>
                    <NewDropdown items={pagesList} setSelection={setSelectedPageLimit} selectedItem={filter.pageLimit}></NewDropdown>
                </div>
                <div className="pagination">
                    <span className={"dpPreIcon" + (((filter.currentPage === 1) || isLoading)? " disabled":"")} onClick={loadPrevPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 1024 1024" class="icon" version="1.1"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000"/></svg>
                    </span>
                    <span className="pageNumber">{filter.currentPage}</span>

                    <span className={"dpNextIcon"+ (((props.recordsLength < filter.pageLimit) || isLoading)? " disabled":"")} onClick={loadNextPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 1024 1024" class="icon" version="1.1"><path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#000000"/></svg>
                    </span>
                </div>    
            </div>)
}            