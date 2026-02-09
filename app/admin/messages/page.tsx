'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  MoreHorizontal,
  Eye,
  Phone,
  Calendar,
  ChevronDown,
  RefreshCw,
  Loader2,
  MessageSquare,
  X,
  User,
  Clock,
  CheckCircle,
  Filter,
  Inbox,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Pagination from '../components/Pagination';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  UNREAD: {
    label: 'Unread',
    color: 'bg-primary/10 text-primary border-primary/20',
    icon: Mail,
  },
  READ: {
    label: 'Read',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: MailOpen,
  },
  REPLIED: {
    label: 'Replied',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Reply,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Archive,
  },
};

const ITEMS_PER_PAGE = 15;

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const response = await fetch(`/api/admin/messages?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setTotalPages(data.pagination.totalPages);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchMessages();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setNotes(message.notes || '');
    setIsDetailsOpen(true);

    // Mark as read if unread
    if (message.status === 'UNREAD') {
      await updateMessageStatus(message.id, 'READ');
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, status: status as ContactMessage['status'] } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: status as ContactMessage['status'] } : null);
        }
        // Refresh to get updated unread count
        fetchMessages();
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!selectedMessage) return;

    try {
      setIsUpdating(true);
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMessage.id, notes }),
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(m => (m.id === selectedMessage.id ? { ...m, notes } : m))
        );
        setSelectedMessage(prev => prev ? { ...prev, notes } : null);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        setDeleteId(null);
        if (selectedMessage?.id === id) {
          setIsDetailsOpen(false);
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            Contact form submissions from your website
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={isLoading}
          className="w-fit"
        >
          <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Inbox className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{unreadCount}</p>
                <p className="text-xs text-gray-500">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100">
                <MailOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {messages.filter(m => m.status === 'READ').length}
                </p>
                <p className="text-xs text-gray-500">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-100">
                <Reply className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {messages.filter(m => m.status === 'REPLIED').length}
                </p>
                <p className="text-xs text-gray-500">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100">
                <Archive className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {messages.filter(m => m.status === 'ARCHIVED').length}
                </p>
                <p className="text-xs text-gray-500">Archived</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-10 bg-gray-50 border-0">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Messages</SelectItem>
                <SelectItem value="UNREAD">Unread</SelectItem>
                <SelectItem value="READ">Read</SelectItem>
                <SelectItem value="REPLIED">Replied</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">No messages yet</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              When visitors submit the contact form on your website, their messages will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => {
              const config = statusConfig[message.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={message.id}
                  onClick={() => handleViewMessage(message)}
                  className={cn(
                    'flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50',
                    message.status === 'UNREAD' && 'bg-primary/5'
                  )}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {message.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'font-medium text-[#1A1A1A]',
                        message.status === 'UNREAD' && 'font-semibold'
                      )}>
                        {message.name}
                      </span>
                      <Badge variant="outline" className={cn('text-xs', config.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{message.email}</p>
                    <p className={cn(
                      'text-sm text-gray-500 line-clamp-2',
                      message.status === 'UNREAD' && 'text-gray-700'
                    )}>
                      {message.message}
                    </p>
                  </div>

                  {/* Time & Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{formatDate(message.createdAt)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewMessage(message); }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {message.status !== 'REPLIED' && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateMessageStatus(message.id, 'REPLIED'); }}>
                            <Reply className="w-4 h-4 mr-2" />
                            Mark as Replied
                          </DropdownMenuItem>
                        )}
                        {message.status !== 'ARCHIVED' && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateMessageStatus(message.id, 'ARCHIVED'); }}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); setDeleteId(message.id); }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Message Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {selectedMessage?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A]">{selectedMessage?.name}</p>
                <p className="text-sm font-normal text-gray-500">{selectedMessage?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6 mt-4">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${selectedMessage.phone}`} className="hover:text-primary">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {formatFullDate(selectedMessage.createdAt)}
                </div>
              </div>

              <Separator />

              {/* Message Content */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[#1A1A1A] whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <Select
                  value={selectedMessage.status}
                  onValueChange={(value) => updateMessageStatus(selectedMessage.id, value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNREAD">Unread</SelectItem>
                    <SelectItem value="READ">Read</SelectItem>
                    <SelectItem value="REPLIED">Replied</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`mailto:${selectedMessage.email}?subject=Re: Your message to us`}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
              </div>

              <Separator />

              {/* Admin Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Internal Notes</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this message (only visible to admins)..."
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={saveNotes}
                    disabled={isUpdating || notes === (selectedMessage.notes || '')}
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMessage(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
