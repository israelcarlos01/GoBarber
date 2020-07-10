import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // Campo Virtual é que nunca vai existir na base de dados...
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    /* addHook propriedade do Sequelize que permite que esse trecho do código
    seja executado antes que seja criado um usuário, recebe o usuario como
    parametro e consegue fazer alterações nele */
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        // esse 8 é a força da criptografia
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    // retorna o model que foi salvo aqui dentro
    return this;
  }

  // o metodo vai retornar true se as senhas baterem, caso n vai retornar falso.
  checkPassword(password) {
    // o método ta comparando a senha que o user informou com a que existe no banco.
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
