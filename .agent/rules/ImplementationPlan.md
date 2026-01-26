# Project Structure Improvement Plan

## Goal

Restructure the `antigravity_lightrag` workspace to enable "progressive disclosure" of information, distinguishing between Global, Workspace, and Project contexts.

## Current State & Analysis

* **Workspace Root** (`antigravity_lightrag/`): Not a git repo. Contains mixed-level content.
  * `testing.md` (Duplicate of repo file).
  * `hints.md`, `SECURITY.md` (Need classification).
  * `docs/`, `references/`, `langfuse/` (Valid workspace resources).
* **Project Root** (`LightRAG/`): Active Git repo.

## Proposed Hierarchy

### 1. Global Context (`~/.gemini`)

* Standard agent memory and global rules.

### 2. Workspace Context (`antigravity_lightrag/`)

* **Purpose**: The "Workbench" or "Laboratory". Contains the overarching experiment context, reference materials, and local tooling that surrounds the main project.
* **New Files**:
  * `[NEW] WORKSPACE_README.md`: The entry point. Explains that this folder contains the LightRAG project plus research implementation details (Memgraph, Langfuse setup) and papers.
* **Cleanup**:
  * `[DELETE] testing.md` (Duplicate).
  * `[MOVE] hints.md` -> `LightRAG/docs/local_setup_hints.md` (if specific to running code) OR keep as `workspace_notes.md`.
  * `[MOVE] SECURITY.md` -> `LightRAG/SECURITY.md` (security usually belongs to the codebase).

### 3. Project Context (`LightRAG/`)

* **Purpose**: The reusable software artifact.
* **Changes**:
  * Receive moved files (`SECURITY.md`).
  * Ensure `README.md` is self-contained for the logic.

### 4. Global Links & Skills

* **Symlink**: Create a symlink `LightRAG/global_docs` -> `~/.gemini/` to allow easy access to global rules/memory from the project root.
* **Skills**: Use the `Librarian` skill to verify and index the new structure.

## Verification Plan

1. **Structure Check**: `ls -F ..` and `ls -F .` to verify clean separation.
2. **Symlink Check**: Verify `readlink LightRAG/global_docs` works.
3. **Git Status**: `git status` in `LightRAG` to ensure moved files are tracked (symlinks usually should be ignored or handled carefully if personal). *Correction*: Accessing `~/.gemini` involves absolute paths that might not be portable. Instead of a symlink in git, we might just provide a script or a local (non-committed) symlink. User asked for it, we will create it but add to `.gitignore`.
4. **User Review**: Ask user to verify `WORKSPACE_README.md`.
