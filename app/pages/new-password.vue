<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-lg max-w-md">
      <UAuthForm
        :schema="newPasswordSchema"
        :fields="fields"
        title="Redefinir senha"
        description="Digite sua nova senha"
        icon="i-lucide-lock"
        @submit="onResetPassword"
      >
        <template #validation>
          <UAlert
            v-if="alert"
            color="error"
            icon="i-lucide-info"
            :title="alert"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup>
import { newPasswordSchema } from '~/schemas/auth.schema'

definePageMeta({
  layout: 'authentication'
})

// Hooks
const { getErrorMessage } = useErrorMessages()
const supabase = useSupabaseClient()
const toast = useToast()
const route = useRoute()

// Data
const fields = [{
  name: 'password',
  label: 'Nova senha',
  type: 'password',
  placeholder: 'Digite sua nova senha',
  required: true
},
{
  name: 'confirmPassword',
  label: 'Confirmação da senha',
  type: 'password',
  placeholder: 'Confirme sua nova senha',
  required: true
}]

const alert = ref('')
const loading = ref(false)
const resetPasswordToken = computed(() => route.query.token || route.hash?.replace('#', '')?.split('&')?.[0]?.split('=')?.[1])

// Functions
async function onResetPassword(payload) {
  alert.value = ''
  loading.value = true

  try {
    if (!resetPasswordToken.value) {
      throw new Error('Token de recuperação inválido ou expirado. Solicite um novo link.')
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: payload.password
    })

    if (updateError) throw updateError

    toast.add({
      title: 'Senha redefinida com sucesso!',
      description: 'Você já pode fazer login com sua nova senha.',
      color: 'success'
    })

    setTimeout(() => navigateTo('/login'), 2000)
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)

    alert.value = getErrorMessage(error)

    if (error instanceof Error && error.message.includes('token')) {
      toast.add({
        title: 'Link inválido',
        description: alert.value,
        color: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

// Verifica se o token existe na URL ao carregar a página
onMounted(() => {
  if (!resetPasswordToken.value) {
    alert.value = 'Link de recuperação inválido. Solicite um novo reset de senha.'
  }
})
</script>
