import * as fs from 'fs'
import * as path from 'path'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default class UploadService {
  private static publicPath = Application.publicPath()
  private static maxFileSize = 5 * 1024 * 1024 // 5 MB
  public static async uploadImage(file: string | null, contentType: string | null, name?: string) {
    if (!file || !contentType) {
      return
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
    const tmpFilePath = path.join(this.publicPath, `${name}.ico`)
    const apiUrl = Env.get('BASE_URL')

    const imageUrl = `${apiUrl}/${this.publicPath}/${name}.ico`

    // File already exists
    if (fs.existsSync(tmpFilePath)) {
      return `${apiUrl}/${this.publicPath}/${name}.ico`
    }
    fs.writeFileSync(tmpFilePath, file)
    return imageUrl
  }
}
