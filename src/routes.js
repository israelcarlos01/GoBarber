import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';
import ScheduleController from './app/controllers/ScheduleController';

// importação para testar a rota
// import User from './app/models/User';

const routes = new Router();
const upload = multer(multerConfig);
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
routes.post('/sessions', SessionController.store);
// só passa por esse middleware as rotas que vem depois dele
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
