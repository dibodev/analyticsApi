import type { MultipartFileContract, FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'
import Application from '@ioc:Adonis/Core/Application'

export default class UploadService {
  private static path = Application.tmpPath('uploads')
  public static async uploadFile(
    file: MultipartFileContract | null,
    validationsOptions?: FileValidationOptions
  ) {
    console.log({
      isValid: file?.isValid,
      size: file?.size,
      type: file?.type,
      validationsOptions,
    })
    if (!file) {
      return
    }
    // if (!file.isValid) {
    //   return file.errors
    // }

    await file.move(this.path)
  }
}
