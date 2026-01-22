# LightRAG Enhancement Implementation Plan

## Overview
This plan transforms the TODO.md items into actionable phases, prioritized for a working system first with early evaluation integration.

## Project Priorities

| Priority | Description |
| :--- | :--- |
| **p0** | Highest priority - must be done first |
| **p1** | Next-highest priority - after p0 complete |
| **p2** | Lower priority - nice to have |

## Phase 0a: Update AGENT_INSTRUCTIONS.md (p0) ✅ COMPLETE
> [!NOTE]
> Completed: Rewrote with Python examples for LightRAG project.

**Beads**: `lightrag-n6b` (closed)

## Phase 0b: Model Profiling (p0) ✅ COMPLETE
> [!IMPORTANT]
> Profile all downloaded Ollama models to ensure the most performant ones are configured in `.env`.

**Beads**: `lightrag-1p3` (closed)

### Goals
- [x] List all available Ollama models
- [x] Run performance benchmarks on each model
- [x] Update `.env` with optimal model selections (`granite4:3b`)

### Current Configuration
- **LLM**: `granite4:3b` (Selected for performance/quality balance on current hardware)
- **Embedding**: `nomic-embed-text:v1.5` (dimension: 768)

## Phase 1: Core System Stability (p0)
> [!IMPORTANT]
> A working system that processes the BCBC PDF document, creates a graph, and handles queries properly is the top priority.

### Goals
1.  Verify end-to-end document processing with `final_report_BCBC.pdf`
2.  Confirm graph visualization works
3.  Validate query responses are accurate

**Beads**: `lightrag-696`, `lightrag-aa6`, `lightrag-rzj`

### Current Status
-   Timeout configuration already updated to 9000s (2.5 hours) for PDF processing
-   LLM model set to `qwen2.5-coder:1.5b` for local performance
-   Server starts via: `cd LightRAG && uv sync --extra api && uv run lightrag-server`

## Phase 1b: Database & Model Optimization (p0) ✅ COMPLETE
> [!IMPORTANT]
> Switched from NetworkX to Memgraph and implemented separate Query LLM support.

- [x] Integrate Memgraph via Docker
- [x] Configure LightRAG to use `MemgraphStorage`
- [x] Implement `QUERY_LLM_MODEL` support for separate query/indexing models
- [x] **Result:** Achieved ~3.25x total speedup (from 215.72s to 66.41s)


## Phase 2: Evaluation Framework (Early Integration)
> [!NOTE]
> RAGAS and Langfuse are already integrated in LightRAG. This phase focuses on activating and validating them.

### RAGAS Integration
**Already Available:**
- `lightrag/evaluation/eval_rag_quality.py` - Main evaluation script
- `lightrag/evaluation/sample_dataset.json` - Sample test questions
- Install with: `pip install -e ".[evaluation]"`

**New Work**
- [x] **Task 2.1: Create BCBC-specific test dataset** ✅ COMPLETE
- [x] **Benchmark Ragas Judge Models**
    - [x] Create benchmark script (`tests/test_ragas_model_speed.py`)
    - [x] Run benchmark on all local models
    - [x] Select best performing model (Speed + Validity) -> `qwen2.5-coder:0.5b`
    - [x] Update `.env` with best judge model
- [x] **Run Baseline Evaluation**
    - [x] Resolve Embedding Compatibility: Switched to native `OllamaEmbeddings` to fix `BadRequestError`/`Timeout`.
    - [x] Run `python lightrag/evaluation/eval_rag_quality.py` (Completed: Verified with qwen2.5-coder:1.5b)

- [x] **Task 2.3: Enable Langfuse tracing (LightRAG-jbz)** ✅ COMPLETE
    - [x] Deploy self-hosted Langfuse via Docker Compose in `./langfuse`
    - [x] Pre-configure project `bcbc_processing` with keys
    - [x] Update `lightrag/llm/openai.py` to fix environment loading order
    - [x] Instrument `lightrag.py` with `@observe()` decorators for detailed tracing

## Phase 3: ACE Framework Integration (Core & API) ✅ COMPLETE
> [!NOTE]
> Successfully integrated the Agentic Context Evolution (ACE) framework into the core pipeline and server.

**Architecture Overview**
Trajectory -> Insights -> Delta Updates
Query -> Generator -> Reflector -> Curator -> Context Playbook

**Completed Work**
- [x] Defined Architecture (`docs/ACE_PROTOTYPE.md`)
- [x] Implemented Core Components (`lightrag/ace/*.py`)
- [x] Integrated into `LightRAG` class (GRC loop)
- [x] Exposed via FastAPI `POST /ace/query`
- [x] Verified with full test suite (`tests/test_ace_api.py`)

**Beads**: `lightrag-hnh`

### ACE File Structure
```
lightrag/
├── ace/
│   ├── __init__.py
│   ├── generator.py      # Query execution with playbook
│   ├── reflector.py      # Trajectory critique and insights
│   ├── curator.py        # Playbook delta updates
│   ├── playbook.py       # Context playbook storage/retrieval
│   └── config.py         # ACE configuration
```

## Phase 5: Browser Compatibility (Safari) ✅ COMPLETE
Investigate Safari rendering regression (`lightrag-nma`)
- Apply `-webkit-backdrop-filter` prefixes in `SiteHeader.tsx`, `App.tsx`, `DocumentManager.tsx`
- Fix flexbox/absolute height resolution issues in `App.tsx` and `DocumentManager.tsx`
- Update `h-screen` to `h-dvh` for better modern browser support
- Rebuild and verify via user feedback

## Phase 4: Enhancements
- MCP integration (client + server) (`lightrag-1fw`)
- Citation links in query results (`lightrag-9qp`)
- Ongoing self-improvement suggestions (`lightrag-n62` -- Keyword Search)
- Ongoing memory updates

### MCP Server Mode
- Expose LightRAG as an MCP server
- Other agents can query the knowledge graph

### MCP Client Mode
- LightRAG consumes external MCP resources
- Enhance retrieval with external data sources

### Keyword Search (p1)
- Add keyword/full-text search alongside vector search
- Hybrid retrieval: vector + keyword

### Citation Links (p1)
- Extend query responses with citation links to original sources
- Use `source_id` tracking already in LightRAG

### Performance Optimization (p2)
- [x] **Key-Value Extraction Format**: Implemented robust KV parsing for small LLMs (~2x speedup)
- Profiling to identify slowdowns
- Parallel embedding processing
- Consider Memgraph for vector-enabled graph storage

## Decisions Made
- **Phase ordering**: Confirmed (profiling → stability → evaluation → ACE → enhancements)
- ✓ **ACE Core Integration** (2026-01-22): Fully integrated GRC loop into `LightRAG` core and exposed via FastAPI (`/ace/query`).
- ✓ **ACE Minimal Prototype** (2026-01-22): Implemented and verified basic components.
- **MCP use cases**: TBD - will suggest when more context gathered
