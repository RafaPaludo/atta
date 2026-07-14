<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
    <UPageCard class="w-lg max-w-md">
      <UAuthForm
        :schema="resetPasswordSchema"
        :fields="fields"
        title="Esqueci minha senha"
        description="Digite seu e-mail para receber o link de recuperação"
        icon="i-lucide-mail"
        @submit="onForgotPassword"
      >
        <template #description>
          Já possui conta? <ULink to="/login" class="text-primary font-medium">Fazer login</ULink>
        </template>

        <template #validation>
          <UAlert
            v-if="alert"
            color="error"
            icon="i-lucide-info"
            :title="alert"
          />
          <UAlert
            v-if="successMessage"
            color="success"
            icon="i-lucide-check-circle"
            :title="successMessage"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup>
import { resetPasswordSchema } from '~/schemas/auth.schema'

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
  name: 'email',
  type: 'email',
  label: 'E-mail',
  placeholder: 'seu@email.com',
  required: true,
  autocomplete: 'email'
}]

const alert = ref('')
const successMessage = ref('')
const loading = ref(false)
const emailSent = ref(false)
const lastRequestTime = ref(0)
const MIN_INTERVAL = 60000 // 1 minuto

// Computed
const redirectUrl = computed(() => {
  // Usa a URL atual para construir o redirectTo
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://ipb-reunioes.vercel.app'
    : 'http://localhost:3000'

  return `${baseUrl}/new-password`
})

// Functions
async function onForgotPassword({ data }) {
  alert.value = ''
  successMessage.value = ''
  loading.value = true

  const now = Date.now()
  if (now - lastRequestTime.value < MIN_INTERVAL) {
    alert.value = 'Aguarde 1 minuto antes de solicitar novamente.'
    return
  }

  lastRequestTime.value = now

  try {
    // 1. Envia o e-mail de recuperação
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectUrl.value
    })

    if (error) throw error

    // 2. Sucesso - exibe mensagem amigável
    emailSent.value = true
    successMessage.value = 'Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada e spam.'

    toast.add({
      title: 'E-mail enviado!',
      description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      color: 'success'
    })
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperação:', error)
    alert.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

// Verifica se tem algum token na URL (caso o usuário já tenha clicado no link)
onMounted(() => {
  const user = useSupabaseUser()

  if (user.value) {
    navigateTo('/dashboard')
  }

  const token = route.query.token || route.hash?.replace('#', '')?.split('&')?.[0]?.split('=')?.[1]
  if (token) {
    // Se já tem token, redireciona para a página de nova senha
    navigateTo('/new-password')
  }
})
</script>
