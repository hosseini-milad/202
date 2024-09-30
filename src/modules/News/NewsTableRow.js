import React ,{ useState,useEffect,useRef } from "react"
import Status from "../Components/Status"
import  env, { normalPriceCount, rxFindCount } from "../../env"
import NewsQuickDetail from "./NewsComponent/NewsQuickDetail"
import ErrorAction from "../Components/PopUps/ErrorAction"

function NewsTableRow(props){
  const [openOption,setOpenOption] = useState(0)
  const [checkState,setCheckState] = useState(false)
  const [Alert,setAlert]=useState(false)

  const activeAcc = props.index===props.detail
  console.log(props.data)
  const data=props.data
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e)=>{
      if(!menuRef.current.contains(e.target)){
        setOpenOption(false);
        console.log(menuRef.current);
      }      
    };

    document.addEventListener("mousedown", handler);
    

    return() =>{
      document.removeEventListener("mousedown", handler);
    }

  });
  const deleteNews=()=>{
    //if(newCustomer) {
      var postOptions={
          method:'post',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({newsCode:data.enTitle})
        }
       //console.log(postOptions)
    fetch(env.siteApi + "/setting/delete-news",postOptions)
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error){
          console.log(result.error)
        }
          else{

            setTimeout(()=>window.location.href="/news",2000)
          }
          
      },
      (error) => {
        console.log(error);
      }
    )
  }




    return(<React.Fragment>
        <tr 
            className={activeAcc?"activeAccordion":"accordion"}>
            <td className="checkBoxStyle">
              <input type="checkbox" name="" id="" checked={checkState}
              onChange={(e)=>setCheckState(checkState?false:true)}/></td>
            <td>
                <div className="order-id">
                  <p onClick={()=> window.location.href=
                    "/news/detail/"+data.enTitle}>
                    {data._id}</p>
                </div>
            </td>
            <td>
              <div className="cu-avatar">
                  <img src={env.siteApiUrl+data.imageUrl} alt="avatar"/>
                  <div className="cu-name" onClick={()=>
                  window.location.href="/news/detail/"+data.enTitle}>
                    <p className="name">{data.title}</p>
                    <p className="email">{data.enTitle}</p>
                  </div>
                  {data.abstract?
                    <i className="fa fa-comment-o" title={data.abstract}></i>:<></>}
                </div>
              </td>
              <td>
                <div className="or-date">
                  <p className="date">{new Date(data.date)
                  .toLocaleDateString(props.lang==="persian"?'fa':'en')}</p>
                  <p className="time">{new Date(data.date)
                  .toLocaleTimeString(props.lang==="persian"?'fa':'en')}</p>
                </div>
              </td>
              <td>
                <div className="order-num">
                  <p>{data.brand}</p>
                </div>
              </td>
              <td>
                <div className="order-num">
                  <p>{"product"}</p>
                </div>
              </td>
              <td>
                <div className="order-price">
                  <p>{normalPriceCount(data.totalPrice)}</p>
                </div>
              </td>
              <td>
                <Status status={data.status} class={"order-status"} 
                  lang={props.lang}/>
              </td>
            <td className="p-r">
              <div className="more-btn">
              <i className={`tableIcon fas ${activeAcc?"fa-chevron-up":"fa-chevron-down"}`} 
                onClick={()=>props.showDetail(activeAcc?"-1":props.index)} ></i>
                {/* <i className="tableIcon fas fa-edit" onClick={()=>
                  window.location.href="/news/detail/"+data.enTitle}></i> */}
                <i className="tableIcon fas fa-ellipsis-v" 
                  onClick={()=>setOpenOption(openOption?0:1)}></i>
              </div>
              <div className={openOption==true?"sub-more-menu sub-active":"sub-more-menu"} ref={menuRef}>
                <div className="sub-option sub-delete" onClick={()=>setAlert(true)}>
                <i className="tableIcon fas fa-remove" style={{color: "#ff0000"}}></i>
                  <p>Delete</p>
                </div>
                <div className="sub-option sub-edit" onClick={()=>
                  window.location.href="/news/detail/"+data.enTitle}>
                  <i className="tableIcon fas fa-edit"></i>
                  <p>Edit</p>
                </div>
              </div>
            </td>
          </tr>
          {Alert?
          <ErrorAction 
          status={"DELETE"} 
          title={"حذف آیتم"} 
          text={"آیتم انتخاب شده حذف خواهد شد. آیا مطمئن هستید؟"} 
          linkText={""} 
          style={{direction:"rtl"}}
          buttonText="حذف" 
          close={()=>setAlert()}
          action={deleteNews}
          />:
          <></>}
          {activeAcc?<tr className="sub-order">
        <td colSpan="9"><NewsQuickDetail data={data}/></td></tr>
          :<React.Fragment></React.Fragment>}

          </React.Fragment>
    )
}
export default NewsTableRow