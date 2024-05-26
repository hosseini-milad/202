import { CopyBlock, obsidian } from 'react-code-blocks';

function ApiDocumentRequest({ data }) {
  return (
    <div className="api-document-request">
      <CopyBlock
        language="javascript"
        text={data}
        showLineNumbers={true}
        theme={obsidian}
        wrapLines={true}
        codeBlock
      />
    </div>
  );
}

export default ApiDocumentRequest;
