import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
import VisitorIp from 'App/Models/VisitorIp'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() // Example: Europe
  public continent: string | null

  @column() // Example: EU
  public continentCode: string | null

  @column() // Example: France
  public country: string | null

  @column() // Example: FR
  public countryCode: string | null

  @column() // Example: Île-de-France
  public region: string | null

  @column() // Example: IDF
  public regionCode: string | null

  @column() // Example: Paris
  public city: string

  @column() // Example: 48.856614, 4.051056
  public latitude: number

  @column() // Example: 48.856614, 4.051056
  public longitude: number

  @column() // Example: 75000
  public postal: string | null

  @column() // Example: https://cdn.ipwhois.io/flags/fr.svg
  public flagImgUrl: string | null

  @column() // Example: U+1F1EB U+1F1F7
  public flagEmoji: string | null

  @hasMany(() => VisitorIp)
  public visitorIps: HasMany<typeof VisitorIp>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
