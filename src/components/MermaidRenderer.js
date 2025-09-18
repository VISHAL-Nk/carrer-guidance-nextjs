"use client";
import mermaid from "mermaid";
import { useEffect, useId, useState, useCallback, useRef } from "react";

export default function MermaidRenderer({ code, config, onRetryRequest }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
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

      // Initialize mermaid with better configuration for content visibility
      mermaid.initialize({ 
        startOnLoad: false, 
        securityLevel: "loose", 
        theme: "default",
        themeVariables: {
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          primaryColor: "#3b82f6",
          primaryTextColor: "#1f2937",
          primaryBorderColor: "#2563eb",
          lineColor: "#374151",
          sectionBkgColor: "#f9fafb",
          altSectionBkgColor: "#f3f4f6",
          gridColor: "#e5e7eb",
          textColor: "#1f2937",
          taskBkgColor: "#f9fafb",
          taskTextColor: "#1f2937",
          activeTaskBkgColor: "#dbeafe",
          activeTaskBorderColor: "#3b82f6",
          cScale0: "#3b82f6",
          cScale1: "#10b981",
          cScale2: "#f59e0b"
        },
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        fontSize: 14,
        maxTextSize: 50000,
        maxEdges: 500,
        htmlLabels: true,
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: false,
          wrap: true
        },
        gantt: {
          useMaxWidth: false
        },
        ...config 
      });

      // Render with timeout protection
      const renderPromise = mermaid.render(`mmd-${id}`, code);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Rendering timeout")), 15000)
      );

      const result = await Promise.race([renderPromise, timeoutPromise]);
      
      if (result && result.svg) {
        // Preserve SVG dimensions and styling for proper content visibility
        let cleanSvg = result.svg;
        
        // Ensure proper viewBox and preserve dimensions
        if (!cleanSvg.includes('viewBox')) {
          const widthMatch = cleanSvg.match(/width="(\d+)"/);
          const heightMatch = cleanSvg.match(/height="(\d+)"/);
          if (widthMatch && heightMatch) {
            const width = widthMatch[1];
            const height = heightMatch[1];
            cleanSvg = cleanSvg.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`);
          }
        }
        
        // Make sure text and content are visible
        cleanSvg = cleanSvg
          .replace(/fill="transparent"/g, 'fill="#1f2937"')
          .replace(/stroke="transparent"/g, 'stroke="#374151"')
          .replace(/color="transparent"/g, 'color="#1f2937"');
        
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

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const togglePanning = useCallback(() => {
    setIsPanning(prev => !prev);
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  }, []);

  // Handle mouse events for panning
  const handleMouseDown = useCallback((e) => {
    if (isPanning && e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  }, [isPanning, panOffset]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && isPanning) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPanOffset(newOffset);
    }
  }, [isDragging, isPanning, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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

  // Success state - render the SVG with zoom controls
  return (
    <div className={`mermaid-container ${isFullscreen ? 'mermaid-fullscreen' : ''}`}>
      {/* Control Panel */}
      <div className="mermaid-controls flex items-center justify-between p-3 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded-t-lg shadow-sm">
        <div className="flex items-center space-x-2">
          {/* Hand/Pan Tool */}
          <button
            onClick={togglePanning}
            className={`w-8 h-8 flex items-center justify-center border-2 rounded transition-all ${
              isPanning 
                ? 'bg-blue-500 border-blue-600 text-white shadow-md' 
                : 'bg-white border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500'
            }`}
            title={isPanning ? "Disable Pan Mode" : "Enable Pan Mode (Drag to move)"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Zoom Controls */}
          <span className="text-sm font-medium text-gray-700">Zoom:</span>
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 transition-all"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          
          <div className="px-3 py-1 text-sm font-mono font-semibold text-gray-800 bg-white border-2 border-gray-400 rounded min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </div>
          
          <button
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 transition-all"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          
          <button
            onClick={resetView}
            className="px-3 py-1 text-xs font-medium bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 hover:border-gray-500 transition-all"
            title="Reset View (Zoom & Position)"
          >
            Reset View
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 hover:border-gray-500 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Diagram Container */}
      <div 
        ref={containerRef}
        className={`mermaid-diagram-container border border-gray-200 border-t-0 rounded-b-lg bg-white ${
          isPanning ? 'cursor-grab' : 'cursor-default'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{ 
          height: isFullscreen ? 'calc(100vh - 120px)' : 'auto',
          minHeight: isFullscreen ? 'calc(100vh - 120px)' : '300px',
          maxHeight: isFullscreen ? 'none' : '600px',
          overflow: isPanning ? 'hidden' : 'auto',
          position: 'relative'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="mermaid-svg-wrapper p-4 flex items-center justify-center min-h-full"
          style={{ 
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
            userSelect: isPanning ? 'none' : 'auto'
          }}
        >
          <div 
            className="mermaid-svg-content"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>💡 Ctrl/Cmd + scroll to zoom</span>
          <span>✋ Enable hand tool to drag and pan</span>
        </div>
        {retryCount > 0 && (
          <span className="text-green-600 font-medium">
            ✓ Rendered successfully{retryCount > 1 ? ` after ${retryCount} attempts` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
