# Self-Evolution Tracker

This document tracks ideas for continuous improvement of both the AI agent capabilities and the LightRAG system. Ideas are prioritized and regularly reassessed.

## Active Improvement Areas

### Agent Workflow Improvements
| Idea | Priority | Status | Notes |
|------|----------|--------|-------|
| Update memory.md with learnings after each session | p0 | `lightrag-xxx` | Capture patterns, preferences, discoveries |
| Proactively suggest improvements after tasks | p0 | Active | Built into workflow |

### System Improvements
| Idea | Priority | Status | Notes |
|------|----------|--------|-------|
| ACE framework integration | p1 | Planned | Minimal prototype first |
| RAGAS evaluation baseline | p1 | Planned | Track quality over time |

---

## Learning Resources

### ACE Framework (Agentic Context Engineering)
- Core concept: Evolve context through Generator → Reflector → Curator cycle
- Key insight: Incremental delta updates prevent context collapse
- Application: Use for improving agent memory and playbook

### Beads Best Practices
- Always add descriptions to issues
- Close with detailed reasons for future reference
- Keep planning docs and issues in sync

### Model Selection Criteria
When evaluating LLM models, consider these tradeoffs:

| Criterion | Question | Priority |
|-----------|----------|----------|
| **Speed** | What are the fastest models? | High for iteration |
| **Quality** | Does output meet requirements? | High for production |
| **No-code-change** | Can swap via .env only? | High for flexibility |
| **Context window** | Fits our document sizes? | Required |
| **Cost** | Token/API costs acceptable? | Varies |

**Current findings (2026-01-19):**
- `llama3.2:3b`: Best balance (12.65 t/s, good entity extraction)
- `qwen2.5-coder:1.5b`: Fastest (35 t/s) but poor quality for RAG tasks
- `mistral-nemo`: Good quality but slow (3.14 t/s)
- Embedding: `nomic-embed-text:v1.5` (only dedicated option)

---

## Improvement Backlog

### High Priority (p0/p1)
- [ ] Establish feedback loop for capturing user preferences
- [ ] Create templates for common task types
- [ ] Define metrics for measuring improvement

### Medium Priority (p2)
- [ ] Experiment with different prompt structures
- [ ] Analyze which beads patterns work best
- [ ] Document anti-patterns to avoid

### Ideas to Explore
- How can the Reflector component critique completed work?
- What metadata should be captured per interaction?
- How to measure "improvement" quantitatively?

---

## Review Log

| Date | Reviewer | Changes Made |
|------|----------|--------------|
| 2026-01-19 | Initial | Created document |

---

## Principles

1. **Proactive improvement**: Don't wait for problems; actively seek better approaches
2. **Learn from feedback**: Capture what works, discard what doesn't
3. **Incremental evolution**: Small, focused improvements compound over time
4. **Sync with beads**: Every improvement idea should become a trackable issue
5. **Reassess regularly**: Priorities shift; re-evaluate periodically
