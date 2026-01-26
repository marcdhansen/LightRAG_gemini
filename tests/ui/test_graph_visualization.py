from playwright.sync_api import Page, expect


def test_graph_visualization_loads(page: Page, server_process: str):
    """
    Verifies that the knowledge graph tab renders the main graph container and controls.
    """
    # 1. Navigate to web UI
    page.goto(f"{server_process}/webui/")

    # 2. Click "Knowledge Graph" tab
    graph_tab = page.get_by_role("tab", name="Knowledge Graph")
    graph_tab.click()

    # 3. Verify Sigma Container is present
    # Class name from GraphViewer.tsx: "sigma-container" or via the structure
    # The SigmaContainer usually adds a div with class 'sigma-container' or we look for canvas

    # Waiting for the tab content to mount
    page.wait_for_timeout(500)

    # Check for canvas element which is central to Sigma.js
    canvas = page.locator("canvas").first
    expect(canvas).to_be_visible()

    # 4. Verify Controls are present
    # GraphControl.tsx likely renders buttons.
    # Look for zoom controls or layout controls
    # ZoomControl typically has "+" and "-" buttons
    # or "Zoom In" / "Zoom Out" tooltips

    # Check for Zoom In button presence (by icon or tooltip if aria-label not set, relying on button generic)
    # Or just check for the controls container
    # From GraphViewer.tsx: <div className="... flex flex-col rounded-xl border-2 backdrop-blur-lg"> containing ZoomControl

    # We can check for a known text or tooltip
    # "Layout Standard" or similar might be in LayoutsControl
    # Let's check for the "Layout" button or dropdown if visible.

    # Checking for "Scene" or "Search" input
    # GraphSearch.tsx typically has a placeholder or label
    # "Search"

    # Let's verify the Settings button (Cog icon, usually has tooltip)
    # We can just assert that there are buttons in the control panel
    controls_panel = page.locator(".absolute.bottom-2.left-2")
    expect(controls_panel).to_be_visible()

    # Assert canvas has size (not 0x0)
    box = canvas.bounding_box()
    assert box["width"] > 0
    assert box["height"] > 0
