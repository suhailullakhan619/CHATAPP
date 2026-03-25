import { uploadData, getUrl } from "aws-amplify/storage"

export const uploadImages = {
  methods: {
    async uploadImagesMethod(file, userId) {

      try {

        const cleanName = file.name.replace(/\s+/g, "-")

        const imageKey = `assets/${userId}/${Date.now()}-${cleanName}`

        const uploadTask = uploadData({
          path: imageKey,
          data: file,
          options: {
            contentType: file.type
          }
        })

        await uploadTask.result

        return imageKey

      }
      catch (e) {
        console.error("failed to upload images", e)
        throw e
      }

    },
    async getUrlImagesMethod(key) {

      try {

        if (!key || typeof key !== "string") return null

        const result = await getUrl({
          path: key,
        })

        return result.url.toString()

      }
      catch (e) {
        console.error("failed to get image url:", e)
        return null
      }

    }
  },

}

