import React, { useRef ,useEffect, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import StyleInput from "../../../../components/Button/Input"
import formtrans from "../../../../translate/forms"
import StyleSelect from '../../../../components/Button/AutoComplete';

function DocDetails(props){
    const editorRef = useRef(null);
    const content=props.content 
    const type = ["GET","POST","PUT","DELETE"]
    const docCat = [{title:"کاربران",enTitle:"users"},
    {title:"سفارشات",enTitle:"orders"},
    {title:"احراز هویت",enTitle:"auth"},
    {title:"محصولات",enTitle:"products"}]
    const [error,setError] = useState({errorText:'',errorColor:"brown"})
    //console.log(content)
    return(
        <div className="serviceItem">
          <StyleInput title={formtrans.title[props.lang]} direction={props.direction} 
              defaultValue={content?content.title:''} class={"formInput"}
              action={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                title:e
              }))}/>
          <StyleInput title={formtrans.url[props.lang]} direction={props.direction} 
              defaultValue={content?content.url:''} class={"formInput"}
              action={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                url:e
              }))}/>
              <StyleInput title={formtrans.content[props.lang]} direction={props.direction} 
              defaultValue={content?content.content:''} class={"formInput"}
              action={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                content:e
              }))}/>
              
              <StyleSelect title={formtrans.kind[props.lang]} direction={props.direction} 
              options={type}
              defaultValue={content?content.kind:''}
              action={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                kind:e
              }))}/>
              <StyleSelect title={formtrans.category[props.lang]} direction={props.direction} 
              options={docCat} label="title"
              defaultValue={content?content.category:''}
              action={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                category:e
              }))}/>
              <textarea placeholder={formtrans.request[props.lang]} 
              defaultValue={content?content.request:''}
              className='textDetail'
              onChange={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                request:e.target.value
              }))}/>
              <textarea placeholder={formtrans.response[props.lang]} 
              defaultValue={content?content.response:''}
              className='textDetail'
              onChange={(e)=>props.setCatChange(prevState => ({
                ...prevState,
                response:e.target.value
              }))}/>
              
        </div>
    )
}
export default DocDetails