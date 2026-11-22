# سُفرة — Arabic restaurant website (demo)

A fully Arabic (RTL), responsive restaurant website built with plain HTML, CSS and JavaScript (no frameworks, no build step).

**This is a portfolio demo.** The restaurant name, phone/WhatsApp number and reviews are placeholders.

## Features
- Menu with category tabs and live search
- Cart saved in the browser; checkout sends the full order (items, totals, delivery fee, address) as a ready-made **WhatsApp** message
- Free-delivery threshold and delivery fee, set in one place
- Weekly offers that can be added to the cart
- **Table booking** form with validation (Egyptian mobile numbers, no past dates/times) that sends a confirmation through WhatsApp
- Opening hours, Google Map, floating WhatsApp button
- SEO basics: meta description, Open Graph tags, `Restaurant` schema.org data
- Mobile menu, scroll animations (respects reduced-motion), accessible labels and keyboard support

## Customise
Everything content-related lives in `js/data.js`: restaurant name, WhatsApp number, address, hours, menu items, prices, offers and reviews. Images are in `assets/img/`.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python -m http.server 8000
```

## Credits
Food and interior photos from [Unsplash](https://unsplash.com) (Unsplash License).
Design and development: Mostafa Taha.
