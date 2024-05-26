import ApiDocument from '../ApiDocument/ApiDocument';
import './ApiDocumentGroup.css';

function ApiDocumentGroup({ data }) {
  const { name, description, apis } = data;

  return (
    <div className="api-document-group">
      <div className="api-document-group__top">
        <h3 className="api-document-group__name">{name}</h3>
        <div className="api-document-group__description">{description}</div>
      </div>

      <div className="api-document-group__body">
        {apis.map((data) => (
          <ApiDocument data={data} />
        ))}
      </div>
    </div>
  );
}

export default ApiDocumentGroup;
