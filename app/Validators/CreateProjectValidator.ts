import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    domain: schema.string({}, [rules.unique({ table: 'projects', column: 'domain' })]),
  })

  public messages: CustomMessages = {
    'name.required': 'Project name is required',
    'domain.required': 'Project domain is required',
    'domain.unique': 'This domain is already in use by another project',
  }
}
