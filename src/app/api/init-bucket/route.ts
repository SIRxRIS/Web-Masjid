import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const bucketName = "images"; 

  const { data: list, error: listError } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = list?.some((bucket) => bucket.name === bucketName);

  if (bucketExists) {
    return NextResponse.json({ message: "Bucket sudah ada." });
  }

  const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
    public: true, 
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Bucket berhasil dibuat!" });
}
