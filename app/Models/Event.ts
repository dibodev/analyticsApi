import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import PageView from 'App/Models/PageView'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pageViewId: number

  @belongsTo(() => PageView)
  public pageView: BelongsTo<typeof PageView>

  @column() // Example: click, submit, etc.
  public eventType: string | null

  @column() // JSON describing the event, Example: {"clickId": "123", "value": "some value"}
  public eventData: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
