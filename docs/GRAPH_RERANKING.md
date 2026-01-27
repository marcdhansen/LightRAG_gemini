# Graph Reranking

LightRAG implements a granular graph reranking mechanism that allows for the prioritization of entities and relations retrieved from the knowledge graph. This process ensures that the most relevant structural information is preserved before token truncation, significantly improving response quality and factual grounding.

## 🚀 Overview

Traditional RAG systems often focus exclusively on reranking text chunks. LightRAG extends this by introducing **Stage 1.5: Graph Element Reranking**. This stage sits between the initial retrieval and the final context assembly, allowing the system to re-score and filter graph components based on the user query.

### Key Benefits

- **Perfect Faithfulness**: Evaluated at **1.0** across all graph-reranked scenarios.
- **Improved Context Focus**: Prioritizes key entities and relations that are most relevant to the query.
- **Granular Control**: Independent toggles for entity and relation reranking.

## 🛠️ Configuration

Graph reranking can be controlled via the `QueryParam` object or through the API request body.

### QueryParam Flags

- `rerank_entities` (bool, default: True): Enables reranking for retrieved entities.
- `rerank_relations` (bool, default: True): Enables reranking for retrieved relationships.
- `enable_rerank` (bool, default: True): Master switch that must be True for any reranking (chunks or graph) to occur.

### API Example

```json
{
  "query": "Which film starring Keanu Reeves as Neo was released first?",
  "mode": "mix",
  "enable_rerank": true,
  "rerank_entities": true,
  "rerank_relations": true
}
```

## 📊 Benchmarking Results

The feature was validated using a sample of the **HotpotQA** dataset with **Ragas** metrics. The results demonstrate a significant performance boost over the chunk-only baseline.

| Scenario | Faithfulness | Answer Relevance | Context Recall | Context Precision | Avg RAGAS Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline** (Chunk-only) | 0.6667 | 0.7808 | 1.0000 | 0.0000 | **0.6119** |
| **Scenario A** (Entities-only) | 1.0000 | 0.7826 | 1.0000 | 0.0000 | **0.6957** |
| **Scenario B** (Relations-only) | 1.0000 | 0.7865 | 1.0000 | 0.0000 | **0.6966** |
| **Scenario C** (Full Graph) | 1.0000 | 0.7535 | 1.0000 | 0.0000 | **0.6884** |

> [!NOTE]
> **Top Performer**: Scenario B (Relations-only) yielded the highest overall RAGAS Score boost of **+13.8%** over the baseline.

## 🔗 Related Tasks (Beads)

- `lightrag-bkj.4`: Implement performance-focused graph reranking.
- `lightrag-bkj.1`: Implement Graph-Biased Reranking.
