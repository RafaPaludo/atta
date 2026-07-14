<template>
  <UApp>
    <UError
      :error="errorStatusFriendly"
      :clear="clearButton"
    />
  </UApp>
</template>

<script setup>
const props = defineProps(['error'])

const errorStatusFriendly = {
  statusCode: props.error.statusCode || 404,
  statusMessage: 'Página não encontrada',
  message: 'Desculpe, mas a página não foi encontrada.'
}

const clearButton = {
  size: 'xl',
  color: 'primary',
  variant: 'solid',
  label: 'Ir para página inicial',
  icon: 'i-lucide-arrow-left'
}

useSeoMeta({
  title: errorStatusFriendly.statusMessage,
  description: errorStatusFriendly.message
})

useHead({
  htmlAttrs: {
    lang: 'pt-br'
  }
})
</script>
