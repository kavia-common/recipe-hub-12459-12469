# Backend integration guidance for better UX

To align with the frontend UX improvements (toasts, validation), the backend (FastAPI) should:

- Return consistent error shapes:
  - For domain/permission errors: status codes 400/401/403/404 with JSON: { "message": "<human readable>" }.
  - For validation errors (Pydantic): allow FastAPI’s default 422 detail array; the frontend will map `detail[].msg` to specific fields.

- Tighten recipes validation:
  - `title`: required, trimmed, 1..200 chars, disallow only-whitespace. Consider a regex to block repeated punctuation.
  - `image_url`: optional string; if provided, must be a valid HTTP(S) URL.
  - `ingredients`, `instructions`, `description`: optional strings; enforce reasonable max length (e.g., 10_000).

Example FastAPI Pydantic models:

```python
from pydantic import BaseModel, Field, HttpUrl, field_validator

class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Recipe title")
    description: str | None = Field(None, max_length=10000)
    ingredients: str | None = Field(None, max_length=10000, description="Newline separated")
    instructions: str | None = Field(None, max_length=10000)
    image_url: HttpUrl | None = Field(None, description="HTTP(S) image URL")

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Title cannot be empty or whitespace.")
        return v.strip()

class MessageResponse(BaseModel):
    message: str = Field(..., description="Human readable message")
```

For route handlers, prefer informative messages:

```python
from fastapi import HTTPException

if not_auth:
    raise HTTPException(status_code=401, detail="Not authenticated")
if not_owner:
    raise HTTPException(status_code=403, detail="You can only modify your own recipes")
if not_found:
    raise HTTPException(status_code=404, detail="Recipe not found")
```

Favorites:
- POST /recipes/{id}/favorite: respond 201 with FavoriteRead on first favorite, 200 with { "message": "Already favorited" } if idempotent.
- DELETE /recipes/{id}/favorite: respond 200 with { "message": "Unfavorited" } whether or not it existed.

This ensures the frontend can surface clear feedback messages to users.
