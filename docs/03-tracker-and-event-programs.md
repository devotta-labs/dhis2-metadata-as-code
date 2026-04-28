# Tracker and Event Programs

This guide covers both tracker programmes (`WITH_REGISTRATION`) and event programmes (`WITHOUT_REGISTRATION`). All examples reference the [tb-tracker](../examples/tb-tracker) project.

## Program Types

| Type | Registration | Enrolment | Use case |
| --- | --- | --- | --- |
| `WITH_REGISTRATION` (Tracker) | Yes — tracked entity | Yes — entity is enrolled | Longitudinal case tracking (e.g. TB follow-up) |
| `WITHOUT_REGISTRATION` (Event) | No | No | One-off anonymous events (e.g. disease notification) |

## Tracked Entity Attributes

Tracked entity attributes (TEAs) are the fields that describe an enrolled individual — name, date of birth, national ID, etc.

```ts
import { defineTrackedEntityAttribute } from '@devotta-labs/declare'

export const firstNameTea = defineTrackedEntityAttribute({
  code: 'TEA_FIRST_NAME',
  name: 'First name',
  shortName: 'First name',
  valueType: 'TEXT',
  sharing: captureSharing,
})

export const nationalIdTea = defineTrackedEntityAttribute({
  code: 'TEA_NATIONAL_ID',
  name: 'National ID',
  shortName: 'National ID',
  valueType: 'TEXT',
  unique: true,
  sharing: captureSharing,
})
```

Set `unique: true` for attributes that should never repeat across tracked entities.

## Tracked Entity Types

A tracked entity type (TET) defines the kind of entity being tracked (e.g. Person) and attaches the core demographic TEAs:

```ts
import { defineTrackedEntityType } from '@devotta-labs/declare'

export const personTrackedEntityType = defineTrackedEntityType({
  code: 'TET_PERSON',
  name: 'Person',
  shortName: 'Person',
  description: 'A human being enrolled in one or more DHIS2 tracker programmes.',
  featureType: 'NONE',
  minAttributesRequiredToSearch: 1,
  trackedEntityTypeAttributes: [
    { trackedEntityAttribute: firstNameTea, displayInList: true, mandatory: true, searchable: true },
    { trackedEntityAttribute: lastNameTea, displayInList: true, mandatory: true, searchable: true },
    { trackedEntityAttribute: dateOfBirthTea, displayInList: true, mandatory: false, searchable: true },
    { trackedEntityAttribute: sexTea, displayInList: true, mandatory: false, searchable: false },
    { trackedEntityAttribute: nationalIdTea, displayInList: true, mandatory: false, searchable: true },
    { trackedEntityAttribute: phoneNumberTea, displayInList: false, mandatory: false, searchable: false },
  ],
  sharing: captureSharing,
})
```

Core demographic TEAs belong on the TET so they can be reused across multiple programmes for the same person.

## Program Stages

A program stage represents a discrete step or visit. It holds the data elements captured at that point:

```ts
import { defineProgramStage } from '@devotta-labs/declare'

export const initialScreeningStage = defineProgramStage({
  code: 'PS_TB_INITIAL_SCREENING',
  name: 'Initial screening',
  shortName: 'Initial screen',
  description: 'First encounter with a TB-presumptive patient.',
  sortOrder: 1,
  repeatable: false,
  autoGenerateEvent: true,
  openAfterEnrollment: true,
  validationStrategy: 'ON_COMPLETE',
  executionDateLabel: 'Screening date',
  programStageDataElements: [
    { dataElement: coughGt2Weeks, compulsory: true, sortOrder: 1 },
    { dataElement: feverGt2Weeks, compulsory: false, sortOrder: 2 },
    { dataElement: weightKg, compulsory: false, sortOrder: 6 },
    { dataElement: screeningResult, compulsory: true, sortOrder: 8 },
  ],
  sharing: captureSharing,
})
```

Key options:

- `repeatable` — whether the stage can occur more than once per enrolment.
- `autoGenerateEvent` — automatically create an event when the entity is enrolled.
- `openAfterEnrollment` — open the stage form immediately after enrolment.
- `validationStrategy` — `'ON_COMPLETE'` or `'ON_UPDATE_AND_INSERT'`.

## Defining a Tracker Program

A tracker program ties together the tracked entity type, program stages, and programme-level TEAs:

```ts
import { defineProgram } from '@devotta-labs/declare'

export const tbProgram = defineProgram({
  code: 'PRG_TB_TRACKER',
  name: 'TB tracker',
  shortName: 'TB tracker',
  programType: 'WITH_REGISTRATION',
  trackedEntityType: personTrackedEntityType,
  organisationUnits: [sel, lillehammer, gjovik, bergen],
  programStages: [initialScreeningStage],
  displayFrontPageList: true,
  useFirstStageDuringRegistration: true,
  accessLevel: 'OPEN',
  minAttributesRequiredToSearch: 1,
  enrollmentDateLabel: 'Enrollment date',
  programTrackedEntityAttributes: [
    { trackedEntityAttribute: firstNameTea, displayInList: true, mandatory: true, searchable: true, sortOrder: 1 },
    { trackedEntityAttribute: lastNameTea, displayInList: true, mandatory: true, searchable: true, sortOrder: 2 },
    { trackedEntityAttribute: hivStatusTea, displayInList: false, mandatory: false, searchable: false, sortOrder: 7 },
  ],
  sharing: captureSharing,
})
```

`programTrackedEntityAttributes` controls which TEAs appear in the enrolment form and how they behave (display order, mandatory, searchable). Programme-scoped TEAs (like `hivStatusTea`) that only apply to this programme go here rather than on the TET.

## Event Programs

Event programmes are simpler — no tracked entity, no enrolment. Drop the `trackedEntityType` and `programTrackedEntityAttributes` and set `programType` to `'WITHOUT_REGISTRATION'`:

```ts
export const notificationProgram = defineProgram({
  code: 'PRG_DISEASE_NOTIFICATION',
  name: 'Disease notification',
  programType: 'WITHOUT_REGISTRATION',
  organisationUnits: [sel, lillehammer],
  programStages: [notificationStage],
  sharing: captureSharing,
})
```

## Wiring into the Schema

For a tracker programme, include all the tracker-specific metadata in `defineSchema`:

```ts
import { defineSchema } from '@devotta-labs/declare'

export default defineSchema({
  optionSets,
  dataElements,
  organisationUnitLevels,
  organisationUnits,
  userRoles,
  userGroups,
  users,
  trackedEntityAttributes,
  trackedEntityTypes,
  programs,
  programStages,
})
```
