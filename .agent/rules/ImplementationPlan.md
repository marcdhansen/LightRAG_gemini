# Evaluation Framework Setup (RAGAS + Langfuse)

## Goal

Establish a robust evaluation pipeline to measure RAG quality (Context Recall, Faithfulness, Answer Relevance) using RAGAS, and visualize traces/metrics in Langfuse.

## Current State & Analysis

* **Script**: `lightrag/evaluation/eval_rag_quality.py` exists and performs RAGAS evaluation (v0.4.3 compatible).
* **Infrastructure**: `../langfuse/docker-compose.yml` exists for local Langfuse deployment.
* **Missing Link**: The evaluation script currently prints results to console/JSON but does not send traces or scores to Langfuse.

## Proposed Changes

### 1. Langfuse Infrastructure

* **Action**: Ensure Langfuse is running locally via Docker.
* **Config**: Verify `localhost:3000` access and generate API keys.

### 2. Code Integration (`lightrag/evaluation/eval_rag_quality.py`)

* **[NEW] Environment Variables**: Add `LANGFUSE_SECRET_KEY`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_HOST` to `.env`.
* **[MODIFY] Ragas Callbacks**:
  * Initialize `langfuse.callback.LangfuseCallbackHandler`.
  * Pass handler to Ragas `evaluate()` function.

### 3. Documentation

* **[UPDATE] `README_EVALUASTION_RAGAS.md`**: Add Langfuse setup instructions.

## Verification Plan

1. **Start Langfuse**: `cd ../langfuse && docker-compose up -d`.
2. **Configure**: Login to Langfuse, create project, get keys.
3. **Run Eval**: `uv run lightrag/evaluation/eval_rag_quality.py` (using sample dataset).
4. **Verify**: Check Langfuse UI for new traces and scores.
