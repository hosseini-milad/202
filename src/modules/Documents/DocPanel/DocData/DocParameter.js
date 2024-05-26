import React, { useRef ,useEffect, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import StyleInput from "../../../../components/Button/Input"
import formtrans from "../../../../translate/forms"
import StyleSelect from '../../../../components/Button/AutoComplete';

function DocParameter(props){
    const [parameter,ParameterChange] = useState()
    const [reload,setReload] = useState(1)
    const [error,setError] = useState({errorText:'',errorColor:"brown"})
    const addItem=()=>{
      setReload(0)
      var index = props.parameters.length
      props.setParameters(existingItems => {
        return [
          ...existingItems.slice(0, index),
          parameter,
          ...existingItems.slice(index + 1),
        ]
      })
      setTimeout(()=>setReload(1),200)
    }
    const removeItem=(index)=>{
      props.setParameters
      (l => l.filter((_,itemIndex) => itemIndex !== index));
    }
    const typeOptions=["string","number","object","array","date","boolean"]
    return(<div className='paramDisplay'>
        {reload?<div className="serviceItem">
          <StyleInput title={formtrans.title[props.lang]} direction={props.direction} 
              action={(e)=>ParameterChange(prevState => ({
                ...prevState,
                title:e
              }))}/>
              <StyleInput title={formtrans.description[props.lang]} direction={props.direction} 
              action={(e)=>ParameterChange(prevState => ({
                ...prevState,
                description:e
              }))}/>
              
              <StyleSelect title={formtrans.type[props.lang]} direction={props.direction} 
              options={typeOptions}
              action={(e)=>ParameterChange(prevState => ({
                ...prevState,
                type:e
              }))}/>
              <div className='btnParam'>
                <div className="dense-btn">
                  <input className="switch-input" type="checkbox" id="switch" 
                  defaultChecked={false}
                  onChange={(e)=>ParameterChange(prevState => ({
                    ...prevState,
                    require:e.target.checked
                  }))}/>
                  <label className="switch-label" htmlFor="switch"></label>
                  <p>ضروری</p>
                </div>
                <div className="btn btn-outline-primary btn-sm mb-0 me-3" 
                onClick={addItem}>افزودن</div>
              </div>
              </div>:<></>}
              <div className='parameters'>
                <table>
                  <thead>
                    <th>ردیف</th>
                    <th>پارامتر</th>
                    <th>نوع</th>
                    <th>توضیحات</th>
                    <th></th>
                  </thead>
                  <tbody>
                {props.parameters?props.parameters.map((param,i)=>(
                  <tr className='param' key={i}>
                    <td>{i+1}</td>
                    <td>{param.title}
                    <sup>{param.require?"*":""}</sup></td>
                    <td>{param.type}</td>
                    <td>{param.description}</td>
                    <td><i className='fa fa-trash removeParam'
                    onClick={()=>removeItem(i)}></i></td>
                  </tr>
                )):<></>}
                </tbody>
                </table>
              </div>
        </div>
    )
}
export default DocParameter