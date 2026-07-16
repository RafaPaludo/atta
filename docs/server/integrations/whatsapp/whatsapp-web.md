# Integração WhatsApp Web

**Arquivo:** [`server/integrations/whatsapp/whatsapp-web.js`](../../../../server/integrations/whatsapp/whatsapp-web.js)

## Propósito
Este serviço gerencia a conexão com o WhatsApp usando a biblioteca `whatsapp-web.js`. Ele é responsável por:

- Manter uma sessão ativa e persistente com o WhatsApp
- Gerenciar fila de mensagens para envio assíncrono
- Reconectar automaticamente em caso de desconexão

## Como funciona

### Autenticação
- Na primeira execução, exibe um QR Code no console para escaneamento
- A sessão é salva localmente na pasta `.wwebjs_auth/`
- Em execuções seguintes, a sessão é restaurada automaticamente

### Enfileiramento
- Se o cliente não estiver pronto, as mensagens são enfileiradas
- Quando o cliente fica pronto, a fila é processada automaticamente
- Isso garante que nenhuma mensagem seja perdida durante a inicialização

## Uso

```javascript
import { getWhatsAppWebService } from '~/integrations/whatsapp/whatsapp-web'

const service = getWhatsAppWebService()
await service.sendMessage('5511999999999', 'Olá!')
```

## Status

```javascript
const status = service.getStatus()
console.log(status) // { isReady: true, queueSize: 0 }
```

## Arquivos Importantes

| Arquivo          | Propósito                          |
| ---------------  | ---------------------------------  |
| whatsapp-web.js  | Classe principal do serviço        |
| .wwebjs_auth/    | Sessão salva (não versionar)       | 
| .wwebjs_cache/   | Cache do Puppeteer (não versionar) |

## Dica de Produção

Copie a pasta `.wwebjs_auth/` do ambiente local para o servidor de produção para evitar a necessidade de escanear o QR Code novamente.


---

### Documentação do Cron de Lembretes

**Arquivo:** `server/cron/README.md`

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
