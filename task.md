# Task: Phase 5 ACE Curator (lightrag-56n)

## Status: IN_PROGRESS

### Objective

Implement the full ACE Curator logic including automated graph pruning, entity deduplication, and incorporating Reflector insights into the Context Playbook.

### Tasks

- [ ] Define the prompt for Curator reflection/action.
- [ ] Implement `ACECurator.curate` logic to update the Playbook with semantic versioning/lessons.
- [ ] Implement `ACECurator.apply_repairs` for automated entity merging (deduplication).
- [ ] Integrate Curator into the Core ACE Loop in `lightrag/core.py`.
- [ ] Add unit tests for Curator (Repair/Deduplication).
- [ ] Verify integrated loop with a small document (e.g., `test_ephemeral.txt`).

### Steps

1. [ ] Analyze `ACEReflector` output format to ensure `ACECurator` can parse repairs.
2. [ ] Update `lightrag/ace/curator.py` with expanded logic.
3. [ ] Update `lightrag/ace/reflector.py` if needed to better suggest repairs.
4. [ ] Implement a test case for entity deduplication (merging "Einstein" and "Albert Einstein").
5. [ ] Run integration test.
