# WikiPiece
Projeto desenvolvido para estudo do React.js utilizando uma api feita em Node.js.

# Deploy
- A aplicação está hospedada no site: https://wikipiece.herokuapp.com/
- Como o heroku desliga a aplicação quando a mesma fica 30 minutos sem acesso, pode demorar um pouco para carregar as informações do site quando entrar.

![](https://github.com/DiegoSouza7/WikiPiece/blob/master/Animated%20GIF-downsized_large.gif)

# Banco de dados utilizado:
:elephant: PostgreSQL

# Dependências Backend:

- **Express** para criação do servidor usando node.js
- **Multer** para trabalhar com o upload de imagens.
- **MulterS3** para trabalhar com o upload de imagens do serviço S3 da AWS.
- **Knex** para facilitar a criação de querys da aplicação.
- **Jsonwebtoken** para validar as sessões de usuários.
- **Dotenv** para salvar as variaveis ambiente da aplicação.
- **Nodemailer** para enviar email para os usuários. Todos os emails de recuperação de senha serão enviados para sua conta no Mailtrap que pode ser criada no site: https://mailtrap.io/

# Dependências Frontend:

- **Unform** para facilitar a criação de formulários.
- **Axios** para a conexão com a api.
- **Yup** para as validações dos inputs.

# Observações do projeto:

- Toda a ideia do site foi criada inicialmente para ser administrada por poucas pessoas, por esse motivo não foi criado páginas no frontend e rotas no backend para criar e apagar usuários. A criação de usuários deve ser feita por query no banco de dados usado, após isso deve entrar na página de login e acessar a opção de esqueci a senha, informar o e-mail e alterar a senha, pois, a aplicação espera uma senha criptografada do banco de dados impossibilitando o acesso de um novo usuário sem alterar a senha após a criação por query.
- A aplicação pode usar o serviço S3 da AWS para salvar a imagens ou pode salva-las localmente.
- Os arquivos .env.exemple possui todas as variáveis ambientes que a aplicação utiliza.

# Variáveis Ambiente:

**Frontend**

- REACT_APP_API_URL= Endereço que a api node esta utilizando.

**Backend**

- PORT= porta que o servidor irá rodar.
- ACEPT_CORS= url da aplicação frontend.
- PG_CONNECTION_STRING= url do banco de dados PostgreSQL. Essa url deve conter os dados do banco de dados como nome, senha e endereço.
- APP_URL= a url da api backend. 
- STORAGE_TYPE= 's3' para utilizar o serviço de salvar imagens da S3 e 'local' para salvar as imagens localmente na pasta tmp/uploads

- As variáveis: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY e AWS_DEFAULT_REGION devem ser preenchidas com as informações de seu bucket criado na AWS.

- JWT_KEY= é uma key única da aplicação. É de sua escolha o que colocar nesse campo.

- As variáveis: MAILER_HOST, MAILER_PORT, MAILER_USER e MAILER_PASS devem ser preenchidas com os dados de integração do inbox de sua conta no Mailtrap.


# Como inicializar o projeto:

- Abra o backend e o frontend separados.
- Dentro da pasta do Backend utilize o comando 'npm install' para baixar todas as dependências do projeto.
- Dentro da pasta do frontend utilize o comando 'npm install' para baixar todas as dependências do projeto.
- Altere o nome dos arquivos .env.exemple do backend e do frontend para .env.
- após os '=' das variáveis, informe os dados das variáveis sem utilizar o espaço.
- Todos os dados informando sobre cada variável esta no tópico de Variáveis Ambientes.
- Utilize o comando 'npm start' no backend para ligar a api.
- Utilize o comando 'npm start' no frontend para abrir a aplicação no seu navegador.
- Utilize as query do arquivo database.sql do backend para criar o banco de dados da aplicação.
- Para ter acesso à área administrativa, deve ser criar um usuário e senha com query no banco de dados e após isso, entrar na rota /login da aplicação e alterar a senha do usuário criado para então utilizar o mesmo para logar na aplicação. Obs: Faça isso apenas se nunca alterou a senha desse usuário após sua criação.
