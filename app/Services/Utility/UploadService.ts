import * as fs from 'fs'
import * as path from 'path'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

/**
 * The UploadService class provides methods for uploading images to the server.
 */
export default class UploadService {
  private static publicPath: string = Application.publicPath()
  private static maxFileSize: number = 5 * 1024 * 1024 // 5 MB
  /**
   * Uploads an image to the server.
   *
   * @param {string | null} file - The image file path or null if no file is provided.
   * @param {string | null} contentType - The content type of the image or null if no file is provided.
   * @param {string} [name] - The name of the image. If not provided, a random name will be generated.
   * @returns {Promise<string | null>} - The URL of the uploaded image or null if an error occurred.
   * @throws {Error} - If the downloaded file is not an image or if the image size exceeds the maximum size.
   */
  public static async uploadImage(
    file: string | null,
    contentType: string | null,
    name?: string
  ): Promise<string | null> {
    if (!file || !contentType) {
      return null
    }
    if (!contentType.startsWith('image/')) {
      throw new Error('Downloaded file is not an image')
    }
    if (file.length > this.maxFileSize) {
      throw new Error(`Image size exceeds ${this.maxFileSize} MB limit`)
    }
    if (!name) {
      name = Math.random().toString(36).substring(2) + Date.now().toString(36)
    }
    const tmpFilePath: string = path.join(this.publicPath, `${name}.ico`)
    const apiUrl: string = Env.get('BASE_URL')

    const imageUrl: string = `${apiUrl}/${name}.ico`

    // File already exists
    if (fs.existsSync(tmpFilePath)) {
      return imageUrl
    }
    fs.writeFileSync(tmpFilePath, file)
    return imageUrl
  }
}
