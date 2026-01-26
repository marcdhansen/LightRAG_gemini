# manual testing:
uv run pytest tests/test_api_v2_manual.py -s --run-manual --run-integration

# offline tests:
uv run pytest -m offline
