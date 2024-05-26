import './ApiDocumentParameters.css';

function ApiDocumentParameters({ data }) {
  return (
    <table className="api-document-parameters">
      <thead>
        <tr>
          <th className="api-document-parameters__header">Name</th>
          <th className="api-document-parameters__header">Description</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ title, type, require, description }) => (
          <tr>
            <td className="api-document-parameters__data">
              <div className="api-document-parameters__name">
                {title}
                {require && (
                  <span className="api-document-parameters__required">
                    &nbsp;*
                  </span>
                )}
              </div>
              <div className="api-document-parameters__type">{type}</div>
            </td>
            <td className="api-document-parameters__data">
              <div className="api-document-parameters__description">
                {description}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApiDocumentParameters;
