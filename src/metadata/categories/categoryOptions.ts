import { defineCategoryOption } from '../../lib/index.ts'

export const male = defineCategoryOption({ code: 'MALE', name: 'Male' })
export const female = defineCategoryOption({ code: 'FEMALE', name: 'Female' })
export const under5 = defineCategoryOption({ code: 'AGE_UNDER5', name: 'Under 5' })
export const age5to14 = defineCategoryOption({ code: 'AGE_5_14', name: '5 – 14' })
export const age15plus = defineCategoryOption({ code: 'AGE_15PLUS', name: '15+' })

export const categoryOptions = [male, female, under5, age5to14, age15plus]
