import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
import Visitor from 'App/Models/Visitor'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() // Example: Europe
  public continent: string | null

  @column() // Example: EU
  public continent_code: string | null

  @column() // Example: France
  public country: string | null

  @column() // Example: FR
  public country_code: string | null

  @column() // Example: Île-de-France
  public region: string | null

  @column() // Example: IDF
  public region_code: string | null

  @column() // Example: Paris
  public city: string

  @column() // Example: 48.856614, 4.051056
  public latitude: number

  @column() // Example: 48.856614, 4.051056
  public longitude: number

  @column() // Example: 75000
  public postal: string | null

  @column() // Example: https://cdn.ipwhois.io/flags/fr.svg
  public flag_img_url: string | null

  @column() // Example: U+1F1EB U+1F1F7
  public flag_emoji: string | null

  @hasMany(() => Visitor)
  public visitors: HasMany<typeof Visitor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
