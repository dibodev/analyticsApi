import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional(),
    domain: schema.string.optional({}, [
      rules.unique({
        table: 'projects',
        column: 'domain',
        whereNot: { id: this.ctx.params.id },
      }),
    ]),
  })

  public messages: CustomMessages = {
    'domain.unique': 'This domain is already in use by another project',
  }
}
