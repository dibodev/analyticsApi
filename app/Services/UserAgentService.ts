import UserAgent from 'App/Models/UserAgent'

export type UserAgentPayload = {
  userAgent?: string
  browserName?: string
  browserVersion?: string
  browserLanguage?: string
  osName?: string
  osVersion?: string
  deviceType?: string
}

/**
 * A class that provides methods for handling user agent operations.
 * @class
 */
export default class UserAgentService {
  /**
   * Creates a new UserAgent instance.
   *
   * @param {UserAgentPayload} userAgentPayload - The payload object containing the necessary data for creating a UserAgent.
   * @return {Promise<UserAgent>} - A Promise that resolves to a new UserAgent instance.
   */
  public static async create(userAgentPayload: UserAgentPayload): Promise<UserAgent> {
    return UserAgent.create(userAgentPayload)
  }
}
