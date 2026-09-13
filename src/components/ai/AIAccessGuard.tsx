import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { AdminPermission } from "@/auth/permissions";
import { useAdminAuth } from "../AdminGuard";

export function AIAccessGuard({
  permission,
  children,
}: {
  permission: AdminPermission;
  children: ReactNode;
}) {
  const { permissions } = useAdminAuth();
  if (!permissions.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
