import UserAgent from 'App/Models/UserAgent'
import NotFoundException from 'App/Exceptions/NotFoundException'

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
   * Finds an existing UserAgent based on the provided UserAgentPayload, or creates a new one if it does not exist.
   *
   * @param {UserAgentPayload} userAgentPayload - The payload containing the userAgent data to be searched or created.
   *
   * @returns {Promise<UserAgent>} - A Promise that resolves to the found or created UserAgent.
   *                                If an existing UserAgent is found, it is returned.
   *                                If a new UserAgent is created, it is returned.
   *
   * @throws {Error} - If there is an error while finding or creating the UserAgent.
   */
  public static async findOrCreate(userAgentPayload: UserAgentPayload): Promise<UserAgent> {
    try {
      return await UserAgentService.findByUserAgent(userAgentPayload.userAgent!)
    } catch (error) {
      if (error instanceof NotFoundException) {
        return await UserAgentService.create(userAgentPayload)
      }
      throw error
    }
  }

  /**
   * Finds a user agent by the given user agent string.
   *
   * @param {string} userAgentString - The user agent string to search for.
   * @return {Promise<UserAgent>} A promise that resolves to the found user agent.
   * @throws {NotFoundException} If the user agent is not found.
   */
  public static async findByUserAgent(userAgentString: string): Promise<UserAgent> {
    const userAgent: UserAgent | null = await UserAgent.findBy('user_agent', userAgentString)
    if (!userAgent) {
      throw new NotFoundException('User agent not found')
    }
    return userAgent
  }

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
