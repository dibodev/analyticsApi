import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DataValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    url: schema.string(),
    referrer: schema.string.nullable(),
    domain: schema.string(),
    userAgent: schema.string.nullable(),
  })
}
