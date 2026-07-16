<template>
  <UForm :state="selectedParticipants" class="space-y-4" :schema="schema">
    <!-- Campo de adicionar participante -->
    <UFormField
      name="participant"
      label="Adicionar participantes"
      required
      class="flex flex-col max-sm:flex-col justify-between gap-4"
      :ui="{ container: 'flex items-center gap-2' }"
    >
      <USelectMenu
        v-model="selectedParticipants"
        :items="contacts"
        :search-input="{ placeholder: 'Procurar...', variant: 'none' }"
        :value-attribute="null"
        icon="i-lucide-search"
        multiple
        placeholder="Digite para buscar contatos..."
        class="w-full"
      >
        <template #item-label="{ item }">
          {{ item.name }}

          <span class="text-muted pl-1">
            {{ unFormatPhoneNumber(item.phone) }}
          </span>
        </template>
      </USelectMenu>
    </UFormField>

    <!-- Lista de participantes -->
    <div v-if="selectedParticipants.length" class="space-y-2 overflow-x-auto">
      <ul role="list" class="divide-y divide-default">
        <li
          v-for="(p, i) in selectedParticipants"
          :key="i"
          class="flex items-center justify-between gap-3 py-3 px-4"
        >
          <!-- Informações do participante -->
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1 flex-1 min-w-0">
            <span class="font-medium truncate max-w-[100px] sm:max-w-[200px]">
              {{ p.name || 'Sem nome' }}
            </span>
            <span class="text-muted truncate max-w-[120px] sm:max-w-[200px] hidden xs:inline">
              {{ p.email }}
            </span>
            <span class="text-muted truncate max-w-[100px] sm:max-w-[150px] hidden sm:inline">
              {{ unFormatPhoneNumber(p.phone) }}
            </span>
          </div>
          <UButton
            v-if="p.type !== 'user'"
            color="error"
            type="button"
            size="md"
            variant="soft"
            icon="i-lucide-trash"
            @click="removeParticipant(i)"
          />
        </li>
      </ul>
    </div>
  </UForm>
</template>

<script setup>
import * as z from 'zod'

const schema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    created_at: z.string()
  })
)

const selectedParticipants = defineModel({ default: [] })
const contacts = ref([])

function removeParticipant(index) {
  selectedParticipants.value.splice(index, 1)
}

async function getContacts() {
  const data = await $fetch('/api/contacts')

  contacts.value = data

  selectedParticipants.value = contacts.value.filter(contact =>
    selectedParticipants.value.some(selectedParticipant => selectedParticipant.id === contact.id)
  )
}

onMounted(() => {
  getContacts()
})
</script>
