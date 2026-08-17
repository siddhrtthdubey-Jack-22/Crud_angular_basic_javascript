# Crud_angular_basic_javascript

Javascript AngularJS basic CRUD for **AI assistant personas**, plus simple JavaScript topics used in the app.

## What you can do

- **Create** a new AI assistant persona
- **Read** persona details from the list
- **Update** name, role, tone, description, and system prompt
- **Delete** a persona
- Search personas by name, role, or tone
- Data is saved in the browser with `localStorage`

## Persona fields

| Field | Meaning |
| --- | --- |
| Name | Display name of the assistant |
| Role | What the assistant is for |
| Tone | Friendly, Professional, Concise, Playful, Formal |
| Description | Short summary |
| System prompt | Instructions that define the personality |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx --yes serve .
```

Then visit the URL shown in the terminal (usually `http://localhost:3000`).

## JavaScript topics in this project

- AngularJS module and controller
- Two-way binding with `ng-model`
- Arrays (`push`, `filter`, `findIndex`)
- Objects and `angular.copy`
- `JSON.parse` / `JSON.stringify`
- Browser `localStorage`
