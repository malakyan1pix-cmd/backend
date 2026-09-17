# Productivity API

A simple REST API built with Node.js using the built-in `http` module.

The API provides three independent resources:

* Notes
* Tasks
* Contacts

All data is stored in memory and will be reset when the server is restarted.

## Requirements

* Node.js
* npm

## Installation

Install the dependencies:

```bash
npm install
```

## Run the server

```bash
node server.js
```

The server runs on:

```text
http://localhost:4001
```

## API Endpoints

### Notes

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | `/notes`     | Get all notes    |
| POST   | `/notes`     | Create a note    |
| GET    | `/notes/:id` | Get a note by ID |
| PUT    | `/notes/:id` | Update a note    |
| DELETE | `/notes/:id` | Delete a note    |

A note requires `title` and `content`.

### Tasks

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | `/tasks`     | Get all tasks    |
| POST   | `/tasks`     | Create a task    |
| GET    | `/tasks/:id` | Get a task by ID |
| PUT    | `/tasks/:id` | Update a task    |
| DELETE | `/tasks/:id` | Delete a task    |

A task requires `title`. The `completed` field is optional and defaults to `false`.

### Contacts

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | `/contacts`     | Get all contacts    |
| POST   | `/contacts`     | Create a contact    |
| GET    | `/contacts/:id` | Get a contact by ID |
| PUT    | `/contacts/:id` | Update a contact    |
| DELETE | `/contacts/:id` | Delete a contact    |

A contact requires `name` and `email`. The `phone` field is optional and defaults to `null`.

## HTTP Status Codes

* `200` — successful GET, PUT, or DELETE
* `201` — resource created successfully
* `400` — invalid JSON or missing required fields
* `404` — resource or route not found
* `405` — method not allowed
* `500` — internal server error
