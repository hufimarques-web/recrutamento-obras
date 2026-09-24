# Landing page e CRM de recrutamento

- Landing page: http://localhost:3005/
- CRM: http://localhost:3005/crm
- A palavra-passe está no ficheiro privado `ACESSO-CRM.txt`.

## Funcionamento

O formulário está ligado ao CRM. Cada candidatura guarda nome, telefone, email, localidade, profissão, experiência, carta de condução, transporte, disponibilidade, currículo opcional e consentimento com data e versão. O envio só apresenta sucesso depois de guardar os dados. Repetir uma tentativa de envio não duplica a candidatura.

O CRM inclui dashboard, funil de sete fases, lista, pesquisa e filtros, ficha editável, transferência do currículo, notas, chamadas, entrevistas, próximos contactos, empresa e oportunidade associadas e exportação CSV. Atualiza as candidaturas a cada 15 segundos enquanto estiver visível. O acesso requer palavra-passe; as sessões duram 12 horas. As decisões sobre candidatos são tomadas pela equipa.

## Arranque local

Requer Node.js 24 ou posterior. Na pasta deste projeto:

```sh
npm install
npm run dev -- --port 3005
```

Verificação de produção: `npm run build`. Arranque da versão compilada: `npm start -- --port 3005`.

## Dados e acesso

A base de dados SQLite em `data/recrutamento.sqlite` guarda as fichas e os currículos. Os dados persistem quando o navegador ou servidor são reiniciados. `data/access.json` guarda apenas o hash e o salt da palavra-passe. A pasta `data` e o ficheiro de acesso estão excluídos do Git e dos ficheiros públicos do site.

Para uma cópia de segurança consistente, parar o servidor e copiar a pasta `data` completa para um local privado. Não apagar essa pasta nem substituí-la ao atualizar o site.

## Publicação na Vercel

O repositório é `hufimarques-web/recrutamento-obras`. O projeto está preparado para Node 24 e funções na região Frankfurt. A base de dados Neon `recrutamento-obras` utiliza o plano gratuito e guarda candidatos, currículos, sessões e limites de tentativas.

Configuração privada necessária na Vercel: `DATABASE_URL` (ligação Neon) e `RECRUITMENT_AUTH` (JSON com salt e hash scrypt, correspondente à palavra-passe local). Nunca adicionar estas variáveis ao Git nem usar o prefixo `NEXT_PUBLIC_`. A pasta SQLite local é apenas alternativa de desenvolvimento quando não existe `DATABASE_URL`; na Vercel, a aplicação recusa utilizar armazenamento temporário.

Os currículos de até 10 MB são enviados e descarregados em partes de 2 MB, respeitando os limites das funções Vercel. As partes incompletas expiram em uma hora e são limpas no carregamento seguinte. O currículo só fica associado à candidatura depois da validação e gravação. As ligações de descarga exigem sessão do CRM.

O plano gratuito Neon inclui 0,5 GB por projeto. Acompanhar o consumo no painel Neon/Vercel. Nenhum plano pago foi ativado. A base de dados é partilhada entre as instalações que utilizam as mesmas variáveis; usar uma base separada para testes futuros.

A política de privacidade deve ser completada com a identificação e os contactos da entidade responsável.

## Verificação realizada

Compilação de produção e TypeScript aprovados. Testado o percurso de candidatura até ao CRM, todos os campos, integridade do currículo, consentimento, validações, bloqueio de acesso sem sessão, repetição de envio sem duplicação, conflito entre edições, fases, notas, chamadas e entrevistas. Os registos de teste são removidos após a verificação.
