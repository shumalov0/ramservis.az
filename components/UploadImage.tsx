"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UploadImage({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function uploadImage(e: any) {
    try {
      setUploading(true)
      const file = e.target.files[0]
      const fileName = `${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(fileName, file)

      if (error) throw error

      const publicURL = supabase.storage
        .from("car-images")
        .getPublicUrl(fileName).data.publicUrl

      onUpload(publicURL)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={uploadImage} />
      {uploading && <p>Uploading...</p>}
    </div>
  )
}
