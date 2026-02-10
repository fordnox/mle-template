import logging

from arq import cron

from app.core.database import SessionLocal
from app.models.item import Item
from app.tasks import redis_settings

logger = logging.getLogger(__name__)


async def update_item_prices(ctx: dict) -> int:
    """Example task: apply a 10% discount to all items with quantity > 100."""
    db = SessionLocal()
    try:
        items = db.query(Item).filter(Item.quantity > 100).all()
        for item in items:
            item.price = round(item.price * 0.9, 2)
        db.commit()
        logger.info("Updated prices for %d items", len(items))
        return len(items)
    finally:
        db.close()


class WorkerSettings:
    functions = [update_item_prices]
    cron_jobs = [
        cron(update_item_prices, hour=0, minute=0),  # midnight daily
    ]
    redis_settings = redis_settings
