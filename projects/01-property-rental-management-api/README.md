# Property Rental Management API

An intermediate-level NestJS learning project for building an API to manage
rental properties, apartments, and tenants.

> **Project status:** This repository currently contains the NestJS starter
> application. The endpoints and business rules below describe the project
> scope; they may not all be implemented yet.

## Project goals

Build a REST API that supports property management and helps clients find
properties that match their needs. The planned domain resources are:

- **Property** — rental listings and their availability
- **Apartment** — apartment units associated with rental properties
- **Tenant** — people renting apartments

## Planned property endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/properties` | Create a property |
| `GET` | `/properties` | List properties |
| `GET` | `/properties/:id` | Get a property by ID |
| `PATCH` | `/properties/:id` | Update a property |
| `DELETE` | `/properties/:id` | Delete a property |

### Property listing and business logic

The property API is intended to support:

- Filtering by location, price range, and property type
- Searching properties
- Marking a property as available or unavailable
- Calculating monthly rental cost

Filters and search criteria are supplied as query parameters. For example:

```text
GET /properties?location=Portland&minPrice=1000&maxPrice=2500&type=apartment
```

The exact property fields, filter names, and rental-cost rules are part of the
implementation and should be defined as the API evolves.

## Learning objectives

This project provides practice with NestJS concepts including:

- Controllers, services, and modules
- Data Transfer Objects (DTOs)
- Request validation with `ValidationPipe`
- Query parameters and route parameters
- HTTP exceptions and API error handling

## Getting started

### Requirements

- Node.js
- pnpm

### Install and run

```bash
pnpm install
pnpm start:dev
```

The application listens on `http://localhost:3000` by default. Set the
`PORT` environment variable to use a different port.

## Useful commands

| Command | Description |
| --- | --- |
| `pnpm start:dev` | Start the app in watch mode |
| `pnpm start` | Start the app |
| `pnpm build` | Compile the application |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm lint` | Lint source and test files |
