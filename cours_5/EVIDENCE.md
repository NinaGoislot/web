# Week 07 deployment evidence: Campus Board

## Project

- Repository: https://github.com/NinaGoislot/web (folder `cours_5/campus-board`)
- Tested commit: `689aad3`
- Render URL: https://campus-board-nina.onrender.com
- Render service: Docker, Free plan, Singapore, root directory `cours_5/campus-board`, health check `/actuator/health`
- Database: Neon PostgreSQL, Free plan, Singapore, connection pooling off
- Test date: 2026-10-13

## Required checks

### Owner success

- Local app: Alex created a post (201) and edited it (200).
- Swagger (local): Sam created a post (201) and deleted it (204). Reading it again returned 404.
- Public URL (smoke test): the owner updated (200) and deleted (204) the test post.

### Another account receives 403

- Swagger (local), authorized as Sam: PUT and DELETE on Alex's post both returned 403 `FORBIDDEN`, "Only the author can change this post." A GET afterwards showed the post unchanged.
- Public URL (smoke test): PUT 403, DELETE 403.

### Persistence after redeployment

- Created the post "Cloud persistence test" on the public site.
- Redeployed the same commit on Render (Manual Deploy > Deploy latest commit).
- Once the service was live again, the post was still returned by `GET /api/posts`.

## Observed status codes

| Condition | Expected | Observed |
|---|---|---|
| No token, `GET /api/me` | 401 | 401 |
| Wrong password | 401 | 401 |
| Duplicate email | 409 | 409 |
| Alex creates a post | 201 | 201 |
| Alex edits the post | 200 | 200 |
| Sam edits Alex's post | 403 | 403 |
| Sam deletes Alex's post | 403 | 403 |
| Empty title | 400 | 400 |
| Extra `ownerId` field | 400 | 400 |
| Owner deletes own post | 204 | 204 |
| Read a deleted post | 404 | 404 |

## Automated checks

- Backend (`mvnw test`): 9 tests, 0 failures
- Frontend (`npm test`): 4 tests, 0 failures. `npm run build` succeeded.
- Smoke test, local: all checks passed
- Smoke test, public URL:

```
PASS 200 GET /actuator/health
PASS 200 GET /api/posts
PASS 401 GET /api/me
PASS 201 POST /api/auth/signup
PASS 201 POST /api/auth/signup
PASS 409 POST /api/auth/signup
PASS 401 POST /api/auth/login
PASS 200 POST /api/auth/login
PASS 200 POST /api/auth/login
PASS 200 GET /api/me
PASS 201 POST /api/posts
PASS 403 PUT /api/posts/cfdbc0e1-bf41-4e1c-87d0-ba543b57c15a
PASS 403 DELETE /api/posts/cfdbc0e1-bf41-4e1c-87d0-ba543b57c15a
PASS 400 POST /api/posts
PASS 200 PUT /api/posts/cfdbc0e1-bf41-4e1c-87d0-ba543b57c15a
PASS 204 DELETE /api/posts/cfdbc0e1-bf41-4e1c-87d0-ba543b57c15a
PASS 404 GET /api/posts/cfdbc0e1-bf41-4e1c-87d0-ba543b57c15a
All checks passed. The test post was deleted. Two practice accounts remain in your database.
```

## Request trace: publishing a post

1. `App.vue` calls `request('/posts', { method: 'POST', body: { title, content }, protectedCall: true })`.
2. `api.js` adds `Authorization: Bearer <token>` and sends `POST /api/posts`.
3. Locally, the Vite proxy forwards `/api` to port 18707. On Render, the page and the API share the same origin.
4. Spring Security checks the JWT signature, issuer and expiry. An invalid token returns 401.
5. `PostController.create` validates the body (title and content only) and takes the author ID from the token subject.
6. `PostService.create` saves the post with that owner ID through `PostRepository`.
7. A row is inserted into the `post` table (H2 locally, Neon in production).
8. The API returns 201 with the new post, and Vue refreshes the list.

## Code questions

1. Where does the server get `ownerId`?
   From the verified JWT. `PostController` passes `jwt.getSubject()` to `PostService.create`. The request body only accepts title and content, so an extra `ownerId` field is rejected with 400.
2. Why does hiding a button not enforce authorization?
   Requests can be sent without the interface, for example from Swagger or curl. `PostService.requireOwner` compares the stored owner with the token's user and returns 403.
3. What does BCrypt `matches` do?
   It hashes the entered password with the salt stored in the saved hash and compares the two results. The hash is never decrypted.
4. Why does the request helper handle 204 before parsing JSON?
   A 204 response has no body, so `response.json()` would throw after a successful delete.
5. Why is the local profile unsuitable on Render?
   It stores data in an H2 file on the container disk, which is lost on redeployment, and it generates a new signing key at every start. The prod profile requires `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` and `JWT_SECRET`.
6. What survives a page reload, an app restart and a redeployment?
   Reload: the data is kept, the browser token is lost. Local restart: the data is kept in the H2 file, existing tokens become invalid. Redeployment on Render: the data is kept in Neon, and unexpired tokens stay valid because `JWT_SECRET` does not change.
