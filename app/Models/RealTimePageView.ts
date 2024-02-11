import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import PageView from 'App/Models/PageView'

export default class RealTimePageView extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pageViewId: number

  @belongsTo(() => PageView)
  public pageView: BelongsTo<typeof PageView>

  @column({
    serialize: (value: number | null): boolean => {
      return Boolean(value)
    },
  })
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
