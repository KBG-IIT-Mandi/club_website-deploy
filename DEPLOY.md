# KBG — The Living Interface · deploy artifacts

Production build of the KBG (Kamand Bioengineering Group, IIT Mandi) website.
**This repository contains build artifacts only.** The source is closed;
releases are published here from the private source tree. Do not edit files
in this repo — any change will be overwritten by the next release.

## Deploying

The site is fully static (single-page app). Serve this repository's root
with any static file server, with SPA fallback to `index.html`
(`_redirects` covers Netlify-style hosts; Caddy needs `try_files`).

For the club server (release dir + atomic symlink swap):

```bash
./deploy.sh            # uses ubuntu@144.24.122.125, override with KBG_HOST
```

Rollback: point the symlink at the previous release —
`ssh $HOST "sudo ln -sfn /var/www/kbgwebsite-releases/<older> /var/www/kbgwebsite.new && sudo mv -Tf /var/www/kbgwebsite.new /var/www/kbgwebsite"`

## Notes

- Runtime content (page copy, projects, events, team) loads from the public
  KBG-IIT-Mandi/KBG_Links repo — content edits need no redeploy.
- No CDN dependencies; everything ships from the same origin.
