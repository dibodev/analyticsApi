import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'
import PageView from 'App/Models/PageView'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() // Example: https://example.com/page
  public url: string

  @column() // Example: /page
  public endpoint: string | null

  @column()
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @hasMany(() => PageView)
  public pageViews: HasMany<typeof PageView>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
