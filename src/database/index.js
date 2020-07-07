import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  // o método init irá fazer a conexão com a base de dados e carregar os nossos models
  init() {
    this.connection = new Sequelize(databaseConfig);

    // percorre o array de models e chama o método init passando a conexão de cada um deles.
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
