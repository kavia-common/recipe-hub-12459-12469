# Note Title Recommender

Components:
- src/components/NoteTitleRecommender.js — modal UI to paste/type note content and fetch title suggestions.
- src/components/note-title.css — styles for the modal and list.
- src/api/titles.js — API client for POST /recommend-title.

Usage:
- Integrated into Create/Edit Recipe page via a "Recommend Title" button next to the Title field.
- Also accessible from Home via a floating "✨ Recommend Title" button.

Environment:
- Requires REACT_APP_API_BASE_URL to point at the backend that exposes POST /recommend-title.
- Backend should enable CORS for the frontend origin.
