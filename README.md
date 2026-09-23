# QuestTrack

A modern goal-tracking, daily consistency, community accountability, messaging, leaderboard, and achievement web app with GitHub-style activity analytics.

This is a static web app. The browser stores demo data in localStorage, and the deployable site is in the `public/` directory.

## Deploy to GitHub Pages

1. Open the repository's **Settings > Pages** on GitHub.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push to `main` or run the `Deploy QuestTrack to GitHub Pages` workflow manually.

The included workflow publishes `public/` on pushes to `main` or `master`. GitHub Pages must be enabled once in repository settings before the workflow can configure and deploy the site.

The app uses hash-based navigation so dashboard pages continue working when hosted beneath a repository URL such as `https://b-g-giridharan.github.io/QuestTrack/`.

