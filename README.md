# FeittoPDS-Backend

##Responsabilidades das camadas:

Controller: Recebe os dados da request, aplica as validações iniciais básicas, e chama a service que faz o que ela precisa.

Service: Faz a lógica da aplicação e chama a repository para acessar o banco

Repository: Acessa o banco e cria as querys necessárias