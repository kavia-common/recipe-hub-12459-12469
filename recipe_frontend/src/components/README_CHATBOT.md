# Chatbot Widget

This widget provides a floating chat assistant across the app.

- Component: src/components/ChatbotWidget.js
- Styles: src/components/chatbot.css
- API helper: src/api/chatbot.js (POST /chatbot)

It reads API base URL from REACT_APP_API_BASE_URL (see .env.example). The backend must expose POST /chatbot as described in the backend OpenAPI and permit CORS from the frontend origin.

Keyboard:
- Ctrl/Cmd + Enter to send
- Enter inserts a newline
