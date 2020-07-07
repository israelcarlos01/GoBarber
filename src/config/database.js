module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    // cria duas linhas na tabela updatedAt e createdAt
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
