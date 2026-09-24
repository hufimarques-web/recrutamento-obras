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

## Disponibilidade

Esta versão está a funcionar localmente neste computador; ainda não foi publicada. Para receber candidaturas pela Internet é necessário publicar landing page e CRM juntos num servidor Node com disco persistente, HTTPS e cópias de segurança. Um alojamento com disco temporário não preserva esta base de dados. A política de privacidade deve identificar a entidade responsável e os seus contactos antes do lançamento público.

## Verificação realizada

Compilação de produção e TypeScript aprovados. Testado o percurso de candidatura até ao CRM, todos os campos, integridade do currículo, consentimento, validações, bloqueio de acesso sem sessão, repetição de envio sem duplicação, conflito entre edições, fases, notas, chamadas e entrevistas. Os registos de teste são removidos após a verificação.
