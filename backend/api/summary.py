from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db, Memory
from services.summary_engine import summary_engine
from services.reminder_engine import reminder_engine
from sqlalchemy import select

router = APIRouter()

@router.get("/summary/daily")
async def get_daily_summary(db: AsyncSession = Depends(get_db)):
    return {"summary": await summary_engine.generate_period_summary(db, 1)}

@router.get("/summary/weekly")
async def get_weekly_summary(db: AsyncSession = Depends(get_db)):
    return {"summary": await summary_engine.generate_period_summary(db, 7)}

@router.get("/reminders")
async def get_reminders(db: AsyncSession = Depends(get_db)):
    return {"reminders": await reminder_engine.capture_reminders(db)}

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Memory))
    memories = result.scalars().all()
    
    topics = {}
    for m in memories:
        topics[m.topic] = topics.get(m.topic, 0) + 1
        
    return {
        "total_memories": len(memories),
        "topics": topics,
        "recent_uploads": [
            {"id": m.id, "filename": m.filename, "type": m.file_type, "topic": m.topic, "date": m.created_at}
            for m in memories[-5:]
        ]
    }

@router.get("/timeline")
async def get_timeline(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Memory).order_by(Memory.created_at.desc()))
    memories = result.scalars().all()
    return [
        {"id": m.id, "filename": m.filename, "type": m.file_type, "topic": m.topic, "date": m.created_at}
        for m in memories
    ]
