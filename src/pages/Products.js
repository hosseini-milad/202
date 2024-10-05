import Cookies from "universal-cookie";
import StatusBar from "../modules/Components/StatusBar";
import Paging from "../modules/Components/Paging";
import errortrans from "../translate/error";
import { useEffect } from "react";
import { useState } from "react";
import env from "../env";
import ProductTable from "../modules/Products/ProductTable";
import tabletrans from "../translate/tables";
import ProductFilters from "../modules/Products/ProductComponent/ProductFilters";
import {
  getFiltersFromUrl,
  updateUrlWithFilters,
  defaultFilterValues,
  handleFilterChange,
} from "../utils/filterUtils"; // Import the utility functions

const cookies = new Cookies();

function Products(props) {
  const direction = props.lang ? props.lang.dir : errortrans.defaultDir;
  const lang = props.lang ? props.lang.lang : errortrans.defaultLang;
  const [content, setContent] = useState("");
  const [filters, setFilters] = useState(
    getFiltersFromUrl() || { active: "1" }
  );
  
  const [update, setUpdate] = useState(0);
  const [loading, setLoading] = useState(0);
  const [counter, setCounter] = useState(0);
  const [store,setStore] = useState(-1)
  const token = cookies.get(env.cookieName);
  // Function to handle filter changes
  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    updateUrlWithFilters(newFilters);
  }
  useEffect(() => {
    setLoading(1);
    const body = {
      offset: filters.offset || "0",
      pageSize: filters.pageSize || "10",
      customer: filters.customer,
      title: filters.title,
      sku: filters.sku,
      status: filters.status,
      active: filters.active,
      store: filters.store,
      exist:filters.exist,
      brand: filters.brand,
      dateFrom: filters.date && filters.date.dateFrom,
      dateTo: filters.date && filters.date.dateTo,
      access: "manager",
    };
    const postOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify(body),
    };
    fetch(env.siteApi + "/panel/product/list-product", postOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          setLoading(0);
          setContent("");
          setTimeout(() => setContent(result), 200);
        },
        (error) => {
          setLoading(0);
          console.log(error);
        }
      );
  }, [filters]);
  const RefreshItems = async () => {
    const productList = content.full;
    setCounter(content.full.length);
    /*for(var i=0;i<productList.length;i++){
      const outData =await fetchData(productList[i].sku)
      if(outData&&outData.success){
        updateSite(productList[i]._id,outData)
      }
    }*/
  };
  useEffect(() => {
    if (!content || !content.full) {
      setCounter(0);
      return;
    }
    if (counter > content.full.length) {
      setCounter(0);
      window.location.reload();
    }
    if (counter) counterFunction();
  }, [counter]);
  const counterFunction = async () => {
    const outData = await fetchData(content.full[counter - 1].sku);

    setTimeout(() => setCounter(counter - 1), 3000);
  };
  const fetchData = async (sku) => {
    const postOptions = {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ productId: sku }),
    }; //URL.createObjectURL(image)
    //console.log(postOptions)
    await fetch(env.siteApi + "/panel/product/updateProduct", postOptions)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) updateSite(content.full[counter - 1]._id, result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateSite = async (productId, newData) => {
    const data = newData.data;
    const newConvertData = {
      title: data.title,
      sku: data.sku,
      enTitle: data.ename,
      productUrl: data.product_url,
      description: data.short,
      fullDesc: data.tozihat,

      metaTitle: data.meta_title,
      productMeta: data.meta_disc,

      brandId: data.brand_id,
      catId: data.cat_id,

      imageUrl: newData.image,
      thumbUrl: newData.thumb,
    };
    var postOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: productId, ...newConvertData }),
    };
    console.log(postOptions);
    fetch(env.siteApi + "/panel/product/editProduct", postOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.error) {
            console.log("Error");
          } else {
            console.log("Done");
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const updateCustomers = async (event) => {
    const uploadFile = event.target.files[0];
    const tempfile = await resizeFile(uploadFile);
    const token = props.token;
    const postOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify({
        base64image: tempfile,
        folderName: "excel",
        imgName: uploadFile.name.split(".")[0],
      }),
    };
    fetch(env.siteApi + "/panel/product/upload", postOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log(result)
          if (result.error) {
          } else {
            setUpdate(result.url);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const resizeFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
    const SendExel = async () => {
      const postOptions = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token && token.token,
          userId: token && token.userId,
        },
        body: JSON.stringify({url:update }),
      }; //URL.createObjectURL(image)
      //console.log(postOptions)
      await fetch(env.siteApi + "/panel/product/parse-products", postOptions)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          window.location.reload()
        })
        .catch((error) => {
          console.log(error);
        });
    };
    console.log(update)
  return (
    <div className="user" style={{ direction: direction }}>
      <div className="od-header">
        <div className="od-header-info">
          <div className="od-header-name">
            <p>{tabletrans.products[lang]}</p>
          </div>
          
        </div>
        <div className="od-header-btn">
          {update?
          <div className="edit-btn" onClick={SendExel}>
            بروزرسانی قیمت
          </div>
          :<label className="uplaod-file" htmlFor="upFiles">آپلود قیمت
            <input
            id="upFiles"
            type="file"
            accept=".*"
            className="hidden"
            onChange={updateCustomers}
            style={{display:"none"}}
          />
          </label>}
          
          <div
            className="edit-btn add-btn"
            onClick={() => (window.location.href = "/products/detail/new")}
          >
            <i className="fa-solid fa-plus"></i>
            <p>{tabletrans.addNew[lang]}</p>
          </div>
          <div className="edit-btn" onClick={() => RefreshItems()}>
            <i className="fa-solid fa-refresh"></i>
            <p>{tabletrans.update[lang]}</p>
          </div>
        </div>
      </div>
      <div className="list-container">
        <ProductFilters
          lang={props.lang}
          setStore={setStore}
          setFilters={handleFilterChange}
          updateUrlWithFilters={updateUrlWithFilters} // Pass the function as a prop
          options={content.brand}
          filters={filters}
          currentFilters={filters}
        />
        <div className="user-list">
          {loading ? (
            env.loader
          ) : (
            <ProductTable product={content} lang={lang} store={store}/>
          )}
        </div>
        <Paging
          content={content}
          setFilters={setFilters}
          filters={filters}
          lang={props.lang}
          updateUrlWithFilters={updateUrlWithFilters} // Pass the function as a prop
        />
      </div>
    </div>
  );
}
export default Products;
