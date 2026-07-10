# [/reset-password](../../app/pages/reset-password.vue)

## Objetivo

Exibe um formulário para resetar a senha.

## Campos

E-mail.

## Validações

Email contem "@".

## Ação

Envia e-mail do Supabase para reset de senha.

## Estado Atual

Implementado.

## Melhorias (remover após implementar)

[] Ajustar mensagens de erro em caso de envio undefined.
[] Botão ficar em loading até o envio da api.
[] Mostrar mensagens de erro. No momenento não mostra nada.
[] Resetar o formulário, avisar para o usuário acessar o email e cair na página de login.
[] Melhorar o e-mail enviado pelo Supabase
[] Alterar o link de reset enviado pelo e-mail, deve direcionar para /new-password.