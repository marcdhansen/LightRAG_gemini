import logging
from typing import List

from lightrag.ace.playbook import ContextPlaybook

logger = logging.getLogger(__name__)


class ACECurator:
    """
    ACE Curator Component.
    Updates the Playbook based on insights from the Reflector.
    """

    def __init__(self, playbook: ContextPlaybook):
        self.playbook = playbook

    async def curate(self, insights: List[str]):
        """
        Incorporates insights into the playbook.
        """
        if not insights:
            return

        logger.info(f"ACE Curator: Processing {len(insights)} insights.")

        for insight in insights:
            # Prototype logic: directly add as a lesson
            # Future: Contextual deduplication, strategy refinement, etc.
            self.playbook.add_lesson(insight)
            logger.info(f"ACE Curator: Added lesson: {insight}")
