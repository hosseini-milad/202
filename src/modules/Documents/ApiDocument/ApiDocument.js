import { useState } from 'react';

// sub-components
import ApiDocumentParameters from './ApiDocumentParameters';
import ApiDocumentRequest from './ApiDocumentRequest';
import ApiDocumentResponse from './ApiDocumentResponse';

// css
import './ApiDocument.css';

// globals
const TABS = ['parameters', 'request', 'response'];

function ApiDocument({ data }) {
  const { path, type, description, parameters, request, response } = data;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const handleClickSummary = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`api-document api-document--type-${type}`}>
      <div className="api-document__summary" onClick={handleClickSummary}>
        <div className="api-document__summary-type">{type}</div>
        <div className="api-document__summary-path">{path}</div>
        <div className="api-document__summary-description">{description}</div>

        <i className="api-document__summary-expand-icon fa fa-chevron-down"></i>
      </div>

      {expanded && (
        <div className="api-document__content">
          <div className="api-document__content-top">
            {TABS.map((tab) => (
              <div
                className={`api-document__content-tab-header ${
                  activeTab === tab
                    ? 'api-document__content-tab-header--active'
                    : ''
                }`}
                onClick={() => {
                  setActiveTab(tab);
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="api-document__content-body">
            {
              {
                parameters: <ApiDocumentParameters data={parameters} />,
                request: <ApiDocumentRequest data={request} />,
                response: <ApiDocumentResponse data={response} />,
              }[activeTab]
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiDocument;
