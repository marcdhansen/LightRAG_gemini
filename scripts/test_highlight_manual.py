import asyncio
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from lightrag.highlight import get_highlights

async def main():
    query = "What is the capital of France?"
    context = (
        "Paris is the capital and most populous city of France. "
        "It is located in the northern-central part of the country. "
        "The city is a major center for finance, diplomacy, commerce, fashion, gastronomy, and science. "
        "Berlin is the capital of Germany."
    )
    
    print(f"Query: {query}")
    print(f"Context: {context}")
    print("-" * 50)
    
    print("Getting highlights with threshold 0.6...")
    result = get_highlights(query, context, threshold=0.6)
    
    print("\nHighlighted Sentences:")
    for i, sent in enumerate(result["highlighted_sentences"]):
        prob = result["sentence_probabilities"][i]
        print(f"[{prob:.4f}] {sent}")
    
    print("-" * 50)
    print("Getting highlights with threshold 0.9 (conservative)...")
    result = get_highlights(query, context, threshold=0.9)
    
    print("\nHighlighted Sentences:")
    for i, sent in enumerate(result["highlighted_sentences"]):
        prob = result["sentence_probabilities"][i]
        print(f"[{prob:.4f}] {sent}")

if __name__ == "__main__":
    asyncio.run(main())
