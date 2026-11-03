# Reference-led visual slice

3 November 2026. The user approved a hero and first feature transition only, before extending the homepage. Blog styling and source articles are unchanged.

Visual anchor: supplied Monex image (third attachment). Secondary references: Finmax’s contrasting feature sections and Lunetra’s restrained product lighting. Interaction anchor: Two-Do’s product story, with screen-specific controls. Content Architecture supplies the idea of a distinct transition between sections, not its visual identity.

Implemented: Instrument Serif display headings and Satoshi supporting text; fresh beta dashboard and standalone budget captures; perspective settles on scroll; first feature section uses the light-theme colours read from kaasibeta/style.css (read-only). Its links switch real app screenshots. These are product views with illustrative data, not a live app embedded in the landing page.

The user approved the composition and requested Instrument Serif, updated beta imagery, more expense dates/categories, all three budget colours, and an expanded day in All Transactions. Captures now show a fictional October 2026 month with 29 expense dates and 13 expense categories. Budget states: groceries 115.5%, transport 88.9%, eating out 56.9%. October 31 is expanded in the monthly screenshot. The category chart was visually verified after correcting the fixture clock so animation time keeps advancing.

The capture server lives in revamp/tools/serve-beta-preview.cjs. It reads beta source without writing to that repository, supplies fictional fresh-install defaults in served responses only, uses a separate preview database, strips analytics and the cloud SDK, disables service-worker registration, and blocks external connections. The landing page itself loads only images, with no app storage or cloud runtime.

The first two sections remain the completed visual slice. The user likes this direction; remaining homepage sections and disclosure polish can follow. Preserve the approved blog styling and address the older raw-HTML rendering issue in that next pass.

Screenshot interaction: the user requested a bottom-right square expand icon instead of a full-size text link/new tab. Each feature screenshot now opens a native dialog with zoom controls, reset, scroll/pan, mouse drag, keyboard +/-/0, Escape, backdrop dismissal and native focus restoration. The original image link remains the no-script fallback. Tested desktop zoom/reset/Escape and narrow-screen layout; no overflow outside the dialog.
