# recipe-hub-12459-12469

This workspace contains the frontend (React) for Recipe Hub. The frontend reads its API base URL from environment variables:

- REACT_APP_API_BASE_URL (required): The backend base URL (no trailing slash).
- REACT_APP_ROUTER_BASENAME (optional): Router basename (defaults to "/").

See recipe_frontend/.env.example for configuration.