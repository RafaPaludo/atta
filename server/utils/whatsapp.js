import { getWhatsAppWebService } from '../integrations/whatsapp/whatsapp-web'

export async function sendWhatsapp(phone = '', message = '') {
  if (!phone || !message) {
    throw new Error('Número e mensagem são obrigatórios.')
  }

  if (process.env.WHATSAPP_PROVIDER === 'whatsapp-web') {
    const service = getWhatsAppWebService()
    return service.sendMessage(phone, message)
  }
}

export function getWhatsAppStatus() {
  if (process.env.WHATSAPP_PROVIDER === 'whatsapp-web') {
    const service = getWhatsAppWebService()
    return service.getStatus()
  }
}
