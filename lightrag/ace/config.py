import os
from dataclasses import dataclass, field


@dataclass
class ACEConfig:
    """Configuration for the ACE (Agentic Context Evolution) Framework."""

    # Base directory for ACE data
    base_dir: str = field(default_factory=lambda: os.path.join(os.getcwd(), "ace_data"))

    # Paths for persistence
    playbook_path: str = "context_playbook.json"

    # Model Configurations
    generator_model: str = "qwen2.5-coder:1.5b"
    reflector_model: str = "qwen2.5-coder:1.5b"
    curator_model: str = "qwen2.5-coder:1.5b"

    # Evolution Settings
    max_history_items: int = 50
    enable_auto_curation: bool = True

    def __post_init__(self):
        self.ensure_base_dir()

    def get_playbook_full_path(self) -> str:
        return os.path.join(self.base_dir, self.playbook_path)

    def ensure_base_dir(self):
        os.makedirs(self.base_dir, exist_ok=True)
