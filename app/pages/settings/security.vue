<template>
  <UPageCard
    title="Senha"
    description="Confirme a senha atual antes de cadastrar uma nova."
    variant="subtle"
  >
    <UForm
      :schema="updatePasswordSchema"
      :state="password"
      class="flex flex-col gap-4 max-w-xs"
      @submit="onSignUpNewUser"
    >
      <UFormField name="currentPassword">
        <UInput
          v-model="password.currentPassword"
          type="password"
          placeholder="Senha atual"
          class="w-full"
        />
      </UFormField>

      <UFormField name="newPassword">
        <UInput
          v-model="password.newPassword"
          type="password"
          placeholder="Nova senha"
          class="w-full"
        />
      </UFormField>

      <UButton label="Atualizar" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>
</template>

<script setup>
import { updatePasswordSchema } from '~/schemas/auth.schema'

// Hooks
const { getErrorMessage } = useErrorMessages()
const supabaseClient = useSupabaseClient()
const toast = useToast()

// Data
const password = reactive({
  currentPassword: '',
  newPassword: ''
})

// Functions
async function onSignUpNewUser({ data }) {
  // 1. Verifica se a senha atual está correta
  const isPasswordCorrect = await checkCurrentPassword(data.currentPassword)
  
  if (!isPasswordCorrect) {
    return
  }

  try {
    // 2. Se o login foi bem-sucedido, atualiza a senha
    const { error: updateError } = await supabaseClient.auth.updateUser({
      password: data.newPassword
    })

    if (updateError) throw updateError

    toast.add({
      title: 'Senha atualizada com sucesso',
      description: 'Sua senha foi alterada com segurança.',
      color: 'success'
    })

    // Limpa os campos
    password.currentPassword = ''
    password.newPassword = ''
  } catch (error) {
    toast.add({
      title: 'Erro ao atualizar a senha',
      description: getErrorMessage(error),
      color: 'error'
    })
  }
}

async function checkCurrentPassword(currentPassword) {
  const user = useSupabaseUser()

  if (!user.value?.email) {
    toast.add({
      title: 'Erro ao verificar senha',
      description: 'Usuário não autenticado.',
      color: 'error'
    })
    return false
  }
  
  const { error: signInError } = await supabaseClient.auth.signInWithPassword({
    email: user.value.email,
    password: currentPassword
  })

  if (signInError) {
    // Mapeia o erro específico do Supabase
    let errorMessage = 'Senha atual incorreta'
    
    if (signInError.message?.includes('Invalid login credentials')) {
      errorMessage = 'Senha atual incorreta. Verifique e tente novamente.'
    } else if (signInError.message?.includes('Email not confirmed')) {
      errorMessage = 'Seu e-mail ainda não foi confirmado.'
    }
    
    toast.add({
      title: 'Erro ao atualizar a senha',
      description: errorMessage,
      color: 'error'
    })
    
    return false
  }

  return true
}
</script>