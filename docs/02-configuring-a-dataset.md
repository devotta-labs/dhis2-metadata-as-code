# Configuring a Dataset

This guide walks through defining an aggregate data set — the kind used for periodic facility reporting. All examples reference the [malaria-monthly-reporting](../examples/malaria-monthly-reporting) project.

## Option Sets

Option sets define picklists for data elements. Each option has a `code` and a display `name`:

```ts
import { defineOptionSet } from '@devotta-labs/declare'

export const caseClassification = defineOptionSet({
  code: 'MAL_CASE_CLASS',
  name: 'Malaria case classification',
  valueType: 'TEXT',
  options: [
    { code: 'CONFIRMED', name: 'Confirmed' },
    { code: 'SUSPECTED', name: 'Suspected' },
    { code: 'IMPORTED', name: 'Imported' },
  ],
  sharing: captureSharing,
})
```

## Categories and Disaggregation

Categories let you break down data element values (e.g. by sex and age group). You build them bottom-up: category options → categories → category combos.

```ts
import { defineCategoryOption, defineCategory, defineCategoryCombo } from '@devotta-labs/declare'

const male = defineCategoryOption({ code: 'CO_MALE', name: 'Male', shortName: 'Male' })
const female = defineCategoryOption({ code: 'CO_FEMALE', name: 'Female', shortName: 'Female' })

const sex = defineCategory({
  code: 'CAT_SEX',
  name: 'Sex',
  shortName: 'Sex',
  dataDimensionType: 'DISAGGREGATION',
  categoryOptions: [male, female],
})

const sexAge = defineCategoryCombo({
  code: 'CC_SEX_AGE',
  name: 'Sex × Age',
  dataDimensionType: 'DISAGGREGATION',
  categories: [sex, ageGroup],
})
```

## Data Elements

Data elements are the individual fields collected in a form. Attach a `categoryCombo` for disaggregation, or an `optionSet` for picklist values:

```ts
import { defineDataElement } from '@devotta-labs/declare'

export const malariaCases = defineDataElement({
  code: 'MAL_CASES',
  name: 'Malaria cases',
  shortName: 'Malaria cases',
  valueType: 'NUMBER',
  aggregationType: 'SUM',
  categoryCombo: sexAge,
  sharing: captureSharing,
})

export const malariaCaseClass = defineDataElement({
  code: 'MAL_CASE_TYPE',
  name: 'Malaria case classification',
  shortName: 'Case class',
  valueType: 'TEXT',
  aggregationType: 'NONE',
  optionSet: caseClassification,
  sharing: captureSharing,
})
```

## Data Sets

A data set groups data elements into a periodic collection form and assigns it to organisation units:

```ts
import { defineDataSet } from '@devotta-labs/declare'

export const malariaMonthly = defineDataSet({
  code: 'DS_MALARIA_MONTHLY',
  name: 'Malaria — monthly reporting',
  shortName: 'Malaria monthly',
  periodType: 'Monthly',
  dataSetElements: [
    { dataElement: malariaCases },
    { dataElement: malariaDeaths },
    { dataElement: malariaTreated },
    { dataElement: malariaCaseClass },
  ],
  organisationUnits: [sel, lillehammer, gjovik, bergen],
  sharing: captureSharing,
})
```

## Sharing

Sharing controls who can see and edit metadata and data. Use `Sharing.private()` to lock everything down and grant access through user groups:

```ts
import { Sharing } from '@devotta-labs/declare'

export const captureSharing = Sharing.private({
  userGroups: [{ group: dataEntryUsers, access: { metadata: 'r', data: 'rw' } }],
})
```

Apply the same sharing object to data sets, data elements, category combos, categories, category options, and option sets to keep the access chain consistent.

## Wiring into the Schema

Export all metadata arrays from `src/schema.ts`:

```ts
import { defineSchema } from '@devotta-labs/declare'

export default defineSchema({
  categoryOptions,
  categories,
  categoryCombos,
  optionSets,
  dataElements,
  dataSets,
  organisationUnitLevels,
  organisationUnits,
  userRoles,
  userGroups,
  users,
})
```

## Validating and Applying

```bash
pnpm check    # validate the schema locally (no network)
pnpm start    # boot local DHIS2 and apply the schema
pnpm plan     # dry-run against the running local stack
pnpm apply    # commit changes to the running local stack
```
