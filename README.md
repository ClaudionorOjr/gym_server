# Gym

> Projeto para cadastro dos clientes em uma academia.

# Dependencys

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
