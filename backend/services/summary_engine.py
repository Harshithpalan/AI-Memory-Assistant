from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import Memory
from services.ai_engine import ai_engine
import datetime
from typing import List

class SummaryEngine:
    async def generate_period_summary(self, db: AsyncSession, days: int = 1) -> str:
        """Generate a summary of memories from the last N days."""
        since = datetime.datetime.utcnow() - datetime.timedelta(days=days)
        result = await db.execute(select(Memory).where(Memory.created_at >= since))
        memories = result.scalars().all()
        
        if not memories:
            return f"No new memories recorded in the last {days} days."
            
        context = "\n".join([f"- {m.filename}: {m.content[:200]}..." for m in memories])
        
        prompt = f"Summarize the following activities and knowledge stored in my second brain from the last {days} days:\n{context}"
        # Reuse ai_engine for summary generation
        return ai_engine.generate_answer(prompt, [])

    async def generate_topic_summary(self, db: AsyncSession, topic: str) -> str:
        """Generate a summary of a specific topic."""
        result = await db.execute(select(Memory).where(Memory.topic == topic))
        memories = result.scalars().all()
        
        if not memories:
            return f"No memories found for topic: {topic}"
            
        context = "\n".join([f"- {m.content[:300]}..." for m in memories])
        prompt = f"Provide a comprehensive summary of everything I've learned or recorded about '{topic}':\n{context}"
        return ai_engine.generate_answer(prompt, [])

summary_engine = SummaryEngine()
