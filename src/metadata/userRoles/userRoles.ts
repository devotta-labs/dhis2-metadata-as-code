import { Authority, defineUserRole } from '../../lib/index.ts'

// Minimal role for demoing aggregate data capture: the user needs
// F_DATAVALUE_ADD to submit values via the Data Entry app; F_EXPORT_DATA is
// included so the same account can navigate to analytics / reports during
// the demo without surprises. Intentionally does **not** grant ALL so the
// demo stays recognisably non-superuser.
export const dataEntryRole = defineUserRole({
  code: 'UR_DATA_ENTRY',
  name: 'Data entry',
  description:
    'Demo role — can view and submit data values for shared datasets in the Data Entry app.',
  authorities: [Authority.F_DATAVALUE_ADD, Authority.F_EXPORT_DATA],
})

export const userRoles = [dataEntryRole]
