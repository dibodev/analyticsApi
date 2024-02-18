import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
import PageView from 'App/Models/PageView'

export default class UserAgent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() // Example: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
  public userAgent: string | null

  @column() // Example: Chrome
  public browserName: string | null

  @column() // Example: 89.0.4389.82
  public browserVersion: string | null

  @column() // Example: en-US
  public browserLanguage: string | null

  @column() // Example: Windows
  public osName: string | null

  @column() // Example: 10
  public osVersion: string | null

  @column() // Example: Desktop
  public deviceType: string | null

  @hasMany(() => PageView)
  public pageViews: HasMany<typeof PageView>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
