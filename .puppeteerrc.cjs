const { join } = require('path')

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Altera o diretório de cache para ficar dentro do projeto
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  chrome: {
    skipDownload: false // Garante que o Chrome será baixado
  }
}
