import React, { useRef ,useEffect, useState} from 'react';
import env from "../../../../env"
import errortrans from "../../../../translate/error"
import tabletrans from "../../../../translate/tables"
import formtrans from "../../../../translate/forms"
import DocDetails from './DocDetails';
import DocParameter from './DocParameter';

function DocDetailHolder(props){
  const url = window.location.pathname.split('/')[3]
  const direction = props.lang?props.lang.dir:errortrans.defaultDir;
  const lang = props.lang?props.lang.lang:errortrans.defaultLang;
  const [error,setError] = useState({errorText:'',errorColor:"brown"})
  const [content,setContent] = useState('')
  const [catChange,setCatChange] = useState('')
  const [parameters,setParameters] = useState([])
  

  useEffect(()=>{
    if(url==="new")return
    var postOptions={
      method:'post',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({docId:url})
    }
   
fetch(env.siteApi + "/setting/fetch-doc",postOptions)
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
        setError({errorText:"مستند پیدا شد",
          errorColor:"green"})
          setContent(result)
          setParameters(result.parameters)
        setTimeout(()=>setError({errorText:'',errorColor:"brown"}),2000)
      }
      
  },
  (error) => {
    console.log(error);
  }
)
  },[])
  const saveLearn=()=>{
    //if(newCustomer) {
      var postOptions={
          method:'post',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({docId:url,
            ...catChange,parameters:parameters})
        }
       console.log(postOptions)
    fetch(env.siteApi + "/setting/update-doc",postOptions)
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
            setTimeout(()=>window.location.href="/documents/list",2000)
          }
          
      },
      (error) => {
        console.log(error);
      }
    )
  }
return(
  <div className="new-item" style={{direction:direction}}>
      <div className="create-product">
      <h4>{tabletrans.addDoc[lang]}</h4>
      {content||url==="new"?<div className="pages-wrapper">
        <div className="item-box">
          <DocDetails direction={direction} lang={lang} content={content}
            setCatChange={setCatChange} catChange={catChange}/>
          <DocParameter direction={direction} lang={lang}
            parameters={parameters} setParameters={setParameters}/> 
          </div>
        <div className="create-btn-wrapper">
          <div className="save-btn" onClick={saveLearn}>{formtrans.saveChanges[lang]}</div>
          <div className="cancel-btn" onClick={()=>window.location.href="/documents/list"}>{formtrans.cancel[lang]}</div>
        </div>
        
      </div>:<div>{env.loader}</div>}
    </div>
  </div>
  )
}
export default DocDetailHolder