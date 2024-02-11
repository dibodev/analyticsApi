import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
import VisitorIp from 'App/Models/VisitorIp'
import Project from 'App/Models/Project'
import PageView from 'App/Models/PageView'

export default class Visitor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public visitorIpId: number | null

  @belongsTo(() => VisitorIp)
  public visitorIp: BelongsTo<typeof VisitorIp>

  @column()
  public projectId: number | null

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @hasMany(() => PageView)
  public pageViews: HasMany<typeof PageView>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
