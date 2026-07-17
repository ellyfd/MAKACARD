# Phase 3: Talent Intelligence Baseline

## Public Prototype Scope

The public Capability Map presents **role-level** evidence only. It is derived from the 2026-05 job-description database and shows job scope, core competencies, focus areas and work allocation.

It does not expose individual capability ratings, meeting observations, inferred personality, performance history or succession data.

## Evidence Contract

Every public job profile must contain:

```text
id, title, unit, belongsTo, focus, competencies, time,
source, sourceVersion, evidenceClass
```

For the current prototype, `evidenceClass` is `JD` and the required source is `聚陽實業職務說明書資料庫 · 2026-05`.

## What The Prototype May Do

- Compare a mission's required job profiles with a selected team's formal unit and role cues.
- Show the role-level capability landscape by organizational unit.
- Flag a missing task seat or a JD scope mismatch.

## What Requires The Enterprise Version

- Individual capability evidence and verification dates.
- Manager/HR review workflows.
- Grade, decision-right, readiness and succession records.
- Collaboration signals with expiry, access policy and audit trail.

No individual record can be created from a meeting transcript alone.
