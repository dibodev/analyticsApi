import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export type CreateProjectSchema = {
  domain: string
}

export default class CreateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    domain: schema.string({}, [rules.unique({ table: 'projects', column: 'domain' })]),
  })

  public messages: CustomMessages = {
    'domain.required': 'Project domain is required',
    'domain.unique': 'This domain is already in use by another project',
  }
}
