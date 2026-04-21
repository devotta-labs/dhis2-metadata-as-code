import { defineCategory } from '../../lib/index.ts'
import { age15plus, age5to14, female, male, under5 } from './categoryOptions.ts'

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

export const categories = [sex, ageGroup]
