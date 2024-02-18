import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
import Visitor from 'App/Models/Visitor'
import Page from 'App/Models/Page'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() // Example: epitalk.dibodev.com
  public domain: string

  @column() // Example: https://example.com/favicon.ico
  public favicon: string | null

  @column({
    serialize: (value: number | null): boolean => {
      return Boolean(value)
    },
  })
  public active: boolean | null

  @hasMany(() => Visitor)
  public visitors: HasMany<typeof Visitor>

  @hasMany(() => Page)
  public pages: HasMany<typeof Page>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
