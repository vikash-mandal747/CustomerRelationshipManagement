# CustomerRelationshipManagement


| **Script**        | **Purpose**                                          | **Command to Run**        | **When to Use**               |
| ----------------- | ---------------------------------------------------- | ------------------------- | ----------------------------- |
| `dev`             | Run server with Nodemon (auto-restart, loads `.env`) | `npm run dev`             | During development            |
| `start`           | Run server normally (no auto-reload)                 | `npm start`               | In production/deployment      |
| `prisma:generate` | Generate updated Prisma client                       | `npm run prisma:generate` | After editing `schema.prisma` |
| `prisma:migrate`  | Apply DB migrations                                  | `npm run prisma:migrate`  | When you change DB schema     |
| `prisma:studio`   | Open Prisma GUI                                      | `npm run prisma:studio`   | To inspect or edit DB data    |
