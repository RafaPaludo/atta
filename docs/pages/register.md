# [/register](../../app/pages/register.vue)

## Objetivo

Exibe um formulário para criação da conta.

## Campos
Nome, E-mail, Telefone, Senha e Confirmação de Senha.

## Validações

E-mail único, senha com mínimo de 6 caracteres, telefone no formato (XX) 9XXXX-XXXX.

## Ação

Ao enviar, cria o usuário, envia um e-mail de boas-vindas e redireciona para /login.

## Estado Atual

Implementado.

## Melhorias (remover após implementar)

[] Caso dê sucesso, resetar o formulário e enviar para a página de login.
[] Melhorar o email de boas vindas do Supabase.