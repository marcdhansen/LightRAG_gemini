import sys
print(f"Python executable: {sys.executable}")
print(f"Sys Path: {sys.path}")
try:
    print("Attempting to import FlagEmbedding...")
    from FlagEmbedding import FlagReranker
    print("Success! FlagReranker imported.")
except Exception as e:
    print(f"Import failed with error: {e}")
    import traceback
    traceback.print_exc()
