import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import type { BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Visitor from 'App/Models/Visitor'
import Location from 'App/Models/Location'

export default class VisitorIp extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() // Example: 192.168.1.1
  public ip: string

  @column() // Example: IPv4
  public type: string

  @column() // Example: 36040
  public asn: number | null

  @column() // Example: Orange Mobile
  public org: string | null

  @column() // Example: Orange S.A.
  public isp: string | null

  @column() // Example: orange.cm
  public domain: string | null

  @column()
  public locationId: number | null

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @hasMany(() => Visitor)
  public visitors: HasMany<typeof Visitor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
