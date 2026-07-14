# Tela: [/settings/security](../../app/pages/settings/security.vue)

## Objetivo
Exibe um formulário para que o usuário autenticado possa alterar sua senha de acesso ao sistema, exigindo a confirmação da senha atual por questões de segurança.

## Campos do Formulário
| Campo | Tipo | Obrigatório | Validação |
| :--- | :--- | :--- | :--- |
| **Senha atual** | Password | Sim | Mínimo de 8 caracteres. Deve corresponder à senha atual do usuário. |
| **Nova senha** | Password | Sim | Mínimo de 8 caracteres. Não pode ser igual à senha atual. |

## Fluxo de Funcionamento

1.  **Usuário preenche os campos** com a senha atual e a nova senha desejada.
2.  **Ao submeter o formulário**, o sistema realiza duas verificações:
    a.  **Validação da senha atual**: Tenta fazer login com o e-mail do usuário e a senha atual fornecida. Se falhar, exibe o erro "Senha atual incorreta".
    b.  **Atualização da senha**: Se a verificação for bem-sucedida, chama a API do Supabase para atualizar a senha para o novo valor.
3.  **Feedback ao usuário**:
    - **Sucesso:** Exibe um toast verde "Senha atualizada com sucesso" e limpa os campos do formulário.
    - **Erro:** Exibe um toast vermelho com a mensagem de erro apropriada (ex: "Senha atual incorreta").

## Estado
- [ ] Planejada
- [ ] Em desenvolvimento
- [x] **Implementada**
- [ ] Em revisão

## Requisitos Técnicos

### Validação no Frontend (Zod)
Usa o esquema `updatePasswordSchema` para validação básica dos campos (obrigatoriedade, tamanho mínimo).

```typescript
// schemas/auth.schema.ts
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'A senha atual deve ter no mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
})