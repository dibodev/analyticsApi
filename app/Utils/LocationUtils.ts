import getUnicodeFlagIcon from 'country-flag-icons/unicode'

export default class LocationUtils {
  public static getCountryFlag(countryCode: string): string {
    return getUnicodeFlagIcon(countryCode)
  }
}
