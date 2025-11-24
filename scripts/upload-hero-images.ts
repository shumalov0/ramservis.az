import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(filePath: string, bucketName: string, fileName: string) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`✅ Uploaded: ${fileName}`);
    console.log(`   URL: ${urlData.publicUrl}`);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting hero images upload to Supabase...\n');

  const bucketName = 'car-images';
  
  // Upload hero image (12.jpg)
  const heroImagePath = path.join(process.cwd(), 'public/cars/12.jpg');
  const heroUrl = await uploadImage(heroImagePath, bucketName, 'hero/hero-main.jpg');

  // Upload search/booking background image
  const searchImagePath = path.join(process.cwd(), 'public/cars/search.jpg');
  const searchUrl = await uploadImage(searchImagePath, bucketName, 'hero/booking-bg.jpg');

  console.log('\n📋 Summary:');
  console.log('Hero Image URL:', heroUrl);
  console.log('Booking BG URL:', searchUrl);
  
  console.log('\n✨ Upload complete!');
}

main();
