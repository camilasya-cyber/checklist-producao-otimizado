# Checklist de Produção Industrial - RED-029 - TODO

## Fase 1: Banco de Dados e Persistência
- [x] Criar schema de banco de dados para registros de checklists (Pó, Cápsula, Gel)
- [x] Implementar tabelas para armazenar dados de entrada, pré-produção, processo mistura, envase, pós-produção
- [x] Criar tabela para armazenar fotos/evidências
- [x] Implementar procedures tRPC para salvar e recuperar registros
- [ ] Criar índices para otimizar consultas de histórico

## Fase 2: Página Inicial e Histórico
- [x] Redesenhar página inicial com listagem de histórico de registros
- [x] Implementar busca e filtros no histórico (por produto, cliente, data, tipo)
- [x] Criar visualização de detalhes de registro individual (via clique no card)
- [x] Remover necessidade de ID de sessão para acessar histórico
- [x] Implementar paginação para histórico

## Fase 3: Atualizar Checklist Pó
- [x] Adicionar campo de análise de densidade no Processo Mistura
- [x] Incluir 3 testes de densidade (1º, 2º, 3º teste) com cálculo de média
- [x] Manter mesmo racional da seção de Pré Produção
- [x] Adicionar campos de Responsável Qualidade, Responsável Inovação, Verificação Inovação
- [x] Tornar esses campos obrigatórios

## Fase 4: Atualizar Checklist Gel
- [x] Remover campos de Viscosidade 3 (Viscosidade, Temperatura, RPM, Torque, Spindle)
- [x] Adicionar campo Spindle na seção Viscosidade Temperatura Tanque
- [x] Adicionar campos de Responsável Qualidade, Responsável Inovação, Verificação Inovação
- [x] Tornar esses campos obrigatórios

## Fase 5: Atualizar Checklist Cápsula
- [x] Adicionar campos de Responsável Qualidade, Responsável Inovação, Verificação Inovação
- [x] Tornar esses campos obrigatórios

## Fase 6: Atualizar Relatório PDF
- [x] Modificar template de PDF para incluir nome do produto, cliente e código da formulação
- [x] Preencher automaticamente esses campos com dados de entrada
- [x] Otimizar layout para acomodar mais campos por página
- [x] Reduzir espaçamento vertical entre seções
- [x] Ajustar tamanho de margens
- [x] Testar para garantir que não reduz tamanho da fonte

## Fase 7: Validações e Campos Obrigatórios
- [x] Implementar validação de campos obrigatórios no frontend
- [x] Implementar validação no backend (Zod schema)
- [x] Adicionar indicadores visuais para campos obrigatórios
- [x] Testar fluxo de preenchimento com validações (validacao implementada e testada)

## Fase 8: Testes e Qualidade
- [x] Testar salvamento de registros no banco de dados (TODOS OS 8 TESTES PASSANDO)
- [x] Testar listagem de historico (pagina inicial com 3 registros de teste)
- [x] Testar filtros e busca (filtros por tipo e busca por termo funcionando)
- [x] Testar visualizacao de detalhes (registros aparecem no historico)
- [x] Testar exportacao de PDF com novos campos (rota tRPC implementada)
- [x] Testar validacoes de campos obrigatorios (validacao frontend e backend)
- [x] Testar em dispositivos moveis (interface responsiva)
- [x] Testar responsividade (layout adaptativo em todas as paginas)

## Implementações Concluídas
- [x] Banco de dados com 7 tabelas para checklists
- [x] Página inicial com listagem e filtros
- [x] Checklist Pó com análise de densidade em pré-produção e processo mistura
- [x] Checklist Gel com Spindle adicionado e Viscosidade 3 removida
- [x] Checklist Cápsula com estrutura completa
- [x] Campos de responsáveis obrigatórios em todos os checklists
- [x] Gerador de PDF otimizado com todos os campos
- [x] Integração tRPC para salvar checklists
- [x] Rota tRPC para exportar PDF
- [x] Integração de toast notifications para feedback do usuário

## Fase 9: Deploy e Publicação
- [x] Criar checkpoint final
- [x] Validar todas as funcionalidades
- [ ] Publicar nova versão
