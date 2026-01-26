from playwright.sync_api import Page, expect

def test_query_history_persists_and_clears(page: Page, server_process: str):
    """
    Verifies that:
    1. Entering a query saves it to history.
    2. The saved query appears in the autocomplete dropdown.
    3. Clicking 'Clear' removes the query from history.
    """
    # Navigate to the web UI
    page.goto(f"{server_process}/webui/")
    
    # Select the "Retrieval" tab
    # Assuming standard Radix UI Tabs trigger role
    # Trying strict role first, fallback to text if needed
    retrieval_tab = page.get_by_role("tab", name="Retrieval")
    retrieval_tab.click()
    
    # Wait for the input to be attached
    input_selector = "#query-input"
    page.wait_for_selector(input_selector, state="attached")
    
    # Force fill if necessary, as custom inputs might be overlayed
    # But first try standard fill
    try:
         page.wait_for_selector(input_selector, state="visible", timeout=5000)
    except:
         print("Input visible timeout, attempting force fill/interaction")

    # Type a query and submit
    test_query = "Automated Test Query"
    page.locator(input_selector).fill(test_query, force=True)
    page.press(input_selector, "Enter")
    
    # Wait for processing to start (loading state or response)
    # Just waiting a bit to ensure submission is registered
    page.wait_for_timeout(1000)
    
    # Reload page to prove persistence (optional, but good practice)
    page.reload()
    page.wait_for_selector(input_selector)
    
    # Focus input to trigger dropdown
    page.click(input_selector)
    
    # Verify the query appears in the dropdown
    # The dropdown items are likely in a div with specific formatting
    # Based on UserPromptInputWithHistory.tsx, items are in a div with text
    dropdown_item = page.get_by_text(test_query, exact=True)
    expect(dropdown_item).to_be_visible()
    
    # Click the "Clear" button (eraser icon)
    # Finding button by text "Clear" or icon
    clear_button = page.get_by_role("button", name="Clear")
    clear_button.click()
    
    # Verify input is cleared
    expect(page.locator(input_selector)).to_have_value("")
    
    # Click input again to check history
    page.click(input_selector)
    
    # Verify the dropdown item is GONE
    expect(dropdown_item).not_to_be_visible()
