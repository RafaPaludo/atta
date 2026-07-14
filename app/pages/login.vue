<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
    <UPageCard class="w-lg max-w-md">
      <UForm
        :schema="loginSchema"
        :state="formState"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <div class="flex flex-col items-center gap-2 mb-6">
          <UIcon name="i-lucide-lock" class="size-12 text-primary" />
          <h1 class="text-2xl font-semibold">
            Olá novamente!
          </h1>
          <p class="text-sm text-muted-foreground">
            Não possui uma conta?
            <ULink to="/register" class="text-primary font-medium">Inscreva-se</ULink>
          </p>
        </div>

        <UFormField label="E-mail" name="email">
          <UInput
            v-model="formState.email"
            type="email"
            placeholder="Digite seu e-mail"
            class="w-full"
            autocomplete="email"
          />
        </UFormField>

        <UFormField label="Senha" name="password">
          <UInput
            v-model="formState.password"
            placeholder="Digite sua senha"
            class="w-full"
            autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
          <template #hint>
            <ULink to="/reset-password" class="text-primary font-medium text-sm" tabindex="-1">
              Esqueceu a senha?
            </ULink>
          </template>
        </UFormField>

        <UAlert
          v-if="alert"
          color="error"
          icon="i-lucide-info"
          :title="alert"
          class="mt-2"
        />

        <UButton
          type="submit"
          label="Acessar"
          color="primary"
          size="lg"
          class="w-full mt-2"
          block
          :loading="loading"
        />
      </UForm>
    </UPageCard>
  </div>
</template>

<script setup>
import { loginSchema } from '~/schemas/auth.schema'

definePageMeta({
  layout: 'authentication'
})

// Hooks
const { getErrorMessage } = useErrorMessages()
const supabaseClient = useSupabaseClient()

// Estado do formulário
const formState = reactive({
  email: '',
  password: ''
})

const alert = ref('')
const loading = ref(false)
const showPassword = ref(false)

// Função de submit
async function onSubmit({ data }) {
  alert.value = ''
  loading.value = true

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) throw error

    navigateTo('/')
  } catch (error) {
    console.error('Erro no login:', error)
    alert.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}
</script>
