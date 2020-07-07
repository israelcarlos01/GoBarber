import { Router } from 'express';
import UserController from './app/controllers/UserController';
// importação para testar a rota
// import User from './app/models/User';

const routes = new Router();
// essa rota foi para testar, para ver se estava criando Usuário...
/* routes.get('/', async (req, res) => {
  // sempre que for usar o await a funcão deve ser assíncrona
  const user = await User.create({
    name: 'Israel Carlos',
    email: 'israel@gmail.com',
    password_hash: '12312415325251',
  });

  res.json(user);
}); */

routes.post('/users', UserController.store);

export default routes;
