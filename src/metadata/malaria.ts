import {
  defineCategory,
  defineCategoryCombo,
  defineCategoryOption,
  defineDataElement,
  defineDataSet,
  defineOptionSet,
} from '../lib/index.ts'

// Category options
export const male = defineCategoryOption({ code: 'MALE', name: 'Male' })
export const female = defineCategoryOption({ code: 'FEMALE', name: 'Female' })
export const under5 = defineCategoryOption({ code: 'AGE_UNDER5', name: 'Under 5' })
export const age5to14 = defineCategoryOption({ code: 'AGE_5_14', name: '5 – 14' })
export const age15plus = defineCategoryOption({ code: 'AGE_15PLUS', name: '15+' })

// Categories
export const sex = defineCategory({
  code: 'SEX',
  name: 'Sex',
  categoryOptions: [male, female],
})

export const ageGroup = defineCategory({
  code: 'AGE_GROUP',
  name: 'Age group',
  categoryOptions: [under5, age5to14, age15plus],
})

// Category combination (disaggregation)
export const sexAge = defineCategoryCombo({
  code: 'SEX_AGE',
  name: 'Sex × Age group',
  categories: [sex, ageGroup],
})

// Option set for case classification
export const caseClassification = defineOptionSet({
  code: 'MAL_CASE_CLASS',
  name: 'Malaria case classification',
  valueType: 'TEXT',
  options: [
    { code: 'CONFIRMED', name: 'Confirmed' },
    { code: 'SUSPECTED', name: 'Suspected' },
    { code: 'IMPORTED', name: 'Imported' },
  ],
})

// Data elements
export const malariaCases = defineDataElement({
  code: 'MAL_CASES',
  name: 'Malaria cases',
  shortName: 'Malaria cases',
  valueType: 'NUMBER',
  aggregationType: 'SUM',
  categoryCombo: sexAge,
})

export const malariaDeaths = defineDataElement({
  code: 'MAL_DEATHS',
  name: 'Malaria deaths',
  shortName: 'Malaria deaths',
  valueType: 'NUMBER',
  aggregationType: 'SUM',
  categoryCombo: sexAge,
})

export const malariaTreated = defineDataElement({
  code: 'MAL_TREATED',
  name: 'Malaria cases treated',
  shortName: 'Malaria treated',
  valueType: 'NUMBER',
  aggregationType: 'SUM',
  categoryCombo: sexAge,
})

export const malariaCaseClass = defineDataElement({
  code: 'MAL_CASE_TYPE',
  name: 'Malaria case classification',
  shortName: 'Case class',
  valueType: 'TEXT',
  aggregationType: 'NONE',
  optionSet: caseClassification,
})

// Data set
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
})
