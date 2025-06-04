// src/components/admin/layout/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditProfile from "./edit-profile";
import ProfileInfo from "./profile-info";

interface UserProfile {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  alamat: string;
  jabatan: string;
  role: string;
  avatarUrl: string;
}

interface ProfilePageProps {
  user: SupabaseUser;
  initialProfile: UserProfile;
}

export default function ProfilePage({
  user,
  initialProfile,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("informasi-pribadi");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserProfile>(initialProfile);

  const supabase = createClient();

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSaveProfile = (updatedData: UserProfile) => {
    setUserData(updatedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-full h-40 rounded-t-lg"></div>
            <div className="p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
        <div className="rounded-lg overflow-hidden border bg-card text-card-foreground">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-full h-40 relative p-0 m-0">
            <div className="absolute -bottom-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                <AvatarImage src={userData.avatarUrl || ""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(userData.namaLengkap)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-4 right-6 flex gap-2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                {userData.jabatan}
              </Badge>
              <Badge className="bg-purple-600 text-white px-3 py-1 text-xs font-medium dark:bg-purple-500">
                {userData.role}
              </Badge>
            </div>
          </div>

          {/* Profile Header */}
          <CardHeader className="pt-20 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {userData.namaLengkap}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  {userData.email}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profil
                </Button>
              )}
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="pb-6">
            {isEditing ? (
              <EditProfile
                user={user}
                userData={userData}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            ) : (
              <Tabs
                defaultValue="informasi-pribadi"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="informasi-pribadi" className="text-sm">
                    Informasi Profil
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="informasi-pribadi" className="mt-6">
                  <ProfileInfo userData={userData} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
