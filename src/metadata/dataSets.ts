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
  // Public metadata read+write and data read+write so the demo reporter (and
  // anyone else logged into the demo instance) can see the dataset in the
  // Data Entry app and submit values against it.
  sharing: {
    publicAccess: 'rwrw----',
  },
})

export const dataSets = [malariaMonthly]
