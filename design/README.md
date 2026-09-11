# Original design

`original-design.html` is the single-page design this site was built from,
preserved verbatim for reference. It is not served — the live site is the
Next.js app at the repo root.

The port kept the CSS unchanged (it is now `src/app/globals.css`, with new
component styles appended after the original 1,771 lines) and converted the
markup to JSX. Two things changed deliberately:

- `Big-clumpy.png` → `/Big-Clumpy.png`. The original casing worked on macOS
  and would have 404'd on Vercel's case-sensitive filesystem.
- The service-area collage image gained a crawlable city link grid beneath it.
  The image alone gave search engines and AI assistants nothing to index.
