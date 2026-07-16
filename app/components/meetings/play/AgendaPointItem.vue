<template>
  <div v-if="!isDeleted">
    <UCard
      :variant="isResolved ? 'soft' : 'subtle'"
      :ui="{ body: 'p-3 sm:p-4' }"
      class="transition-all duration-200 hover:shadow-sm"
    >
      <!-- Linha principal: checkbox + conteúdo + botão deletar -->
      <div class="flex items-start gap-3 sm:gap-4">
        <!-- Checkbox -->
        <UCheckbox
          :disabled="disabledActions"
          :model-value="isResolved"
          class="mt-1 flex-shrink-0"
          @update:model-value="toggleAgendaPointStatus"
        />

        <!-- Conteúdo principal -->
        <div class="flex-1 min-w-0">
          <span
            class="text-sm sm:text-base font-semibold break-words"
            :class="{ 'line-through text-muted': isResolved }"
          >
            {{ currentAgendaPoint.content }}
          </span>
        </div>

        <!-- Botão deletar -->
        <UButton
          label="Deletar"
          icon="i-lucide-trash"
          color="error"
          variant="ghost"
          size="xs"
          class="flex-shrink-0 -mr-1"
          :disabled="disabledActions"
          @click="deleteAgendaPoint"
        />
      </div>

      <!-- Informações adicionais (responsivas) -->
      <div
        class="mt-2 sm:mt-3 ml-7 sm:ml-8 text-xs sm:text-sm text-muted"
        :class="{ 'line-through opacity-70': isResolved }"
      >
        <!-- Layout flexível que se adapta -->
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <!-- Responsável -->
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-user"
              class="size-3.5 sm:size-4 flex-shrink-0"
            />
            <span class="truncate max-w-[100px] sm:max-w-[200px]">
              {{ participantAssignedToAgendaPoint.name }}
            </span>
          </div>

          <!-- Separador (escondido no mobile) -->
          <span class="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>

          <!-- Data de vencimento -->
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-calendar-clock"
              class="size-3.5 sm:size-4 flex-shrink-0"
            />
            <span class="whitespace-nowrap">
              {{ convertTimeStampzToLocalDate(currentAgendaPoint.due_date) }}
            </span>
          </div>

          <!-- Separador (escondido no mobile) -->
          <span class="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>

          <!-- Badge de status -->
          <UBadge
            class="font-bold rounded-full"
            size="sm"
            :color="isResolved ? 'warning' : 'success'"
          >
            {{ isResolved ? 'Resolvido' : 'Pendente' }}
          </UBadge>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
// ================================
// Imports / Composables
// ================================
const toast = useToast()

// ================================
// Props
// ================================
const props = defineProps({
  agendaPoint: {
    type: Object,
    required: true
  },
  participants: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: true
  }
})

// ================================
// State (Local / Optimistic UI)
// ================================
// Cópia local para permitir atualizações otimistas
const currentAgendaPoint = ref({ ...props.agendaPoint })

// Controla remoção visual após delete
const isDeleted = ref(false)

// Evita múltiplas ações simultâneas
const waitingChangeResolve = ref(false)

// ================================
// Computed
// ================================
// Verifica se o encaminhamento está resolvido
const isResolved = computed(() => currentAgendaPoint.value.status === 'resolved')
const disabledActions = computed(() => props.disabled || waitingChangeResolve.value)

// Participante responsável pelo encaminhamento
const participantAssignedToAgendaPoint = computed(() => {
  return (
    props.participants.find(
      participant => participant.id === currentAgendaPoint.value?.participant_id
    ) ?? { name: 'Não atribuído' }
  )
})

// ================================
// Constants
// ================================
// Mapeia transição de status
const statusTransition = Object.freeze({
  pending: 'resolved',
  resolved: 'pending'
})

// ================================
// Watchers
// ================================
// Mantém estado local sincronizado com mudanças externas
watch(
  () => props.agendaPoint,
  (newValue) => {
    currentAgendaPoint.value = { ...newValue }
  }
)

// ================================
// API Actions
// ================================
async function updateAgendaPointStatus() {
  waitingChangeResolve.value = true

  try {
    await $fetch(`/api/agenda-points/${currentAgendaPoint.value.id}`, {
      method: 'PATCH',
      body: {
        status: currentAgendaPoint.value.status
      }
    })
  } catch (error) {
    console.error(error)

    toast.add({
      title: 'Erro ao salvar',
      description: 'Não foi possível atualizar o status do encaminhamento.',
      color: 'error'
    })

    throw error
  } finally {
    waitingChangeResolve.value = false
  }
}

async function deleteAgendaPoint() {
  if (waitingChangeResolve.value) return

  waitingChangeResolve.value = true

  try {
    await $fetch(`/api/agenda-points/${currentAgendaPoint.value.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Encaminhamento deletado',
      description: 'O encaminhamento foi removido com sucesso.'
    })

    isDeleted.value = true
  } catch (error) {
    console.error(error)

    toast.add({
      title: 'Erro ao deletar',
      description: 'Não foi possível deletar o encaminhamento.',
      color: 'error'
    })
  } finally {
    waitingChangeResolve.value = false
  }
}

// ================================
// UI Handlers
// ================================
// Alterna status (pending <-> resolved) com fallback em erro
async function toggleAgendaPointStatus() {
  if (waitingChangeResolve.value) return

  const previousStatus = currentAgendaPoint.value.status
  currentAgendaPoint.value.status = statusTransition[previousStatus]

  try {
    await updateAgendaPointStatus()
  } catch {
    // Reverte UI se a API falhar
    currentAgendaPoint.value.status = previousStatus
  }
}
</script>
