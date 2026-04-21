import { defineCategoryCombo } from '../../lib/index.ts'
import { ageGroup, sex } from './categories.ts'

export const sexAge = defineCategoryCombo({
  code: 'SEX_AGE',
  name: 'Sex × Age group',
  categories: [sex, ageGroup],
})

export const categoryCombos = [sexAge]
