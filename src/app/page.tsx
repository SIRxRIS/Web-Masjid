// src/app/page.tsx (Redirect ke admin login)
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect('/admin/login');
}