"use client";
import mermaid from "mermaid";
import { useEffect, useId, useState, useCallback } from "react";

export default function MermaidRenderer({ code, config, onRetryRequest }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const id = useId().replace(/:/g, "");

  // Validate Mermaid syntax
  const validateMermaidCode = useCallback((code) => {
    if (!code || typeof code !== 'string') return false;
    
    // Basic validation: check for common Mermaid diagram types
    const validStartPatterns = [
      /^graph\s+(TD|TB|BT|RL|LR)/i,
      /^flowchart\s+(TD|TB|BT|RL|LR)/i,
      /^sequenceDiagram/i,
      /^classDiagram/i,
      /^gitgraph/i,
      /^gantt/i,
      /^pie\s+title/i,
      /^journey/i,
      /^mindmap/i
    ];
    
    const trimmedCode = code.trim();
    return validStartPatterns.some(pattern => pattern.test(trimmedCode));
  }, []);

  // Clean up any previous Mermaid DOM elements
  const cleanup = useCallback(() => {
    try {
      // Remove any existing mermaid elements that might cause conflicts
      const existingElement = document.getElementById(`mmd-${id}`);
      if (existingElement) {
        existingElement.remove();
      }
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }
  }, [id]);

  const renderMermaid = useCallback(async () => {
    if (!code) return;
    
    setIsLoading(true);
    setError(null);
    cleanup();

    try {
      // Validate code first
      if (!validateMermaidCode(code)) {
        throw new Error("Invalid Mermaid diagram syntax. Please check your diagram format.");
      }

      // Initialize mermaid with safe configuration
      mermaid.initialize({ 
        startOnLoad: false, 
        securityLevel: "loose", 
        theme: "default",
        fontFamily: "inherit",
        maxTextSize: 50000,
        maxEdges: 500,
        ...config 
      });

      // Render with timeout protection
      const renderPromise = mermaid.render(`mmd-${id}`, code);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Rendering timeout")), 10000)
      );

      const result = await Promise.race([renderPromise, timeoutPromise]);
      
      if (result && result.svg) {
        // Clean the SVG to prevent layout issues
        const cleanSvg = result.svg
          .replace(/style="max-width: \d+px;"/g, '') // Remove fixed width constraints
          .replace(/width="\d+"/g, 'width="100%"') // Make responsive
          .replace(/height="\d+"/g, 'height="auto"'); // Make responsive height
        
        setSvg(cleanSvg);
        setError(null);
      } else {
        throw new Error("Failed to generate SVG output");
      }
    } catch (e) {
      console.error("Mermaid render error:", e);
      setError(e.message || "Failed to render diagram");
      setSvg("");
    } finally {
      setIsLoading(false);
    }
  }, [code, config, id, validateMermaidCode, cleanup]);

  useEffect(() => {
    if (!code) {
      setSvg("");
      setError(null);
      return;
    }

    let cancelled = false;
    const render = async () => {
      await renderMermaid();
    };

    render();
    return () => { 
      cancelled = true;
      cleanup();
    };
  }, [code, renderMermaid, cleanup]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    renderMermaid();
  }, [renderMermaid]);

  const handleRegenerateRequest = useCallback(() => {
    if (onRetryRequest) {
      onRetryRequest("The diagram failed to render properly. Please regenerate the Mermaid code with correct syntax.");
    }
  }, [onRetryRequest]);

  if (!code) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Rendering diagram...</p>
        </div>
      </div>
    );
  }

  // Error state with retry options
  if (error) {
    return (
      <div className="border border-red-200 rounded-lg bg-red-50 p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Diagram Rendering Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            
            <div className="mt-4 space-x-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-800 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Rendering
              </button>
              
              {onRetryRequest && (
                <button
                  onClick={handleRegenerateRequest}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Regenerate Code
                </button>
              )}
            </div>
            
            {retryCount > 2 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>Tip:</strong> If the diagram keeps failing, try regenerating it with simpler syntax or check the{' '}
                  <a href="https://mermaid.js.org/syntax/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">
                    Mermaid documentation
                  </a> for proper syntax.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Show code for debugging */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
            View Mermaid Code
          </summary>
          <pre className="mt-2 p-3 bg-white border border-red-200 rounded text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
            {code}
          </pre>
        </details>
      </div>
    );
  }

  // Success state - render the SVG
  return (
    <div className="mermaid-container">
      <div 
        className="overflow-auto w-full" 
        style={{ minHeight: '200px', maxHeight: '800px' }}
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
      
      {/* Success feedback for users */}
      {retryCount > 0 && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-xs text-green-700">
            ✓ Diagram rendered successfully{retryCount > 1 ? ` after ${retryCount} attempts` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
