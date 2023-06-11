import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DataValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    projectId: schema.number(),
    data: schema.object().members({
      userAgent: schema.string(),
      url: schema.string(),
      referrer: schema.string.nullable(),
    }),
  })
}
