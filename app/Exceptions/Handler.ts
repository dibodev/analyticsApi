import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { Exception } from '@adonisjs/core/build/standalone'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: Exception, ctx: HttpContextContract) {
    /**
     * Self-handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send({ message: error.message })
    }

    // Call the report method on custom exceptions
    if (error instanceof NotFoundException) {
      error.report(error)
    }

    /**
     * Forward the rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
