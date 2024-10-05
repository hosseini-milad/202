import Cookies from 'universal-cookie';
import StatusBar from '../modules/Components/StatusBar';
import Paging from '../modules/Components/Paging';
import errortrans from "../translate/error";
import { useEffect } from 'react';
import { useState } from 'react';
import env from '../env';
import tabletrans from '../translate/tables';
import NewsTable from '../modules/News/NewsTable';
const cookies = new Cookies();

function News(props){
    const direction = props.lang?props.lang.dir:errortrans.defaultDir;
    const lang = props.lang?props.lang.lang:errortrans.defaultLang;
    const [content,setContent] = useState("")
    const [filters,setFilters] = useState("")
    const [loading,setLoading] = useState(0)
    const token=cookies.get(env.cookieName)
    useEffect(() => {
      setLoading(1)
      const body={
          offset:filters.offset?filters.offset:"0",
          pageSize:filters.pageSize?filters.pageSize:"10",
          customer:filters.customer,
          orderNo:filters.orderNo,
          status:filters.status,
          brand:filters.brand,
          dateFrom:filters.date&&filters.date.dateFrom,
          dateTo:filters.date&&filters.date.dateTo,
          access:"manager"
      }
      const postOptions={
          method:'post',
          headers: {'Content-Type': 'application/json',
          "x-access-token":token&&token.token,"userId":token&&token.userId},
          body:JSON.stringify(body)
        }
        console.log(postOptions)
    fetch(env.siteApi + "/setting/list-news",postOptions)
    .then(res => res.json())
    .then(
      (result) => {
        setLoading(0)
          setContent('')
          setTimeout(()=> setContent(result),200)
      },
      (error) => {
        setLoading(0)
        console.log(error);
      }
      
  )},[filters])
  //window.scrollTo(0, 270);},[pageNumber,filters,perPage,refreshTable])
   return(
      <div className="user" style={{direction:direction}}>
      <div className="od-header">
        <div className="od-header-info">
          
          <div className="od-header-name">
            <p>خبرها</p>
          </div>
          
        </div>
        <div className="od-header-btn">
          <div className="edit-btn add-btn" 
            onClick={()=>window.location.href="/news/detail/new"}>
            <i className="fa-solid fa-plus"></i>
            <p>{tabletrans.addNew[lang]}</p>
          </div>
          <div className="edit-btn">
            <i className="fa-solid fa-pen"></i>
            <p>{tabletrans.edit[lang]}</p>
          </div>
        </div>
      </div>
      <div className="list-container">
        <StatusBar lang={lang} token={token} filters={filters}
         status={content.rxStatus} setFilters={setFilters}/>
        <div className="user-list"> 
          {loading?env.loader:<NewsTable data={content} lang={lang}/>}
        </div>
        <Paging content={content} setFilters={setFilters} filters={filters} 
          lang={props.lang}/>
      </div>
    </div>
    )
}
export default News