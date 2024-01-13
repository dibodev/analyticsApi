import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: 'docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/swagger',
  specFilePath: 'docs/swagger/swagger.json',
  // middleware: Env.get('NODE_ENV') === 'development' || Env.get('NODE_ENV') === 'test' ? [] : ['auth'], // middlewares array, for protect your swagger docs and spec endpoints
  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Dibodev Analytics - API Documentation',
        version: packageJson.version,
      },
    },
    apis: ['app/**/*.ts', 'docs/swagger/**/*.yml', 'start/routes.ts'],
    mode:
      Env.get('NODE_ENV') === 'development' || Env.get('NODE_ENV') === 'test'
        ? 'RUNTIME'
        : 'PRODUCTION',
    basePath: '/',
  },
} as SwaggerConfig
