import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@adonisjs/lucid/build/src/Orm/Decorators'
import Visitor from 'App/Models/Visitor'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public visitorId: number

  @column({
    serialize: (value: number) => {
      return Boolean(value)
    },
  })
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public sessionStart: DateTime

  @column.dateTime()
  public sessionEnd: DateTime | null

  @column()
  public visitDuration: number | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @belongsTo(() => Visitor)
  public visitor: BelongsTo<typeof Visitor>
}
