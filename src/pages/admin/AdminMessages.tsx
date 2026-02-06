import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Trash2,
  CheckCheck,
  Loader2,
  Inbox,
  ExternalLink,
  Copy,
  Clock,
  User,
  AtSign,
} from "lucide-react";
import {
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  type ContactMessage,
} from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    const success = await markMessageAsRead(id);
    if (success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    }
  }

  async function handleDelete(id: string) {
    const success = await deleteContactMessage(id);
    if (success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  }

  async function handleMarkAllAsRead() {
    const unreadMessages = messages.filter((m) => !m.read);
    for (const message of unreadMessages) {
      await markMessageAsRead(message.id);
    }
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            Inbox
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Messages from your contact form, slantie!
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="shrink-0"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              When visitors send you messages through your contact form, they'll
              appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message List */}
          <Card className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto">
            <CardHeader>
              <CardTitle>All Messages ({messages.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) handleMarkAsRead(message.id);
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMessage?.id === message.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : message.read
                        ? "bg-muted/30 hover:bg-muted/50"
                        : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-semibold truncate">
                          {message.name}
                        </span>
                        {!message.read && (
                          <Badge variant="default" className="text-xs shrink-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <AtSign className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-sm text-primary font-medium truncate">
                          {message.email}
                        </span>
                      </div>
                      {message.subject && (
                        <p className="text-sm font-medium mt-1 truncate text-foreground/80">
                          {message.subject}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(message.created_at)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="lg:sticky lg:top-4 lg:h-fit">
            {selectedMessage ? (
              <>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="truncate">
                          {selectedMessage.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg">
                        <AtSign className="h-4 w-4 text-primary shrink-0" />
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-primary font-medium hover:underline truncate"
                        >
                          {selectedMessage.email}
                        </a>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(selectedMessage.email);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy email</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {!selectedMessage.read && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleMarkAsRead(selectedMessage.id)
                              }
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mark as read</TooltipContent>
                        </Tooltip>
                      )}
                      <AlertDialog>
                        <Tooltip>
                          <AlertDialogTrigger asChild>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                          </AlertDialogTrigger>
                          <TooltipContent>Delete message</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The message will be
                              permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(selectedMessage.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Received
                      </p>
                      <p className="text-sm">
                        {formatDate(selectedMessage.created_at)}
                      </p>
                    </div>
                    {selectedMessage.subject && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Subject
                        </p>
                        <p className="font-medium">{selectedMessage.subject}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Message
                      </p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <a href={`mailto:${selectedMessage.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Reply via Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a message to view details
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
