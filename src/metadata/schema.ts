import { defineSchema } from '../lib/index.ts'
import * as malaria from './malaria.ts'

export default defineSchema({
  objects: [
    malaria.male,
    malaria.female,
    malaria.under5,
    malaria.age5to14,
    malaria.age15plus,
    malaria.sex,
    malaria.ageGroup,
    malaria.sexAge,
    malaria.caseClassification,
    malaria.malariaCases,
    malaria.malariaDeaths,
    malaria.malariaTreated,
    malaria.malariaCaseClass,
    malaria.malariaMonthly,
  ],
})
