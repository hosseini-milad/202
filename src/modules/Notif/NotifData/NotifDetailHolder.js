import React, { useRef ,useEffect, useState} from 'react';
import env from "../../../env"
import Status from "../../Components/Status"
import errortrans from "../../../translate/error"
import tabletrans from "../../../translate/tables"
import formtrans from "../../../translate/forms"
import NotifDetails from './NotifDetails';
import NotifImage from './NotifImage';

function NotifDetailHolder(props){
  const url = window.location.pathname.split('/')[3]
  const direction = props.lang?props.lang.dir:errortrans.defaultDir;
  const lang = props.lang?props.lang.lang:errortrans.defaultLang;
  const [error,setError] = useState({errorText:'',errorColor:"brown"})
  const [content,setContent] = useState('')
  const [catChange,setCatChange] = useState('')
  

  useEffect(()=>{
    if(url==="new")return
    var postOptions={
      method:'post',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({notifCode:url})
    }
   
fetch(env.siteApi + "/setting/fetch-news",postOptions)
.then(res => res.json())
.then(
  (result) => {
    if(result.error){
      setError({errorText:result.error,
        errorColor:"brown"})
      setTimeout(()=>setError({errorText:'',
        errorColor:"brown"}),3000)
    }
      else{
        setError({errorText:"سرویس پیدا شد",
          errorColor:"green"})
          setContent(result)
        setTimeout(()=>setError({errorText:'',errorColor:"brown"}),2000)
      }
      
  },
  (error) => {
    console.log(error);
  }
)
  },[])
  const saveNotif=()=>{
    //if(newCustomer) {
      var postOptions={
          method:'post',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({notifCode:url,
            ...catChange})
        }
       //console.log(postOptions)
    fetch(env.siteApi + "/setting/update-news",postOptions)
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error){
          setError({errorText:result.error,
            errorColor:"brown"})
          setTimeout(()=>setError({errorText:'',
            errorColor:"brown"}),3000)
        }
          else{
            setError({errorText:result.success,
              errorColor:"green"})
            setTimeout(()=>window.location.href="/news",2000)
          }
          
      },
      (error) => {
        console.log(error);
      }
    )
  }
console.log(content)
return(
  <div className="new-item" style={{direction:direction}}>
      <div className="create-product">
      <h4>افزودن خبر</h4>
      {content||url==="new"?<div className="pages-wrapper">
        <div className="item-box">
          <NotifDetails direction={direction} lang={lang} content={content}
            setCatChange={setCatChange} catChange={catChange}/>
          <NotifImage setCatChange={setCatChange} catChange={catChange} 
            lang={lang} content={content}/> 
          </div>
        <div className="create-btn-wrapper">
          <div className="save-btn" onClick={saveNotif}>{formtrans.saveChanges[lang]}</div>
          <div className="cancel-btn" onClick={()=>window.location.href="/notification"}>{formtrans.cancel[lang]}</div>
        </div>
        
      </div>:<div>{env.loader}</div>}
    </div>
  </div>
  )
}
export default NotifDetailHolder