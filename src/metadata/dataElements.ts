import { defineDataElement } from '../lib/index.ts'
import { sexAge } from './categories/categoryCombos.ts'
import { caseClassification } from './optionSets.ts'

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

export const dataElements = [malariaCases, malariaDeaths, malariaTreated, malariaCaseClass]
