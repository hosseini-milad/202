import { CopyBlock, obsidian } from 'react-code-blocks';

function ApiDocumentResponse({ data }) {
  return (
    <div className="api-document-response">
      <CopyBlock
        language="json"
        text={data}
        showLineNumbers={true}
        theme={obsidian}
        wrapLines={true}
        codeBlock
      />
    </div>
  );
}

export default ApiDocumentResponse;
