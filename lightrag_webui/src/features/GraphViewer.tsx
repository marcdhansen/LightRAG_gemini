import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
// import { MiniMap } from '@react-sigma/minimap'
import { SigmaContainer, useRegisterEvents, useSigma } from '@react-sigma/core'
import { Settings as SigmaSettings } from 'sigma/settings'
import { GraphSearchOption, OptionItem } from '@react-sigma/graph-search'
import { EdgeArrowProgram, NodePointProgram, NodeCircleProgram } from 'sigma/rendering'
import { NodeBorderProgram } from '@sigma/node-border'
import { EdgeCurvedArrowProgram, createEdgeCurveProgram } from '@sigma/edge-curve'

import FocusOnNode from '@/components/graph/FocusOnNode'
import LayoutsControl from '@/components/graph/LayoutsControl'
import GraphControl from '@/components/graph/GraphControl'
// import ThemeToggle from '@/components/ThemeToggle'
import ZoomControl from '@/components/graph/ZoomControl'
import FullScreenControl from '@/components/graph/FullScreenControl'
import Settings from '@/components/graph/Settings'
import GraphSearch from '@/components/graph/GraphSearch'
import GraphLabels from '@/components/graph/GraphLabels'
import PropertiesView from '@/components/graph/PropertiesView'
import SettingsDisplay from '@/components/graph/SettingsDisplay'
import Legend from '@/components/graph/Legend'
import LegendButton from '@/components/graph/LegendButton'

import { useSettingsStore } from '@/stores/settings'
import { useGraphStore } from '@/stores/graph'
import { useBackendState } from '@/stores/state'
import { labelColorDarkTheme, labelColorLightTheme } from '@/lib/constants'
import { Terminal, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '@/components/ui/Button'

import '@react-sigma/core/lib/style.css'
import '@react-sigma/graph-search/lib/style.css'

// Function to create sigma settings based on theme
const createSigmaSettings = (isDarkTheme: boolean): Partial<SigmaSettings> => ({
  allowInvalidContainer: true,
  defaultNodeType: 'default',
  defaultEdgeType: 'curvedNoArrow',
  renderEdgeLabels: false,
  edgeProgramClasses: {
    arrow: EdgeArrowProgram,
    curvedArrow: EdgeCurvedArrowProgram,
    curvedNoArrow: createEdgeCurveProgram()
  },
  nodeProgramClasses: {
    default: NodeBorderProgram,
    circel: NodeCircleProgram,
    point: NodePointProgram
  },
  labelGridCellSize: 60,
  labelRenderedSizeThreshold: 12,
  enableEdgeEvents: true,
  labelColor: {
    color: isDarkTheme ? labelColorDarkTheme : labelColorLightTheme,
    attribute: 'labelColor'
  },
  edgeLabelColor: {
    color: isDarkTheme ? labelColorDarkTheme : labelColorLightTheme,
    attribute: 'labelColor'
  },
  edgeLabelSize: 8,
  labelSize: 12
  // minEdgeThickness: 2
  // labelFont: 'Lato, sans-serif'
})

const GraphEvents = () => {
  const registerEvents = useRegisterEvents()
  const sigma = useSigma()
  const [draggedNode, setDraggedNode] = useState<string | null>(null)

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node)
        sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true)
      },
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: (e) => {
        if (!draggedNode) return
        // Get new position of node
        const pos = sigma.viewportToGraph(e)
        sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x)
        sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y)

        // Prevent sigma to move camera:
        e.preventSigmaDefault()
        e.original.preventDefault()
        e.original.stopPropagation()
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null)
          sigma.getGraph().removeNodeAttribute(draggedNode, 'highlighted')
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: (e) => {
        // Only set custom BBox if it's a drag operation (mouse button is pressed)
        const mouseEvent = e.original as MouseEvent;
        if (mouseEvent.buttons !== 0 && !sigma.getCustomBBox()) {
          sigma.setCustomBBox(sigma.getBBox())
        }
      }
    })
  }, [registerEvents, sigma, draggedNode])

  return null
}

const GraphViewer = () => {
  const [isThemeSwitching, setIsThemeSwitching] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const sigmaRef = useRef<any>(null)
  const prevTheme = useRef<string>('')
  const logsEndRef = useRef<HTMLDivElement>(null)

  const selectedNode = useGraphStore.use.selectedNode()
  const focusedNode = useGraphStore.use.focusedNode()
  const moveToSelectedNode = useGraphStore.use.moveToSelectedNode()
  const isFetching = useGraphStore.use.isFetching()

  const showPropertyPanel = useSettingsStore.use.showPropertyPanel()
  const showNodeSearchBar = useSettingsStore.use.showNodeSearchBar()
  const enableNodeDrag = useSettingsStore.use.enableNodeDrag()
  const showLegend = useSettingsStore.use.showLegend()
  const logs = useGraphStore.use.logs()
  const errorMessage = useBackendState.use.message()
  const errorMessageTitle = useBackendState.use.messageTitle()
  const theme = useSettingsStore.use.theme()

  // Memoize sigma settings to prevent unnecessary re-creation
  const memoizedSigmaSettings = useMemo(() => {
    const isDarkTheme = theme === 'dark'
    return createSigmaSettings(isDarkTheme)
  }, [theme])

  // Initialize sigma settings based on theme with theme switching protection
  useEffect(() => {
    // Detect theme change
    const isThemeChange = prevTheme.current && prevTheme.current !== theme
    if (isThemeChange) {
      setIsThemeSwitching(true)
      console.log('Theme switching detected:', prevTheme.current, '->', theme)

      // Reset theme switching state after a short delay
      const timer = setTimeout(() => {
        setIsThemeSwitching(false)
        console.log('Theme switching completed')
      }, 150)

      return () => clearTimeout(timer)
    }
    prevTheme.current = theme
    console.log('Initialized sigma settings for theme:', theme)
  }, [theme])

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (showLogs && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, showLogs])

  // Clean up sigma instance when component unmounts
  useEffect(() => {
    return () => {
      // TAB is mount twice in vite dev mode, this is a workaround

      const sigma = useGraphStore.getState().sigmaInstance;
      if (sigma) {
        try {
          // Destroy sigma，and clear WebGL context
          sigma.kill();
          useGraphStore.getState().setSigmaInstance(null);
          console.log('Cleared sigma instance on Graphviewer unmount');
        } catch (error) {
          console.error('Error cleaning up sigma instance:', error);
        }
      }
    };
  }, []);

  // Note: There was a useLayoutEffect hook here to set up the sigma instance and graph data,
  // but testing showed it wasn't executing or having any effect, while the backup mechanism
  // in GraphControl was sufficient. This code was removed to simplify implementation

  const onSearchFocus = useCallback((value: GraphSearchOption | null) => {
    if (value === null) useGraphStore.getState().setFocusedNode(null)
    else if (value.type === 'nodes') useGraphStore.getState().setFocusedNode(value.id)
  }, [])

  const onSearchSelect = useCallback((value: GraphSearchOption | null) => {
    if (value === null) {
      useGraphStore.getState().setSelectedNode(null)
    } else if (value.type === 'nodes') {
      useGraphStore.getState().setSelectedNode(value.id, true)
    }
  }, [])

  const autoFocusedNode = useMemo(() => focusedNode ?? selectedNode, [focusedNode, selectedNode])
  const searchInitSelectedNode = useMemo(
    (): OptionItem | null => (selectedNode ? { type: 'nodes', id: selectedNode } : null),
    [selectedNode]
  )

  // Always render SigmaContainer but control its visibility with CSS
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SigmaContainer
        settings={memoizedSigmaSettings}
        className="!bg-background !size-full overflow-hidden"
        ref={sigmaRef}
      >
        <GraphControl />

        {enableNodeDrag && <GraphEvents />}

        <FocusOnNode node={autoFocusedNode} move={moveToSelectedNode} />

        <div className="absolute top-2 left-2 flex items-start gap-2">
          <GraphLabels />
          {showNodeSearchBar && !isThemeSwitching && (
            <GraphSearch
              value={searchInitSelectedNode}
              queryLabel={useSettingsStore.use.queryLabel()}
              onFocus={onSearchFocus}
              onChange={onSearchSelect}
            />
          )}
        </div>

        <div className="bg-background/60 absolute bottom-2 left-2 flex flex-col rounded-xl border-2 backdrop-blur-lg">
          <LayoutsControl />
          <ZoomControl />
          <FullScreenControl />
          <LegendButton />
          <Settings />
          <Button
            variant="ghost"
            size="icon"
            tooltip="View Logs"
            onClick={() => setShowLogs(!showLogs)}
            className={showLogs ? 'bg-primary/20 text-primary' : ''}
          >
            <Terminal className="h-4 w-4" />
          </Button>
          {/* <ThemeToggle /> */}
        </div>

        {showPropertyPanel && (
          <div className="absolute top-2 right-2 z-10">
            <PropertiesView />
          </div>
        )}

        {showLegend && (
          <div className="absolute bottom-10 right-2 z-0">
            <Legend className="bg-background/60 backdrop-blur-lg" />
          </div>
        )}

        {/* <div className="absolute bottom-2 right-2 flex flex-col rounded-xl border-2">
          <MiniMap width="100px" height="100px" />
        </div> */}

        <SettingsDisplay />
      </SigmaContainer>

      {/* Logs Panel */}
      {showLogs && (
        <div className="bg-background/80 absolute bottom-12 left-14 z-50 flex h-64 w-80 flex-col rounded-xl border-2 backdrop-blur-lg transition-all shadow-xl">
          <div className="flex items-center justify-between border-b p-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Process Logs</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => useGraphStore.getState().clearLogs()}>
                <X className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowLogs(false)}>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px] leading-tight">
            {logs.length === 0 ? (
              <div className="text-muted-foreground italic opacity-50">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-primary opacity-50">{log.split('] ')[0]}]</span>
                  <span> {log.split('] ')[1]}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {errorMessage && !isFetching && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
          <div className="bg-background max-w-md animate-in fade-in zoom-in duration-300 rounded-xl border-2 border-destructive/50 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <h3 className="text-xl font-bold">{errorMessageTitle || 'Error'}</h3>
            </div>
            <p className="mb-6 text-sm opacity-80 font-mono bg-muted p-3 rounded border overflow-auto max-h-40">
              {errorMessage}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => useBackendState.getState().clear()}>
                Dismiss
              </Button>
              <Button variant="destructive" onClick={() => {
                useBackendState.getState().clear();
                // Optionally retry or reset settings
                useSettingsStore.getState().setQueryLabel('');
              }}>
                Reset Connection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay - shown when data is loading or theme is switching */}
      {(isFetching || isThemeSwitching) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p>{isThemeSwitching ? 'Switching Theme...' : 'Loading Graph Data...'}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphViewer
