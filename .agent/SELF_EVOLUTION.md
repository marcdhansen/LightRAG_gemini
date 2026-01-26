# Self-Evolution & QA Protocols

This document matches the user's "Improvement Backlog" and "Self-Evolution" strategy.

## QA Protocols

### Pre-Commit Code Quality

- [Rule] **Always** run `pre-commit run --all-files` before pushing to ensure linting and formatting are correct.
- [Rule] Check `ruff` output and fix manual errors (like `E741` ambiguous variable names) immediately.

### CI/CD Test Isolation

- [Rule] When adding new test directories (especially those requiring external dependencies like `playwright` or `docker`), **verify** they are excluded from the `offline` test suite.
  - Check `.github/workflows/tests.yml`: The `pytest -m offline` command should explicitly ignore online folders if the marker isn't sufficient (e.g., `--ignore=tests/ui`).
  - Check `pyproject.toml` or `pytest.ini` for marker configurations.

## Improvement Backlog

- [ ] Automate `pre-commit` in a local hook (if not already strictly enforced).
- [ ] Create a `verify_ci_config` script/skill to check for new directories not covered by exclusions.
