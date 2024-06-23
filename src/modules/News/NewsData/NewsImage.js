import { useEffect, useState } from "react";
import ImageSimple from "../../../components/Button/ImageSimple"
import env from "../../../env";
import tabletrans from "../../../translate/tables"

function NewsImage(props){
    const [image,setImage]= useState();
    const [upload,setUpload]= useState();
    const [imageUrl,setImageUrl] = useState('')
    const [uploadUrl,setUploadUrl] = useState('')
    const content = props.content
    console.log(upload)
    useEffect(() => {
      const postOptions={
          method:'post',
          headers: {
              "content-type": "application/json"
          },
          body:JSON.stringify({base64image:image&&image.base64,
                              imgName:image&&image.fileName,
                            folderName:"learn"})
      }//URL.createObjectURL(image)
      //console.log(postOptions)
      image&&fetch(env.siteApi+"/panel/user/upload",postOptions)
          .then(res => res.json())
          .then(
          (result) => {
            props.setCatChange(prevState => ({
              ...prevState,
              imageUrl:result.url
            }))
          },
          (error) => {
              console.log(error);
          }
          )
          .catch((error)=>{
          console.log(error)
          })

      },[image])
      const resizeFile = (file) =>
    new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
  const updateCustomers=async(event)=>{
      const uploadFile = event.target.files[0]
      const tempfile = await resizeFile(uploadFile);
        const token=props.token
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json',
            "x-access-token": token&&token.token,
            "userId":token&&token.userId
        },
            body:JSON.stringify({base64image:tempfile,folderName:"excel",
                imgName:uploadFile.name.split('.')[0],
                folderName:"learnUpload"})
          }
        fetch(env.siteApi + "/panel/user/upload",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                //console.log(result)
                if(result.error){

                }
                else{
                  props.setCatChange(prevState => ({
                    ...prevState,
                    uploadUrl:result.url
                  }))
                }
            },
            (error) => {
                console.log(error)
            })
  }
    return( 
        <div className="images">
            <div className="images">
                <h5>{tabletrans.images[props.lang]}</h5>
                <ImageSimple cardName="Input Image" imageGallery={[]} 
                    setImage={setImage} setImageUrl={setImageUrl} part={1}/>
                <img src={props.catChange.imageUrl?env.siteApiUrl+props.catChange.imageUrl:
                  (content?(env.siteApiUrl+content.imageUrl):'')} 
                  alt={content?content.title:env.default}/>
            </div>
            <div className="images">
              <h5>{tabletrans.upload[props.lang]}</h5>
              <label htmlFor="upFiles" className="edit-btn"
              style={{color: "#333"}}>
              {props.catChange.uploadUrl||content.imageUrl?<>
              <i className="fa-solid fa-refresh">
                {content.imageUrl?content.imageUrl:props.catChange.uploadUrl}
              </i>
              {tabletrans.update[props.lang]}</>:<>
              <i className="fa-solid fa-upload"></i>
              {tabletrans.upload[props.lang]}</>
            }

            </label>
            <input id="upFiles" type="file" accept=".*" className="hidden" 
                  onChange={updateCustomers}/>
            </div>
        </div>
    )
}
export default NewsImage