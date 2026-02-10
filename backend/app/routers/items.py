from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.item_repository import ItemRepository
from app.schemas.item import ItemCreate, ItemResponse, ItemUpdate

router = APIRouter()


@router.get("/", response_model=list[ItemResponse])
async def list_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    repo = ItemRepository(db)
    return repo.get_all(skip=skip, limit=limit)


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    repo = ItemRepository(db)
    item = repo.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemResponse, status_code=201)
async def create_item(
    data: ItemCreate,
    db: Session = Depends(get_db),
):
    repo = ItemRepository(db)
    return repo.create(data)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: int,
    data: ItemUpdate,
    db: Session = Depends(get_db),
):
    repo = ItemRepository(db)
    item = repo.update(item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    repo = ItemRepository(db)
    if not repo.delete(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
