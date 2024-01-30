import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export interface VisitorTrackingData {
  url: string
  referrer: string | null
  domain: string
  userAgent: string | null
}

export default class VisitorTrackingDataValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    url: schema.string(),
    referrer: schema.string.nullable(),
    domain: schema.string(),
    userAgent: schema.string.nullable(),
  })
}
