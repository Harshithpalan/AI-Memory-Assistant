import re
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import Memory

class ReminderEngine:
    async def capture_reminders(self, db: AsyncSession) -> List[Dict[str, str]]:
        """Scan recent memories for implicit reminders or deadlines."""
        # Focus on last 24h
        import datetime
        since = datetime.datetime.utcnow() - datetime.timedelta(days=1)
        result = await db.execute(select(Memory).where(Memory.created_at >= since))
        memories = result.scalars().all()
        
        reminders = []
        keywords = ["exam", "deadline", "prepare", "meeting", "submit", "reminder", "appointment"]
        
        for m in memories:
            text = m.content.lower()
            for kw in keywords:
                if kw in text:
                    # Find the sentence containing the keyword
                    sentences = re.split(r'[.!?]', m.content)
                    for s in sentences:
                        if kw in s.lower():
                            reminders.append({
                                "suggestion": s.strip(),
                                "source_file": m.filename,
                                "context": kw
                            })
                            break # One per memory for now
                    break
        return reminders

reminder_engine = ReminderEngine()
