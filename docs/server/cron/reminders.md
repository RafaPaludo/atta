### Documentação do Cron de Lembretes

**Arquivo:** [`server/cron/reminders.ts`](../../../server/cron/reminders.ts)

```markdown
# Cron de Lembretes de Reunião

## Propósito
Este cron executa a cada minuto para verificar e enviar lembretes de reuniões agendadas.

## Fluxo de Execução

1. **Verifica pendências** → Busca lembretes com status `pending` no banco
2. **Para cada lembrete**:
   - Busca participantes da reunião
   - Busca dados da reunião (título, data, pauta)
   - Monta a mensagem personalizada
   - Envia via WhatsApp para cada participante
3. **Atualiza status** → Marca lembrete como `sent` apenas se TODOS receberem

## Como desativar temporariamente

Use a variável de ambiente para evitar disparos acidentais:

```bash
CONFIG_DONT_SENT_REMINDERS_ENABLED=true
```

## Fluxograma Simplificado

[CRON a cada minuto]
       ↓
[Busca lembretes pendentes]
       ↓
  ┌────┴────┐
  │ Nenhum? │ → Log e encerra
  └────┬────┘
       ↓
[Para cada lembrete]
       ↓
[Busca participantes + reunião]
       ↓
[Monta mensagem]
       ↓
[Envia para cada participante]
       ↓
  ┌────┴────┐
  │ Falhas? │ → Log de erro, não marca como sent
  └────┬────┘
       ↓
[Marca lembrete como sent]

## Logs

| Mensagem | Significado |
| --- | --- |
| 🔔 [CRON] Execução iniciada | Ciclo começou |
| ℹ️ Nenhum lembrete pendente | Nada para processar |
| ✅ [WhatsApp] Mensagem enviada | Envio bem-sucedido |
| ❌ [WhatsApp] Falha ao enviar | Erro no envio (continuará tentando) |
| ⚠️ Lembrete não marcado | Falha parcial (alguns não receberam) |


## Dependências

- sendWhatsapp() → Serviço de envio (server/utils/whatsapp.js)

- getPendingReminders() → Busca lembretes pendentes no banco

- mountMessageToSend() → Monta a mensagem com base no estágio do lembrete


---

### Como usar estes arquivos

1. Salve o primeiro conteúdo em `server/integrations/whatsapp/README.md`
2. Salve o segundo conteúdo em `server/cron/README.md`
3. Eles estarão disponíveis no repositório para consulta futura

Esses READMEs são leves, diretos e contêm exatamente o que você precisa lembrar quando voltar a esses arquivos depois de algumas semanas. 🚀
