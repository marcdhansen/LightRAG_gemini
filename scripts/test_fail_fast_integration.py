import asyncio
import httpx
import os
import sys
import time

# Configuration
BASE_URL = "http://localhost:9621"
TEST_DOCS_DIR = "test_documents"
POLL_INTERVAL = 2  # seconds
MAX_RETRIES = 600  # 600 * 2 = 1200 seconds = 20 minutes max wait per file

async def upload_and_process_file(client, file_path):
    filename = os.path.basename(file_path)
    print(f"\n--- Processing: {filename} ({os.path.getsize(file_path)} bytes) ---")
    
    # 1. Upload
    print(f"Uploading {filename}...")
    try:
        with open(file_path, "rb") as f:
            files = {"file": (filename, f, "application/octet-stream")}
            response = await client.post(f"{BASE_URL}/documents/upload", files=files)
            
        if response.status_code != 200:
            print(f"Error: Upload failed with status {response.status_code}: {response.text}")
            return False
            
        data = response.json()
        track_id = data.get("track_id")
        
        if not track_id:
            # Handle duplicate or immediate error case if API returns different structure
            print(f"Warning: No track_id returned. Response: {data}")
            if data.get("status") == "duplicated":
                 print(f"Skipping duplicate file: {filename}")
                 return True
            return False

        print(f"Upload successful. Track ID: {track_id}")
        
    except Exception as e:
        print(f"Exception during upload: {e}")
        return False

    # 2. Poll Status
    print("Waiting for processing...")
    start_time = time.time()
    
    for i in range(MAX_RETRIES):
        try:
            status_resp = await client.get(f"{BASE_URL}/documents/track_status/{track_id}")
            if status_resp.status_code != 200:
                print(f"Error fetching status: {status_resp.status_code}")
                # Don't fail immediately on transient network error, wait and retry
                await asyncio.sleep(POLL_INTERVAL)
                continue
                
            status_data = status_resp.json()
            # Depending on API structure, status might be in summary or root
            summary = status_data.get("summary", {})
            status = summary.get("status")
            
            elapsed = time.time() - start_time
            sys.stdout.write(f"\rStatus: {status} (Elapsed: {elapsed:.1f}s)")
            sys.stdout.flush()
            
            if status == "processed":
                print(f"\nSUCCESS: {filename} processed successfully.")
                return True
            elif status == "failed":
                error = summary.get("error", "Unknown error")
                print(f"\nFAILURE: {filename} failed. Error: {error}")
                return False
                
            await asyncio.sleep(POLL_INTERVAL)
            
        except Exception as e:
            print(f"\nException during polling: {e}")
            return False

    print(f"\nTimeout waiting for {filename}")
    return False

async def main():
    if not os.path.exists(TEST_DOCS_DIR):
        print(f"Error: Directory '{TEST_DOCS_DIR}' not found.")
        sys.exit(1)

    # 1. Collect and Sort Files
    files = []
    for f in os.listdir(TEST_DOCS_DIR):
        full_path = os.path.join(TEST_DOCS_DIR, f)
        if os.path.isfile(full_path) and not f.startswith('.'):
            files.append((full_path, os.path.getsize(full_path)))
    
    # Sort by size (ascending) -> Fail Fast approach
    files.sort(key=lambda x: x[1])
    
    if not files:
        print("No files found to test.")
        return

    print(f"Found {len(files)} files. Sorted by size:")
    for path, size in files:
        print(f" - {os.path.basename(path)}: {size} bytes")

    # 2. Process Sequentially
    async with httpx.AsyncClient(timeout=60.0) as client:
        # Check server health first
        try:
            resp = await client.get(f"{BASE_URL}/auth-status")
            if resp.status_code != 200:
                print("Server is not healthy or accessible.")
                sys.exit(1)
        except Exception:
            print("Cannot connect to server. Is it running?")
            sys.exit(1)

        for path, size in files:
            success = await upload_and_process_file(client, path)
            if not success:
                print("\n[FAIL FAST TRIGGERED] Integration test stopped due to failure.")
                sys.exit(1)
    
    print("\nAll documents processed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
