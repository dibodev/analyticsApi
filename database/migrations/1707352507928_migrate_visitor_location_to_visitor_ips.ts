import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from '@ioc:Adonis/Lucid/Database'

type Visitor = {
  id: number
  visitor_ip_id: number | null
  project_id: number | null
  location_id: number | null
  created_at: string
  updated_at: string
}

type Location = {
  id: number
  continent: string | null
  continent_code: string | null
  country: string | null
  country_code: string | null
  region: string | null
  region_code: string | null
  city: string
  latitude: number
  longitude: number
  postal: string | null
  flag_img_url: string | null
  flag_emoji: string | null
  created_at: string
  updated_at: string
}

type VisitorIp = {
  id: number
  ip: string
  location_id: number | null
  type: string
  asn: number | null
  org: string | null
  isp: string | null
  domain: string | null
  created_at: string
  updated_at: string
}

export default class extends BaseSchema {
  protected visitorsTableName = 'visitors'
  protected visitorIpsTableName = 'visitor_ips'
  protected locationsTableName = 'locations'

  public async up() {
    const visitors: Array<Visitor> = await Database.from(this.visitorsTableName)
    for (const visitor of visitors) {
      if (visitor.location_id) {
        // Retrieve rental information
        const location: Location | null = await Database.from(this.locationsTableName)
          .where('id', visitor.location_id)
          .first()

        if (location) {
          try {
            // Create a new entry in visitor_ips
            const fakeIp: string = `0.0.0.${visitor.id}`

            await Database.insertQuery().table(this.visitorIpsTableName).insert({
              ip: fakeIp,
              location_id: location.id,
              type: 'IPv4',
              asn: null,
              org: null,
              isp: null,
              domain: null,
            })

            // Retrieve the created visitor_ip with the fake IP
            const createdVisitorIp: VisitorIp | null = await Database.from(this.visitorIpsTableName)
              .where('ip', fakeIp)
              .first()

            if (createdVisitorIp) {
              // Update visitor_ip_id in visitors
              await Database.from(this.visitorsTableName).where('id', visitor.id).update({
                visitor_ip_id: createdVisitorIp.id,
              })
            }
          } catch (error) {
            console.error('Error during database operation:', error)
          }
        }
      }
    }
  }

  public async down() {
    // No need to rollback
  }
}
