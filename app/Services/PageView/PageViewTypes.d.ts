import { DateTime } from 'luxon'

export type PageViewPayload = {
  visitorId: number
  pageId: number
  userAgentId?: number
  sessionEnd?: DateTime
  duration?: number
  referrer?: string
}
