# Publications Management System — Frontend

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.x-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-Styles-CC6699?style=for-the-badge&logo=sass&logoColor=white)

> Angular client application for a full-stack Publications Management System built for a publishing house. Provides a rich UI for managing books, authors, publishers, orders and inventory.

🔗 **Backend Repository:** [PublicationsManagementSystemBackend](https://github.com/angeasla/publications-management-system-backend)

---

## Features

- **Dashboard** — Overview of key metrics (books in stock, pending orders, top authors)
- **Books & Authors** — Browse, search, create and edit books and author profiles
- **Publishers** — Manage publisher information and associated titles
- **Orders Management** — Track and update customer orders and fulfilment status
- **Authentication** — JWT-based login with route guards and role-based access
- **Responsive Design** — Optimized for desktop and tablet use

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 |
| Language | TypeScript 5.x |
| State / Async | RxJS |
| Styling | SCSS |
| HTTP | Angular HttpClient |
| Routing | Angular Router |
| Forms | Reactive Forms |
| Build Tool | Angular CLI |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- Angular CLI: `npm install -g @angular/cli`

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/PublicationsManagementSystemFrontend.git
cd PublicationsManagementSystemFrontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 4. Start the development server

```bash
ng serve
```

The app will be available at `http://localhost:4200`.

> ⚠️ Make sure the backend is running first. See [PublicationsManagementSystemBackend](https://github.com/YOUR_USERNAME/PublicationsManagementSystemBackend) for setup instructions.

---

## Project Structure

```
src/
├── app/
│   ├── core/              # Guards, interceptors, auth service
│   ├── shared/            # Reusable components, pipes, directives
│   ├── features/
│   │   ├── dashboard/
│   │   ├── books/
│   │   ├── authors/
│   │   ├── publishers/
│   │   └── orders/
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles/                # Global SCSS styles
```

---

## Scripts

| Command | Description |
|---|---|
| `ng serve` | Start dev server at `localhost:4200` |
| `ng build` | Build production bundle |
| `ng test` | Run unit tests |
| `ng lint` | Run linter |

---

## Related

- ⚙️ **Backend:** [PublicationsManagementSystemBackend](https://github.com/YOUR_USERNAME/PublicationsManagementSystemBackend) — Spring Boot REST API with PostgreSQL

---

## License

This project is licensed under the MIT License.
