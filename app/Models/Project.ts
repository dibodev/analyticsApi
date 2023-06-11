import { DateTime } from 'luxon'
import { column, BaseModel, hasMany } from '@ioc:Adonis/Lucid/Orm'
import VisitorEvent from 'App/Models/VisitorEvent'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public domain: string

  @hasMany(() => VisitorEvent)
  public visitorEvents: HasMany<typeof VisitorEvent>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
