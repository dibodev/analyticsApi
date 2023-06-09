import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { HasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@adonisjs/lucid/build/src/Orm/Decorators'
import Location from 'App/Models/Location'
import VisitorEvent from 'App/Models/VisitorEvent'
import Project from 'App/Models/Project'

export default class Visitor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public visitorId: string

  @column()
  public projectId: number

  @column()
  public locationId: number | undefined

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @hasMany(() => VisitorEvent)
  public visitorEvents: HasMany<typeof VisitorEvent>

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
