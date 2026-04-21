import { defineDataSet } from '../lib/index.ts'
import {
  malariaCaseClass,
  malariaCases,
  malariaDeaths,
  malariaTreated,
} from './dataElements.ts'

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

export const dataSets = [malariaMonthly]
