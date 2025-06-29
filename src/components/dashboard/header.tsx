'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, RefreshCcw, Settings, LogOut, User, Users } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface HeaderProps {
  lastUpdated: Date;
  isLoading?: boolean;
}

export function Header({ lastUpdated, isLoading }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
            <Music className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Navigation and User Menu */}
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => window.location.href = '/manage-artists'}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Artists
          </Button>

          {/* Last Updated Badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-200/50">
            <RefreshCcw className={`h-4 w-4 text-purple-600 ${isLoading ? 'animate-spin' : ''}`} />
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Last updated:</span>
              <Badge variant="outline" className="ml-2 bg-white/80 border-purple-200 text-purple-700 font-medium">
                {formatDateTime(lastUpdated)}
              </Badge>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 