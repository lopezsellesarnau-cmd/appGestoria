'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function signup(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const code = String(formData.get('code') ?? '').trim()

  if (!email || !password || !code) {
    return { error: 'Introduce email, contraseña y código de invitación.' }
  }
  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  const admin = createAdminClient()

  // 1. El código tiene que existir y estar sin usar.
  const { data: invite } = await admin
    .from('invite_codes')
    .select('id, used_by')
    .eq('code', code)
    .maybeSingle()

  if (!invite) {
    return { error: 'Código de invitación no válido.' }
  }
  if (invite.used_by) {
    return { error: 'Este código de invitación ya se ha usado.' }
  }

  // 2. Crear el usuario (email ya confirmado, sin correo de verificación).
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (createError || !created?.user) {
    const msg = createError?.message ?? ''
    if (msg.toLowerCase().includes('already')) {
      return { error: 'Ya existe una cuenta con ese email.' }
    }
    return { error: 'No se pudo crear la cuenta. Inténtalo de nuevo.' }
  }

  // 3. Marcar el código como usado (condición: que siga sin usar, por si acaso).
  const { error: markError, count } = await admin
    .from('invite_codes')
    .update({ used_by: created.user.id, used_at: new Date().toISOString() }, { count: 'exact' })
    .eq('id', invite.id)
    .is('used_by', null)

  if (markError || count === 0) {
    // Carrera: alguien usó el código a la vez. Deshacer el usuario creado.
    await admin.auth.admin.deleteUser(created.user.id)
    return { error: 'Este código de invitación ya se ha usado.' }
  }

  // 4. Iniciar sesión con la cuenta recién creada.
  const supabase = createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    // La cuenta existe; que entre por el login.
    redirect('/login')
  }

  redirect('/')
}
