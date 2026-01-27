# Current Task: Implement Documentation Validator (lightrag-rxg)

## Goal

Create a tool to automatically verify that all registered subsystems in `ARCHITECTURE.md` have corresponding deep-dive files and correct internal links, ensuring documentation integrity.

## Prerequisites

- [ ] Read `ARCHITECTURE.md` to understand the structure of "registered subsystems".
- [ ] Identify where "deep-dive" files are expected to live.

## Implementation Steps

- [x] **Analysis**: Identify the markdown pattern for subsystems in `ARCHITECTURE.md`.
- [x] **Scripting**: Create `scripts/validate_docs.py` (or similar).
- [x] **Validation Logic**:
  - Parse `ARCHITECTURE.md`.
  - Extract links/references to subsystems.
  - Check if target file exists.
  - Check if internal relative links are valid (no 404s).
- [x] **Integration**: Add to `bd` or a `Makefile` if exists, or just document usage.
- [x] **Verify**: Run on current `ARCHITECTURE.md` and report issues.

## Status

- [x] Task Initialized
- [x] Validator Implemented & Verified
