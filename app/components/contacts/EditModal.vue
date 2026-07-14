<template>
  <UModal v-model:open="open" title="Editar contato" description="Edite o contato selecionado">
    <template #body>
      <UForm
        v-if="formData"
        :schema="schema"
        :state="formData"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Nome" name="name">
          <UInput v-model="formData.name" placeholder="Nome completo" class="w-full" />
        </UFormField>
        <UFormField label="E-mail" name="email">
          <UInput v-model="formData.email" placeholder="nome@exemplo.com" class="w-full" />
        </UFormField>
        <UFormField label="Telefone" name="phone">
          <SMInputPhone v-model="formData.phone" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :loading="loading"
            label="Atualizar"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import * as z from 'zod'

// Schema de validação
const schema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\d{11}$/, 'O telefone deve ter 11 dígitos')
})

// Props e Emits
const props = defineProps({
  contact: {
    type: Object,
    required: false,
    default: () => ({ name: '', email: '', phone: '' })
  },
  openModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:openModal', 'updated'])

// Estado local
const open = ref(false)
const loading = ref(false)
const formData = ref({ ...props.contact })

const toast = useToast()

// Funções
function formatPhoneNumber(phone) {
  // Remove caracteres não numéricos
  return phone.replace(/\D/g, '')
}

async function onSubmit(event = {}) {
  try {
    loading.value = true

    const { data, error } = await $fetch(`/api/contacts/${props.contact.id}`, {
      method: 'PATCH',
      body: {
        name: event.data.name,
        email: event.data.email,
        phone: formatPhoneNumber(event.data.phone)
      }
    })

    if (error) throw error

    toast.add({
      title: 'Sucesso!',
      description: `Contato ${event.data.name} atualizado com sucesso`,
      color: 'success'
    })

    // Emite evento de atualização para o pai
    emit('updated', data)

    // Fecha o modal
    open.value = false
  } catch (err) {
    console.error('Erro ao editar contato:', err)
    toast.add({
      title: 'Erro ao atualizar',
      description: err.message || 'Ocorreu um erro inesperado. Tente novamente.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Watchers para sincronizar o estado
watch(
  () => props.openModal,
  (newVal) => {
    open.value = newVal
    if (newVal && props.contact) {
      // Reseta o formulário quando o modal abre
      formData.value = { ...props.contact }
    }
  },
  { immediate: true }
)

watch(open, (newVal) => {
  if (newVal !== props.openModal) {
    emit('update:openModal', newVal)
  }
})

// Limpa o formulário ao fechar o modal
watch(open, (newVal) => {
  if (!newVal) {
    // Opcional: reseta o formulário ao fechar
    // formData.value = { name: '', email: '', phone: '' }
  }
})
</script>
