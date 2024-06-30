import { useState } from "react"
import tabletrans from "../../translate/tables"
import CatTableRow from "./CatTableRow";

function CatTable(props){
  const cat = props.cat
  const lang=props.lang;
  const [detail,showDetail] = useState(-1)
    return(
        <table>
        <thead>
        <tr>
          <th className="checkBoxStyle">
              <input type="checkbox" name="" id=""/></th>
            <th>
              <p>{tabletrans.code[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.category[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.date[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.link[lang]}</p>
              <i></i>
            </th>
            <th>
            <p>{tabletrans.status[lang]}</p>
              <i></i>
            </th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {cat&&cat.filter?cat.filter.map((cat,i)=>(
            <CatTableRow detail={detail} showDetail={showDetail} 
            cat={cat} index={i} key={i} lang={lang}/>
          )):''}
          
        </tbody>
      </table>

    )
}
export default CatTable