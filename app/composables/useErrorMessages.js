import { AuthError } from '@supabase/supabase-js'

// Mapeamento completo de erros de autenticação do Supabase
const supabaseAuthErrors = [
  { code: 'invalid_credentials', translate: 'Usuário ou senha incorretos.' },
  { code: 'email_not_confirmed', translate: 'Confirme seu e-mail antes de continuar.' },
  { code: 'same_password', translate: 'Nova senha precisa ser diferente da anterior.' },
  { code: 'reauthentication_needed', translate: 'Para sua segurança, confirme sua identidade no e-mail enviado.' },
  { code: 'user_not_found', translate: 'Usuário não encontrado.' },
  { code: 'email_already_registered', translate: 'Este e-mail já está cadastrado.' },
  { code: 'invalid_token', translate: 'Link de recuperação inválido. Solicite um novo.' },
  { code: 'expired_token', translate: 'Link de recuperação expirado. Solicite um novo.' },
  { code: 'otp_expired', translate: 'Código de verificação expirado. Solicite um novo.' },
  { code: 'validation_failed', translate: 'Os dados fornecidos são inválidos.' },
  { code: 'too_many_requests', translate: 'Muitas tentativas. Aguarde um momento e tente novamente.' },
  { code: 'weak_password', translate: 'A senha é muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos.' }
]

// Mapeamento de erros do banco de dados (PostgreSQL)
const supabaseDbErrors = [
  { code: '23505', translate: 'Este registro já existe.' }, // unique_violation
  { code: '23503', translate: 'Este registro está vinculado a outro e não pode ser removido.' }, // foreign_key_violation
  { code: '23502', translate: 'Campo obrigatório não preenchido.' }, // not_null_violation
  { code: '22P02', translate: 'Formato de dado inválido.' }, // invalid_text_representation
  { code: '42P01', translate: 'Tabela não encontrada.' }, // undefined_table
  { code: '42501', translate: 'Permissão negada. Você não tem acesso a esta ação.' } // insufficient_privilege
]

function getErrorMessage(error) {
  // 1. Erro de autenticação do Supabase
  if (error instanceof AuthError) {
    const mapped = supabaseAuthErrors.find(e => e.code === error.code)

    return mapped?.translate || 'Erro de autenticação.'
  }

  // 2. Erro do Supabase com objeto completo
  if (
    typeof error === 'object'
    && error !== null
    && 'code' in error
  ) {
    const errorCode = String(error.code)

    // Busca no mapeamento de erros do banco
    const mapped = supabaseDbErrors.find(e => e.code === errorCode)
    if (mapped) {
      return mapped.translate
    }
  }

  // 3. Erro com apenas mensagem
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  // 4. Erro de rede ou TypeError
  if (error instanceof TypeError) {
    return 'Erro de conexão. Verifique sua internet.'
  }

  // 5. Erro de string
  if (typeof error === 'string') {
    return error
  }

  // 6. Fallback
  return 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
}

export const useErrorMessages = () => ({
  getErrorMessage
})
