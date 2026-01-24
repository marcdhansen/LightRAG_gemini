#!/bin/bash
uv run pytest -m heavy --run-integration "$@"
