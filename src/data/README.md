# Data Layer

This folder contains the application domain and persistence helpers used by the Pinia stores.

## Files

- `tasks.js`
  - Defines task, goal, and AI suggestion entities.
  - Provides load/save helpers for local storage.

- `persistence.js`
  - Provides a consistent localStorage wrapper.
  - Handles JSON serialization and error failures gracefully.

## Usage

- Store code should import entities and persistence helpers from `@/data/*`.
- Keep business logic here and let the store expose actions to UI components.
- Use this folder to add new domain models or shared utility functions for task/goal state.
