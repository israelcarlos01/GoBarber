import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class AppointmentController {
  // método de listagem que a gente usa por padrão
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      // calculo para listar de 20 em 20 registros
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { provider_id, date } = req.body;

    /*
      check if provider_id is a provider
    */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: 'you cannot create appointments with yourself' });
    }

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }
    /* essa constante irá guardar
       esse parseISO transforma a string em um objeto date do javascript,
       dai o objeto date pode ser usado dentro do método startOfHour
       esse método sempre pega a hora e zera os minutos e segundos.
    */
    const hourStart = startOfHour(parseISO(date));
    // verifica se a data é antes da data atual...
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'past date are not permitted' });
    }
    /* checkagem para saber se não já existe um agendamento no horario
       informado.
    */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    /*
      Notificar provedor de serviço.
    */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
