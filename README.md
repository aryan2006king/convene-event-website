# Convene – Responsive Event Management Website

A responsive website to explore upcoming events, view details and register. Built with plain HTML5, CSS3 and JavaScript (no frameworks).

**Live site:** https://aryan2006king.github.io/convene-event-website/

## Features
- Hero section with a live countdown to the next event
- Event cards (name, date, venue, image, description)
- Search and category filters
- Event detail pop-up with registration form
- JavaScript validation (name, email, 10-digit phone, event) with inline error messages
- Confirmation message on successful registration
- Dark/light mode (remembers your choice)
- Registrations saved in Local Storage and shown under "My registrations"; duplicate email per event is blocked
- Responsive on mobile, tablet and desktop; keyboard accessible; respects reduced-motion

## Run locally
Open `index.html` in a browser, or run `npx serve`.

## Project structure
```
index.html   page structure
style.css    layout, theming, responsive rules
script.js    event data, filtering, validation, countdown, storage
```

## Implementation notes
- Events live in an array in `script.js`; add or edit entries to change the catalogue (update the dates so the countdown shows a future event).
- Cards use CSS gradients with emoji as cover images; replace with `<img>` tags if you want real photos.
- Theme uses CSS variables switched by a `data-theme` attribute.

## Deploy
Push to GitHub, then connect the repo to Netlify/Vercel, or enable GitHub Pages (Settings → Pages → main branch).
