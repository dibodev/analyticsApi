import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Visitor from 'App/Models/Visitor'
import Page from 'App/Models/Page'
import UserAgent from 'App/Models/UserAgent'
import Event from 'App/Models/Event'

export default class PageView extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public visitorId: number

  @belongsTo(() => Visitor)
  public visitor: BelongsTo<typeof Visitor>

  @column()
  public pageId: number

  @belongsTo(() => Page)
  public page: BelongsTo<typeof Page>

  @column()
  public userAgentId: number | null

  @belongsTo(() => UserAgent)
  public userAgent: BelongsTo<typeof UserAgent>

  @column({
    serialize: (value: string): DateTime => {
      return DateTime.fromISO(value, { zone: 'utc' })
    },
  })
  public sessionStart: string

  @column({
    serialize: (value: string | null): DateTime | null => {
      if (value === null) {
        return null
      }
      return DateTime.fromISO(value, { zone: 'utc' })
    },
  })
  public sessionEnd: string

  @column()
  public duration: number

  @column() // Example: https://referrer.com
  public referrer: string | null

  @hasMany(() => Event)
  public events: HasMany<typeof Event>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
