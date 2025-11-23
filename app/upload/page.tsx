"use client";

import Image from "next/image";
import UploadImage from "@/components/UploadImage";
import { useState } from "react";

export default function UploadPage() {
  const [imageURL, setImageURL] = useState("");

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Şəkil Yüklə</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <UploadImage onUpload={(url) => setImageURL(url)} />

        {imageURL && (
          <div className="mt-6 space-y-4">
            <p className="text-green-600 font-semibold">✓ Şəkil uğurla yükləndi!</p>
            
            <div>
              <label className="block text-sm font-medium mb-2">Şəkil URL:</label>
              <input
                value={imageURL}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Önizləmə:</label>
              <div className="relative w-full max-w-md aspect-video">
                <Image
                  src={imageURL}
                  alt="Yüklənmiş şəkil"
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="rounded-lg shadow-lg object-cover"
                  quality={75}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
