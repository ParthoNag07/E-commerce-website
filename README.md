Marquee — Men's Fashion Storefront

A front-end e-commerce demo for a menswear brand. Static HTML/CSS/JS — no build step, no backend, no dependencies.

Features
Product grid with search, category filter, price range, and sorting (newest, price, rating)
Category quick-filters
Shopping cart with add/remove/update quantity, persisted in localStorage
Responsive layout (desktop → tablet → mobile)
Newsletter signup (front-end only)
Tech
Plain HTML, CSS, and vanilla JavaScript
Google Fonts: Fraunces (headings) and Inter (body)
Product images from Unsplash
Project structure
├── index.html      # markup, styles, and script all included
├── style.css       # standalone copy of the styles
└── script.js       # standalone copy of the app logic

index.html works on its own. style.css and script.js are provided separately if you'd rather link them instead of keeping everything inline — just add these two lines to index.html:

html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>

and remove the inline <style>/<script> blocks.

Running locally

No build tools needed — just open index.html in a browser, or serve the folder:

bash
python3 -m http.server 8000

Then visit http://localhost:8000.

Product data

Products are hardcoded in script.js (the products array). Swap in your own data or wire it up to an API by replacing that array and the renderProducts() function's data source.

Notes
Cart state persists per-browser via localStorage (key: marquee_cart_v1) — it does not sync across devices or sessions on a server.
Checkout is a placeholder (alert()) — no payment integration
