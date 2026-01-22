# 🗺️ Project Roadmap & Navigation: LightRAG

This is the central directory for all project-specific planning, tracking, and instruction documents.

## 🎯 Current Objective
- **Task**: ACE Framework Integration
- **Status**: [✓] COMPLETED
- **Result**: Fully integrated GRC loop into `LightRAG` core and exposed via FastAPI (`/ace/query`).
- **Next Step**: [Manual verification with large datasets / refinement of curation strategies]


## 🚀 Active Work

- **[ACE Prototype Documentation](docs/ACE_PROTOTYPE.md)**: **[NEW]** Details of the implemented Agentic Context Evolution prototype.
- **[Implementation Plan](ImplementationPlan.md)**: Detailed technical breakdown of current and upcoming phases.
- **[Task Tracker (Beads)](https://github.com/steveyegge/beads)**: Absolute source of truth for Project Tasks (`bd list`).

## 🧠 Project Context & Evolution
- **[Self-Evolution Tracker](SELF_EVOLUTION.md)**: Project-specific performance logs, model findings, and ACE roadmap.
- **[Model Profiling Results](MODEL_PROFILING_RESULTS.md)**: Benchmarks for the specific models used in this repo.

## 📖 Instructions & Guides (Local)
- **[Project Guide (AGENTS.md)](AGENTS.md)**: LightRAG quick start and project paths.
- **[Detailed Instructions](AGENT_INSTRUCTIONS.md)**: Detailed operation guides (Ollama, API Examples, RAGAS).
- **[Developer Learnings](docs/DEVELOPER_LEARNINGS.md)**: Technical findings, fixes, and troubleshooting notes (Ragas, Ollama, Buffering).

## 🌐 Global Resources
- **[Global Agent Guidelines](../GLOBAL_AGENT_GUIDELINES.md)**: **MANDATORY** PFC, LTP, and 3-Tier Strategy.
- **[Global Self-Evolution](../SELF_EVOLUTION_GLOBAL.md)**: Universal agent behavioral patterns.
- **[Beads Field Manual](../BEADS_FIELD_MANUAL.md)**: Global guide for using the Beads system.

## 📈 Recent Accomplishments
- ✓ **ACE Minimal Prototype** (2026-01-22): Implemented and verified the Core Loop (Generate-Reflect-Curate).
- ✓ **Ragas Compatibility Fix** (2026-01-22): Resolved `TypeError` in Ragas 0.4.3 using Legacy wrappers.
- ✓ **Baseline RAGAS Evaluation** (2026-01-22): Preliminary pass successful.
- ✓ **Memgraph Integration**: ~66% reduction in graph traversal latency.
- ✓ **Split LLM Configuration**: `llama3.2:3b` for extraction, `qwen2.5-coder:1.5b` for queries.

---
*Last Updated: 2026-01-22*
