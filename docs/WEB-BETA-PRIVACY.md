# Web beta privacy notice

This notice applies only after the hosted web beta is deployed. The portable app and source clone keep their runtime learning data on the learner's own machine.

## Data the web beta stores

After sign-in, the app stores the account email managed by Supabase Auth and learning data needed to run the product: settings, lesson progress, study-session minutes and notes, review answers/history, notes and journal entries. Each row is associated with the signed-in user ID and is protected by Row Level Security.

## Data the web beta does not need

The beta does not ask for a GitHub token, an AI-provider key, a database password, a local workspace, source files, VS Code access or permission to run code. It does not synchronise the local SQLite database automatically.

## Retention and deletion

The beta keeps the data while the account exists so the learner can return to it. Before public launch, the maintainer must publish an account-deletion contact or self-service deletion flow and a support contact. Do not use the beta for secrets, private employer data or sensitive personal information.

## Third parties

Supabase provides authentication and database infrastructure. Cloudflare Pages serves the static frontend. Their services have their own policies and operational logs. A learner who clicks an external learning resource leaves this product and is subject to that site's policy.

## Changes

This notice must be updated before adding analytics, AI providers, file uploads, OAuth, cross-device local-data import, or a new data processor.
