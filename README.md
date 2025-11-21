A simple and efficient URL shortening web application built using Next.js (App Router), Prisma, and Neon PostgreSQL.
Users can create short links, view analytics (click count), and manage URLs via a dashboard.

⭐ Features
Shorten long URLs
Auto-incrementing short codes
Track clicks
Dashboard to list all URLs
Delete URL
View individual URL stats
PostgreSQL storage using Prisma + Neon
Deployed frontend-ready project

Known Issue: DELETE Route Not Working (Windows “[id]” Folder Problem)
During development, the DELETE API endpoint:
DELETE /api/links/:id
kept failing with:
404 Not Found
500 Internal Server Error
/api/links/[...slug] auto-generated error
“Cannot read properties of undefined (reading ‘0’)”
“params.slug is a Promise”

🔍 Root Cause
Windows does NOT allow folder names with square brackets
(example: [id])
This breaks Next.js dynamic routing.
Windows refused to create the folder:
[id]
So Next.js didn’t detect the dynamic API route.

🛠 Multiple Fix Attempts (That We Tried)
✔ 1. Created folder using VSCode explorerStill didn’t work — Windows silently renamed or blocked it.
✔ 2. Created via PowerShellmkdir "[id]"Sometimes creates virtual folder but not correctly recognized by Node/Next.js.
✔ 3. Tried renaming via rename-item Windows does NOT allow brackets → rename failed.
✔ 4. Rebuilt .next multiple times rm -r .next npm run dev Issue remained — because folder name was invalid from OS side.
✔ 5. Checked using dir /x for 8.3 names Windows did not generate usable short name → Next.js routing still failed.
✔ 6. Manually deleting old stale files Still dynamic routing for DELETE broke.

❌ Result
Next.js detected a fallback catch-all route:
/api/links/[...slug]
which caused:
Error: Route "/api/links/[...slug]" used params.slug... and DELETE always returned 404/500.

✔ Final Recommendation
Because Windows cannot reliably create [id] folder names, use this alternative: Use API route inside a file instead of folder-based routing
Use:
src/app/api/links/[id].js
instead of:
src/app/api/links/[id]/route.js

📌 API Route Example (File-Based Routing)
Create the file:
src/app/api/links/[id]/route.js
OR (Windows safe)
src/app/api/links/[id].js
Inside:

src/app/api/links/
