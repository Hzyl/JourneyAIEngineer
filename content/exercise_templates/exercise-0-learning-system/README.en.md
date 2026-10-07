# Count study minutes without duplicates

Implement `total_study_minutes(sessions)`. Each session is a dictionary with a
nonempty string `id` and integer `minutes` from 1 to 1440; booleans are invalid.
An empty week totals zero. Repeated IDs with identical minutes count once;
conflicting minutes for the same ID, or an invalid entry, raise `ValueError`.

Two sessions of 20 and 25 minutes total 45. Retrying the 20-minute session does
not increase that total. This models idempotency but does not replace a database.
Practice lists, dictionaries, loops and conditions first if needed. This lab is
not a prerequisite for reading the journaling lesson. Run tests in the local app
or use `python -m unittest -v test_exercise.py` for a standalone template.
No Git, API key or external package is needed; the web app provides content only.
