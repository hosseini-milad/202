import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ApiDocumentGroup from '../modules/Documents/ApiDocumentGroup/ApiDocumentGroup';
//import mocks from '../modules/Documents/mocks.json';

// MUI components
import { FormControl, MenuItem, Select } from '@mui/material';
import env from '../env';

const VERSIONS = ['v1.0.0'];

function Documents({ lang }) {
  const [version, setVersion] = useState(VERSIONS[0]);
  const [mocks,setMocks] = useState([])
  useEffect(()=>{
   fetch(env.siteApi + "/setting/list-mocks")
.then(res => res.json())
.then(
  (result) => {
          setMocks(result)
   },
  (error) => {
    console.log(error);
  }
)
  },[])
  const handleVersionChange = (event) => {
    setVersion(event.target.value);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#fafafa' }}>
      <div className="p-5">
        <h2>MehrGaz API</h2>
        <Link className="text-info" to={'/'}>
          go back to home...
        </Link>
      </div>

      <div className="bg-white shadow-secondary my-4 p-5 d-flex align-items-center">
        <div className="fw-bold">Select version:</div>

        <FormControl sx={{ m: 1, width: 300 }} size="small">
          <Select value={version} onChange={handleVersionChange}>
            {VERSIONS.map((version) => (
              <MenuItem key={version} value={version}>
                {version}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="px-4 pb-10">
        {mocks.map((data) => (
          <ApiDocumentGroup data={data} />
        ))}
      </div>
    </div>
  );
}
export default Documents;