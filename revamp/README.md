# Kaasi revamp preview

Branch: `codex/public-site-hybrid-v3`. The earlier preview is preserved on `codex/public-site-revamp-v2`. The production Eleventy build and deployment still use the original files. The root config excludes this folder and Hallmark records.

From the repository root:

```powershell
npx @11ty/eleventy --config=revamp/eleventy.config.cjs --serve --port=4322
```

Build only: omit `--serve --port=4322`. Output is `_revamp/`. No new production dependency or framework is needed. Satoshi is bundled; Instrument Serif currently uses Google Fonts.

## Articles

Original `blog/*.md` files are read directly; no migration or duplication. Keep adding Markdown files there with the existing frontmatter (`title`, `date`, `author`, `image`, `excerpt`, `tags: post`, `layout: post.njk`). Both old and replacement sites can build the same article. The slug comes from the filename. The preview automatically adds reading time, heading anchors, section navigation, related reading, search and metadata.

Use Markdown for sections, lists and quotes. Inline HTML images and figures are supported, as are tables. Put images in `blog/img/` and use `/blog/img/name.jpg`. A captioned figure can contain `<img ... alt="Description" loading="lazy">` and `<figcaption>Caption</figcaption>`. For a note use `<aside class="callout">...</aside>`. This content is trusted repository source, never user-submitted markup.

## Before launch

- Review the art direction first. The old site remains available throughout.
- Verify current vs upcoming capabilities against the release being launched.
- Review privacy text: the original legal wording is preserved, including claims that require checking (storage, encryption, analytics). It is clearly flagged in this preview. No analytics or app runtime is loaded here.
- Confirm any replacement legal wording separately, including a proper contact/deletion procedure. No legal compliance claim is made by this build.
- Change preview noindex and robots policy deliberately; verify canonical URLs, social metadata and article links, then update deployment to output `_revamp` only when approved.
- Product images in `revamp/assets/screens/` are fresh beta captures with fictional October 2026 records. No personal records, backend sessions, stock photography or fabricated endorsements were used.

No changes were made to `kaasibeta` or `kaasiapp`. No production database, API or signed-in session was accessed.

## Refreshing app screenshots

Run `node revamp/tools/serve-beta-preview.cjs`, then open `http://127.0.0.1:4330/`. This separate local origin reads beta source in read-only mode, replaces fresh-install defaults with fictional data, and uses its own preview database. Cloud SDK, analytics and service-worker registration are disabled. The sample date is October 31, 2026; animation time continues normally. Close this capture server when finished.

The fixture has 29 days of expenses across 13 categories. Its three budgets show red, orange and green progress. For the monthly capture, open All Transactions and expand October 31. Save captures to `.hallmark/beta-captures/`; the website assets belong in `revamp/assets/screens/`. Capture the balance overview separately on desktop and phone, and keep the complete budget panel rather than cropping into its text. Screenshots are static, with only an Illustrative data caption. The feature controls switch between views; there is no image zoom or lightbox.
