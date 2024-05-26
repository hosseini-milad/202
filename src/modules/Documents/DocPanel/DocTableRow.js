import React ,{ useState } from "react"
import Status from "../../Components/Status"
import  env, { normalPriceCount, rxFindCount } from "../../../env"
import DocQuickDetail from "./DocComponent/DocQuickDetail"

function DocTableRow(props){
  const [openOption,setOpenOption] = useState(0)
  const [checkState,setCheckState] = useState(false)
  const activeAcc = props.index===props.detail
  console.log(props.data)
  const data=props.data
    return(<React.Fragment>
        <tr 
            className={activeAcc?"activeAccordion":"accordion"}>
            <td className="checkBoxStyle">
              <input type="checkbox" name="" id="" checked={checkState}
              onChange={(e)=>setCheckState(checkState?false:true)}/></td>
            <td>
                <div className="order-id">
                  <p onClick={()=> window.location.href=
                    "/documents/detail/"+data._id}>
                    {data.kind?data.kind.title:""}</p>
                </div>
            </td>
            <td>
              <div className="cu-avatar">
                  <img src={env.siteApiUrl+data.imageUrl} alt="avatar"/>
                  <div className="cu-name" onClick={()=>
                  window.location.href="/documents/detail/"+data._id}>
                    <p className="name">{data.title}</p>
                    <p className="email">{data.url}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="or-date">
                  <p className="date">{data.content}</p>
                </div>
              </td>
              
              <td>
                <Status status={data.status} class={"order-status"} 
                  lang={props.lang}/>
              </td>
            <td>
              <div className="more-btn">
              <i className={`tableIcon fas ${activeAcc?"fa-chevron-up":"fa-chevron-down"}`} 
                onClick={()=>props.showDetail(activeAcc?"-1":props.index)} ></i>
                <i className="tableIcon fas fa-edit" onClick={()=>
                  window.location.href="/documents/detail/"+data._id}></i>
                <i className="tableIcon fas fa-ellipsis-v" 
                  onClick={()=>setOpenOption(openOption?0:1)}></i>
              </div>
              {openOption?<div className="sub-more-menu">
                <div className="sub-option sub-delete">
                <i className="tableIcon fas fa-remove" style={{color: "#ff0000"}}></i>
                  <p>Delete</p>
                </div>
                <div className="sub-option sub-edit">
                  <i className="tableIcon fas fa-edit"></i>
                  <p>Edit</p>
                </div>
              </div>:<></>}
            </td>
          </tr>
          {activeAcc?<tr className="sub-order">
        <td colSpan="9"><DocQuickDetail data={data}/></td></tr>
          :<React.Fragment></React.Fragment>}
          </React.Fragment>
    )
}
export default DocTableRow