# Phase 0: Data Governance Baseline

## Purpose

This document defines the data contract for MAKACARD / Org Quest. The public prototype may visualize approved organization data and run task simulations, but it is not an HR system of record or a personality assessment tool.

## Data Layers

| Layer | Purpose | Allowed Sources | May influence |
| --- | --- | --- | --- |
| Organization truth | Formal structure, positions, reporting and assignments | Organization PDFs, personnel announcements, HR-confirmed records | Digital Org and task role eligibility |
| Capability evidence | Skills, work scope, experience and role readiness | JD, approved project records, manager/HR verification | Task coverage and development gaps |
| Collaboration signal | Context-bounded working conditions and support needs | Approved meeting/project observations | Task hints and risk prompts only |
| Game flavor | Birthday-derived numerology, zodiac and visual themes | Month/day supplied by the person | Card appearance and optional social prompts only |

Birthday-derived data, collaboration signals and inferred patterns must never determine hiring, performance, promotion, termination, compensation or task eligibility.

## Required Records

### Organization unit

```text
id, nameZh, unitType, parentId, effectiveFrom, accountability,
leaderPositionId, source, sourceDate, verifiedAt, status
```

### Position

```text
id, titleZh, grade, orgUnitId, reportsToPositionId, decisionRights,
accountability, criticality, vacancyStatus, successorRequired, effectiveFrom
```

### Person

```text
id, nameZh, nameEn, birthMonthDay, primaryPositionId,
additionalAssignments, reportsTo, scope, location, dataStatus
```

### Assignment / reporting relationship

```text
personId, positionId, relationshipType, effectiveFrom, effectiveTo,
source, verifiedAt
```

Relationship types are `solidLine`, `dottedLine`, `acting`, `backupFor`, `owns`, `approves`, `dependsOn`, and `knowledgeSource`.

### Capability evidence

```text
personId, capability, category, proficiency, evidenceType, evidenceRef,
verifiedAt, usableIn, confidence, visibility
```

Proficiency uses evidence-based stages: `aware`, `collaborates`, `independent`, `setsStandard`, `developsOthers`.

### Collaboration signal

```text
personId, signal, appliesTo, sourceType, observedAt, confidence,
usageLimit, visibility, reviewDate
```

Signals must state an observable condition, such as "requires a working demo for product decisions". They must not label a person as passive, difficult, weak, or similar broad personality judgments.

## Source Precedence

1. Current personnel announcement with an effective date.
2. Current organization-chart PDF with an effective date.
3. HR-confirmed correction.
4. Job description for responsibility context only.
5. Approved meeting/project record for collaboration signals only.

Meeting records cannot create or override a formal position, reporting line, title, department, birthday or personnel change.

## Display Rules

- A field without verified data is omitted from the public UI.
- Names, titles, reporting lines and birthdays are never invented.
- One person has one canonical record; concurrent roles are modeled as assignments, not duplicate people.
- The Digital Org shows formal hierarchy first. Dotted-line and cross-functional relationships are a selectable overlay.
- Every formal unit and position must expose its source and effective date in the management view.

## Access Rules

| Access level | Visible data |
| --- | --- |
| Public prototype | Approved organization structure, public role information, game flavor |
| Team lead | Capability evidence, task role coverage, approved collaboration signals |
| HR / executive | Grade, succession, organization drafts, full source references |
| System administrator | Import history, audit log, access control |

The GitHub Pages prototype is classified as public-prototype scope. It must not contain sensitive talent records, raw meeting transcripts, personnel evaluations, private contact information, or unapproved data.

## Change Workflow

1. Receive source document or HR-confirmed correction.
2. Register source, effective date and scope of change.
3. Update formal unit, position and assignment records.
4. Run hierarchy validation: no orphaned units, circular reporting or duplicate canonical people.
5. Review visual organization tree and task impact.
6. Publish a dated data version and retain the prior snapshot.

## Phase 0 Exit Criteria

- All data scripts follow the source-precedence rules.
- Formal organization changes retain source and effective-date context.
- Public views omit unknown fields rather than displaying placeholders.
- Birthday data is restricted to month/day and isolated from management scoring.
- Collaboration signals are contextual, traceable and excluded from employment decisions.
