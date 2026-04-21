import { runCli } from '@devotta-labs/dhis2-metadata-as-code'
import schema from './src/schema.ts'

await runCli(schema)
