# Server

O servidor possui alguns padrão já definidos pelo próprio Nuxt. Outras pastas foram criadas para organizar melhor os códigos em uma arquitetura que faça sentido.

## /api

Pasta oficial do Nuxt para centralizar todas as rotas de api disponíveis no frontend. É aqui que todas as rotas CRUD devem ficar.

Ao criar novas rotas, deve-se validar se o usuário está autenticado e repassar os dados para algum controller específico.

## /controllers

Os controllers são chamados exclusivamente pelas apis e devem chamar 1 ou mais services para executar a tarefa.

## /services

Os services englobam as regras de negócio. Eles são chamadas pelos controllers e devem validar os dados necessários para alguma ação.

## /repositories

Responsáveis unicamente por fazer a conexão com o banco de dados.

## /integrations

Aqui são os services de terceiros, fazer a conexão com whatsapp, telegram, email, etc. Nessa pasta é que ficam isolados todos os scripts de conexão com serviços externos ou bibliotecas que não temos controle.

## /cron

Usado para o módulo nuxt-cron. Serve exclusivamente para rodar um script que de tempos em tempos irá executar algo (defineCronHandler).