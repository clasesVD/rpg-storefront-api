process.env = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: '3000',
  DATABASE_URL:'postgres://postgres:testdb@localhost:5432/rpg_storefront_test',
  LOG_LEVEL: 'debug',
  JWT_SECRET: 'testsecret',
  HOST: 'http://localhost'
}
