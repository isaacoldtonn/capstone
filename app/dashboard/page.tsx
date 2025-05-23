"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import useUserStore from "@/stores/useUserStore";
import InitUserStore from "@/components/init-user-store";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { clearUser, user } = useUserStore();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearUser();
    router.push("/sign-in");
  };

  useEffect(() => {
    if (user?.role === "admin") {
      router.push("/badges-management");
    }
  }, [user, router]);

  if (!user) return <InitUserStore />

  return (
    <>
      {user ? (
        <>
          <div className="flex w-full flex-1 flex-col gap-12">
            Dashboard Page
          </div>
          <div>
            Welcome {user!.username} ({user?.role}) - {user.user_id}
          </div>
          <button onClick={handleSignOut}>sign out</button>
        </>
      ) : (
        <InitUserStore />
      )}
    </>
  );
}
