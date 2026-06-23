# Portfólio - Kayk Estécio

Portfólio pessoal de Kayk Estécio, estudante de Análise e Desenvolvimento de Sistemas com foco em backend Python, APIs, bancos de dados e desenvolvimento web.

## Estrutura

```text
.
├── assets/             # Currículo, imagens e ícones
├── css/                # Tokens, base, componentes, seções e responsividade
├── data/projects.js    # Fonte única dos projetos
├── js/                 # Navegação, renderização de projetos e inicialização
├── index.html
├── robots.txt
└── sitemap.xml
```

## Tecnologias

- HTML semântico
- CSS responsivo
- JavaScript com ES Modules
- GitHub Pages

## Desenvolvimento local

Como o projeto usa ES Modules, execute um servidor HTTP local:

```bash
python -m http.server 4173
```

Depois acesse `http://localhost:4173`.

## Conteúdo

Os projetos são mantidos em `data/projects.js`. Informações profissionais e links principais ficam em `index.html`.

## Publicação

O workflow em `.github/workflows/deploy.yml` publica a branch `main` no GitHub Pages.
