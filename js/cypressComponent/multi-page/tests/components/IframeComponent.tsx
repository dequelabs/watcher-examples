// IframeComponent.tsx
import React, { useEffect, useRef } from 'react'

interface IframeComponentProps {
  title?: string
  content?: string
}

const IframeComponent: React.FC<IframeComponentProps> = ({
  title = 'Iframe Example',
  content = '<h1>Hello from iframe</h1><p>This content is in an isolated context</p>'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // When the iframe is loaded, write content into it
    if (iframeRef.current) {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background-color: #e5e7eb, color: #9ca3af}
              </style>
              <script>
                // Execute on load
                function checkCypress() {
                  const isCypressDetected = 
                    typeof window.Cypress !== 'undefined' || 
                    window.location.href.includes('/__cypress/') ||
                    document.querySelector('#cypress-root') !== null ||
                    document.querySelector('[data-cy-root]') !== null;
                  
                   // Post the result to the parent
                  window.parent.postMessage({
                    type: 'CYPRESS_DETECTION_RESULT',
                    detected: isCypressDetected
                  }, '*');
                }
                
                // Execute on load
                window.onload = checkCypress;
              </script>
            </head>
            <body>
              ${content}
              <div id="detection-result"></div>
            </body>
          </html>
        `)
        iframeDoc.close()
      }
    }
  }, [content, title])

  useEffect(() => {
    // Listen to messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CYPRESS_DETECTION_RESULT') {
        console.log('Cypress detection in iframe:', event.data.detected)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div data-testid="iframe-container">
      <h2>{title}</h2>
      <iframe
        ref={iframeRef}
        title={title}
        width="100%"
        height="300px"
        style={{ border: '1px solid #ccc' }}
        data-testid="test-iframe"
      />
    </div>
  )
}

export default IframeComponent
