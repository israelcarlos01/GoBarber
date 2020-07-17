import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'only providers can load notifications' });
    }
    /* o método sort ordena por: data no caso do exemplo, e o find da um get
       em todos os users
       o limit, limita a quantidade de notificações por page
    */
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    // método do moongose, permite buscar no banco e alterar ao mesmo tempo.
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      // marca como lida a notification
      { read: true },
      // retorna a notificação atualizada
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
