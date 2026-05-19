# SQWARK Interest Form Setup

The site now includes a postponement email form in [index.html](C:\Users\leoam\OneDrive\Desktop\brian event site\index.html). To store addresses safely, connect it to a private Google Sheet with Google Apps Script.

## What this does

- Stores signups in a private Google Sheet that is not part of the public GitHub Pages repo
- Keeps a single row per email address by updating duplicates instead of appending endlessly
- Ignores bot submissions through the hidden honeypot field

## Setup steps

1. Create a new private Google Sheet for the interest list.
2. In that Sheet, open `Extensions -> Apps Script`.
3. Replace the default script with the contents of [google-apps-script-interest-collector.gs](C:\Users\leoam\OneDrive\Desktop\brian event site\google-apps-script-interest-collector.gs).
4. Save the project.
5. Click `Deploy -> New deployment`.
6. Choose `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Deploy and copy the Web app URL.
10. In [index.html](C:\Users\leoam\OneDrive\Desktop\brian event site\index.html), find `data-endpoint="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"` and replace it with your deployed Web app URL.
11. Push again so the live site uses the real collector endpoint.

## Important notes

- Keep the Google Sheet private.
- Do not store emails in the repo itself.
- If you redeploy the Apps Script and get a new URL, update the endpoint in [index.html](C:\Users\leoam\OneDrive\Desktop\brian event site\index.html).
- Existing ticket-holder follow-up is still a separate manual process unless you already have a ticketing export/email tool.
