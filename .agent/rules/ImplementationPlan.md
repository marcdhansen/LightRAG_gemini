# Evaluation Framework Standardization (RAGAS + Langfuse)

## Goal

Establish a robust evaluation pipeline to measure RAG quality (Context Recall, Faithfulness, Answer Relevance) using RAGAS, and visualize traces/metrics in Langfuse.

## Status: COMPLETE (2026-01-26)

* [x] **Langfuse Integration**: Traces and RAGAS scores are automatically sent to local Langfuse.
* [x] **Tiered Testing**: Pytest-based `light` and `heavy` paths implemented.
* [x] **Documentation**:
  * `docs/OBSERVABILITY.md`
  * `docs/EVALUATION.md`
  * `docs/ACE_FRAMEWORK.md`
* [x] **Verification**: Light path verified (~17 min per test case on local LLMs).

## Implementation Details

### 1. Langfuse Infrastructure

Local deployment via Docker Compose (`langfuse_docker/docker-compose.yml`). Available at `http://localhost:3000`.

### 2. Tiered Testing Strategy (`tests/conftest.py`)

* `--run-light`: Only runs basic verification (limit=1).
* `--run-heavy`: Runs full benchmarks and academic datasets.
* `--run-integration`: Starts/Stops the LightRAG server and wipes storage for clean tests.

### 3. Pytest Wrapper (`tests/test_rag_quality.py`)

Wraps `eval_rag_quality.py` to allow execution within the standard test suite with automatic indexing of sample documents.

## Next Phase: Graph Reranking

Implement performance-focused graph reranking to improve precision and reduce noise in retrieved context.
