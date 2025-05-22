import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  username?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({
  username,
  className = "",
  size = "md",
}: UserAvatarProps) {
  const getUserInitials = () => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className="bg-primary/10 text-primary">
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
