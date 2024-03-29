# Gym

> Projeto para cadastro dos clientes em uma academia.

# Dependencys

- Bcryptjs

```sh
$ npm i bcryptjs

# Tipagens do Bcryptjs
$ npm i @types/bcryptjs -D
```

- Commitizen

```sh
$ npm i commitizen -D

# Configuração do Commitizen
$ npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Atualizar `.git/hooks/prepare-commit-msg` com o código:

```sh
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

- Dotenv

```sh
$ npm i dotenv
```

- ESLint

```sh
$ npm i eslint -D

# Instalando o plugin ESLint da Rocketseat para formatação do código
$ npm i @rocketseat/eslint-config -D

# Configuração do ESlint (opcional)
$ npx eslint --init
```

- Faker-js

```sh
# Lib para gerar dados fictícios
$ npm i @faker-js/faker -D
```

- Fastify

```sh
$ npm i fastify
```

- Handlebars

```sh
# Template engine
$ npm i handlebars
```

- Nodemailer

```sh
# Envio de e-mails (Testes)
$ npm i nodemailer
```

- Prisma

```sh
# Instalação do Prisma
$ npm i prisma -D

$ npm i @prisma/client

# Inicializar o Prisma gerando a pasta Prisma
$ npx prisma init
```

- Resend

```sh
# Lib para envio de e-mails (Produção)
$ npm i resend
```

- Semantic-release

```sh
# Instalação da dependência
$ npm i semantic-release -D

# Plugins adicionais
$ npm i @semantic-release/git @semantic-release/changelog -D
```

- Supertest

```sh
# Realiza as chamadas HTTP dos testes para a aplicação sem a necessidade de colocar a aplicação no ar
$ npm i supertest @types/supertest -D
```

- Swagger

```sh
# Plugin do Fastify para criar documentação da API com Swagger
$ npm i @fastify/swagger
```

- TSyringe

```sh
# Instalação Tsyringe para injeção automatica de dependências
$ npm i tsyringe

# Necessário instalar o `reflect-metadata`
$ npm i reflect-metadata
```

- Modificar o `tsconfig.json` para incluir as seguintes configurações:

```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
    ...
  }
}
```

- Configurações do `app.ts` para o funcionamento do tsyringe:

```ts
// Deve ser importada na primeira linha do arquivo
import 'reflect-metadata'
...
import '@infra/container'
```

- TypeScript

```sh
# Instalação do TypeScript e das tipagens para node
$ npm i typescript @types/node -D

# Inicializando o TypeScript
$ npx tsc --init

# Permite que o node execute código TypeScript
$ npm i tsx -D

# Realiza a conversão do código de TypeScrip para JavaScript (build)
$ npm i tsup -D
```

- Vitest

```sh
# Instalação do Vitest
$ npm i vitest -D

# Plugin para que o vitest consiga entender os paths configurados no tsconfig
$ npm i vite-tsconfig-paths -D
```

- Zod

```sh
$ npm i zod
```

## Commads

```sh
# Certifique-se de que todos os pacotes estão atualizados para versões compatíveis.
$ npm outdated

# Atualizar as dependências
$ npm update
```
