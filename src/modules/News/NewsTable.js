import { useState } from "react"
import tabletrans from "../../translate/tables"
import NewsTableRow from "./NewsTableRow";

function NewsTable(props){
  const data = props.data
  const lang=props.lang;
  const [detail,showDetail] = useState(-1)
    return(
        <table>
        <thead>
        <tr>
          <th className="checkBoxStyle">
              <input type="checkbox" name="" id=""/></th>
            <th>
              <p>{tabletrans.order[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.customer[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.date[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.brand[lang]}</p>
              <i></i>
            </th>
            <th>
              <p>{tabletrans.item[lang]}</p>
              <i></i>
            </th>
            <th>
            <p>{tabletrans.price[lang]}</p>
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
          {data&&data.filter?data.filter.map((data,i)=>(
            <NewsTableRow detail={detail} showDetail={showDetail} 
            data={data} index={i} key={i} lang={lang}/>
          )):''}
          
        </tbody>
      </table>

    )
}
export default NewsTable