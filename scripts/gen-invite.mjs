/**
 * Genera un código de invitación para el registro de Fincas Pro.
 *
 * Uso:  node scripts/gen-invite.mjs ["nota opcional: para quién es"]
 *
 * Imprime el código. Compártelo con la persona; lo usará una sola vez al
 * crear su cuenta en /signup.
 */
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trimStart().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const note = process.argv.slice(2).join(' ') || null
const code = 'FINCAS-' + randomBytes(4).toString('hex').toUpperCase() // p.ej. FINCAS-1A2B3C4D

const { error } = await sb.from('invite_codes').insert({ code, note })
if (error) {
  console.error('✗ Error:', error.message)
  process.exit(1)
}

console.log('\n✓ Código de invitación creado:\n')
console.log('   ' + code + (note ? `   (${note})` : ''))
console.log('\nCompártelo. Sirve para crear UNA cuenta en /signup.\n')
