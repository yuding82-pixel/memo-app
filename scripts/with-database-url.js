import { execSync } from 'child_process'
import { applyDatabaseUrl } from './sanitize-database-url.js'

applyDatabaseUrl()

const command = process.argv.slice(2).join(' ')

if (!command) {
  console.error('실행할 명령이 없습니다.')
  process.exit(1)
}

execSync(command, {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})
