# Task: Skill Enhancement - Flight Director (lightrag-ijs)

## Status: IN_PROGRESS

### Objective

Enhance the Flight Director skill to automate SMP validation, specifically for Return To Base (RTB) procedures including temporary file cleanup and documentation linting.

### Tasks

- [x] Analyze current `check_flight_readiness.py` logic.
- [x] Implement detection for temporary `rag_storage_*` directories.
- [x] Implement detection for common orphan files (`test_output.txt`, `debug_*.py`).
- [x] Integrate `markdownlint` check for planning documents.
- [x] Add a "Dry Run" or "Auto-fix" mode if possible, or clear instructions for the agent.
- [x] Verify the script by running it in the current repo.

### Steps

1. [ ] Update `ImplementationPlan.md` with the skill enhancement phase.
2. [ ] Modify `~/.gemini/antigravity/skills/FlightDirector/scripts/check_flight_readiness.py`.
3. [ ] Test `--pfc` and `--rtb` in the current environment.
4. [ ] Perform a clean RTB using the new script.
