# Account-deletion request validation

Date: 2026-10-08. Local code and Node Web Streams verification; not deployed.

## Input boundary

The deletion handler previously called `request.text()` before checking an 8192
character limit. A regression stream showed that all three chunks were consumed
even though the first chunk exceeded that limit. Two additional regressions showed
that a multibyte body above 8192 bytes could pass, and invalid UTF-8 password bytes
could be replaced during decoding before reaching the reauthentication adapter.

`request-body.ts` now buffers at most 8192 bytes of the delivered request body,
counts the cumulative bytes of each chunk and cancels further reading when that
budget is exceeded. It does not trust Content-Length. Cancellation acknowledgement
is not awaited, so a rejected or pending cancellation cannot delay the 413 response.
The byte limit does not bound memory already allocated by the HTTP runtime for an
individual chunk, nor does it replace the provider's request/time/rate limits.

After the complete bounded body arrives, strict UTF-8 decoding rejects malformed
sequences with a generic 400 response. Valid characters split across chunks retain
their exact value. The existing JSON confirmation, password length, verified
identity, reauthentication and MFA checks remain unchanged. Only the verified
user ID can reach account removal. No password, token or provider detail is logged.

## Evidence

- Before the fix, three new regressions failed: over-read, byte-count mismatch and
  malformed UTF-8 accepted by mocked account services. These tests now pass.
- Eleven input tests cover those failures, cumulative chunks, dishonest length,
  exact 8192/8193-byte boundaries, split Unicode, broken streams and cancellation
  that rejects or remains pending. Rejected inputs never call the deletion service.
- All **202 current frontend/unit tests in 38 files** passed, including the input,
  handler-authorization and deletion-UI cases. TypeScript, lint and Vite build pass;
  the documented Fast Refresh and hosted bundle-size warnings remain.
- Vitest discovery was separately corrected to exclude extracted source snapshots;
  see [CI/source verification](CI-SOURCE-RELEASE-CHECKS.md). These counts refer only
  to the current checkout, not archived test copies.

## Deployment gate

Read-only Supabase MCP inspection on this date still reports migrations
`20261006000100` and `20261006000200`, no Edge Functions and no preview branches.
The function is not deployed. Deno, psql and pg_ctl are not present on PATH in the
current shell; this is not a claim that no other installation exists on the machine.

Node Request/ReadableStream tests establish the focused handler behavior above.
Follow-up local acceptance now also passed 21 real Auth/Edge checks in the approved
Docker stack, including oversized bodies, invalid UTF-8, password reauthentication,
same-owner targeting and nine-table cascades. See `DATABASE-ACCEPTANCE.md` for
reproduction and the local Kong CORS limitation. Synthetic accounts were cleaned.
Production CORS, browser sign-out and email delivery remain deployment gates.
