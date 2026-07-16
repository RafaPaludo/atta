import WhatsAsppWebPackage from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const { Client, LocalAuth } = WhatsAsppWebPackage

class WhatsAppWebIntegration {
  constructor() {
    this.client = null
    this.isReady = false
    this.isInitializing = false
    this.messageQueue = []
    this.initialize()
  }

  initialize() {
    if (this.isInitializing || this.isReady) return

    this.isInitializing = true
    console.log('📱 [WhatsApp] Iniciando cliente...')

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })

    this.client.on('qr', (qr) => {
      console.log('📱 [WhatsApp] QR Code gerado! Escaneie com seu WhatsApp:')
      qrcode.generate(qr, { small: true })
      // TODO: Não gerar o QR code em produção.
      // Devo gerar a autenticação em DEV, depois copiar a pasta .wwebjs_auth/ (e a .wwebjs_cache/) para o ambiente de produção.
    })

    this.client.on('ready', () => {
      console.log('✅ [WhatsApp] Cliente pronto para enviar mensagens!')
      this.isReady = true
      this.isInitializing = false
      this.processQueue()
    })

    this.client.on('disconnected', (reason) => {
      console.warn(`⚠️ [WhatsApp] Cliente desconectado: ${reason}`)
      this.isReady = false
      this.isInitializing = false

      setTimeout(() => {
        console.log('🔄 [WhatsApp] Tentando reconectar...')
        this.initialize()
      }, 5000)
    })

    this.client.on('auth_failure', (error) => {
      console.error('❌ [WhatsApp] Falha na autenticação:', error)
      this.isReady = false
      this.isInitializing = false
    })

    this.client.initialize()
  }

  async processQueue() {
    while (this.messageQueue.length > 0 && this.isReady) {
      const item = this.messageQueue.shift()
      if (item) {
        try {
          await this.sendMessageInternal(item.phone, item.message)
          item.resolve()
        } catch (err) {
          item.reject(err)
        }
      }
    }
  }

  async sendMessageInternal(phone, message) {
    if (!this.client) {
      throw new Error('Cliente WhatsApp não inicializado.')
    }

    if (!this.isReady) {
      throw new Error('Cliente WhatsApp não está pronto.')
    }

    const cleanPhone = phone.replace(/\D/g, '')
    const chatId = `${cleanPhone}@c.us`

    try {
      await this.client.sendMessage(chatId, message)
    } catch (error) {
      console.error(`❌ [WhatsApp] Erro ao enviar para ${phone}:`, error)
      throw error
    }
  }

  async sendMessage(phone, message) {
    if (!this.client) {
      throw new Error('Cliente WhatsApp não foi inicializado.')
    }

    if (this.isReady) {
      return this.sendMessageInternal(phone, message)
    }

    return new Promise((resolve, reject) => {
      this.messageQueue.push({ phone, message, resolve, reject })
      console.log(`📝 [WhatsApp] Mensagem enfileirada para ${phone}. Fila: ${this.messageQueue.length}`)
    })
  }

  getStatus() {
    return {
      isReady: this.isReady,
      queueSize: this.messageQueue.length
    }
  }
}

// Singleton
let instance = null

export function getWhatsAppWebService() {
  if (!instance) {
    instance = new WhatsAppWebIntegration()
  }
  return instance
}
