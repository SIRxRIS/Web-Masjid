import { BackgroundLines } from "@/components/ui/background-lines";
import LoginForm from "@/components/admin/layout/login/LoginForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/admin/main/dashboard");
  }

  return (
    <BackgroundLines className="w-full min-h-svh">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative z-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <LoginForm />
        </div>
      </div>
    </BackgroundLines>
  );
}
