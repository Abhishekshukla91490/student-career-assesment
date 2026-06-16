# Student Career Assessment

This is a static quiz app for student career recommendation. It includes:

- A landing form to collect student name, email, mobile, class, and school
- A 15-question assessment with shuffled questions and answers
- Hidden category scoring for job recommendation results
- Local persistence in `localStorage` so the quiz can resume
- Optional Google Sheets submission via a deployed Apps Script web app
- Admin dashboard pages: `admin-login.html` and `admin.html`

## How to run locally

1. Open `index.html` in your browser, or
2. Serve the folder with a static server (recommended for production-like behavior)

## Deployment

This repository includes a GitHub Actions Pages workflow at `.github/workflows/pages.yml` and a `CNAME` file for custom domain publishing.

Expected deployment targets:

- `https://dizitalmantrascareerassesment.com` (custom domain from `CNAME`)
- `https://Abhishekshukla91490.github.io/student-career-assesment` (GitHub Pages fallback)

## Notes

- `script.js` uses `GOOGLE_SHEETS_ENDPOINT` to submit data to Google Sheets.
- `google_sheets_webapp.gs` is the Apps Script backend file for remote submission.
- `admin.html` and `admin.js` show saved submissions from local storage.
