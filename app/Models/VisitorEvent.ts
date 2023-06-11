import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@adonisjs/lucid/build/src/Orm/Decorators'
import Visitor from 'App/Models/Visitor'
import Project from 'App/Models/Project'

export default class VisitorEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public visitorId: number

  @column()
  public projectId: number

  @column()
  public browser: string | null

  @column()
  public os: string | null

  @column()
  public url: string | null

  @column()
  public deviceType: string | null

  @column()
  public referrer: string | null

  @belongsTo(() => Visitor)
  public visitor: BelongsTo<typeof Visitor>

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
