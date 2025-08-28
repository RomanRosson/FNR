import React, { useState, useEffect } from "react";
import { Message } from "@/entities/Message";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Search, 
  Send,
  ArrowLeft,
  Users
} from "lucide-react";
import { format } from "date-fns";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [messagesData, userData] = await Promise.all([
        Message.list("-created_date"),
        User.me()
      ]);
      setCurrentUser(userData);
      
      // Group messages into conversations
      const conversationMap = {};
      messagesData.forEach(message => {
        const otherUserId = message.sender_id === userData.id ? message.recipient_id : message.sender_id;
        if (!conversationMap[otherUserId]) {
          conversationMap[otherUserId] = {
            userId: otherUserId,
            lastMessage: message,
            messages: []
          };
        }
        conversationMap[otherUserId].messages.push(message);
        if (new Date(message.created_date) > new Date(conversationMap[otherUserId].lastMessage.created_date)) {
          conversationMap[otherUserId].lastMessage = message;
        }
      });
      
      setConversations(Object.values(conversationMap));
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const message = await Message.create({
        sender_id: currentUser.id,
        recipient_id: selectedConversation.userId,
        content: newMessage,
        message_type: "text"
      });
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // Conversation List View
  if (!selectedConversation) {
    return (
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 rounded-xl"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {conversations.length > 0 ? (
            conversations.map((conversation, index) => (
              <Card 
                key={index}
                className="bg-zinc-900/50 border-zinc-800 hover:border-purple-500/30 transition-colors cursor-pointer"
                onClick={() => handleSelectConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-purple-500/30">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-purple-600 text-white font-bold">
                        U{conversation.userId.slice(-1)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">User {conversation.userId.slice(-4)}</h3>
                        <span className="text-xs text-zinc-400">
                          {format(new Date(conversation.lastMessage.created_date), "MMM d")}
                        </span>
                      </div>
                      
                      <p className="text-sm text-zinc-400 truncate">
                        {conversation.lastMessage.sender_id === currentUser.id ? "You: " : ""}
                        {conversation.lastMessage.content}
                      </p>
                    </div>

                    {!conversation.lastMessage.is_read && conversation.lastMessage.recipient_id === currentUser.id && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No conversations yet</h3>
                <p className="text-zinc-400 mb-6">Start connecting with other riders!</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Users className="w-4 h-4 mr-2" />
                  Find Riders
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedConversation(null)}
            className="text-zinc-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Avatar className="w-10 h-10 border-2 border-purple-500/30">
            <AvatarImage src="" />
            <AvatarFallback className="bg-purple-600 text-white font-bold">
              U{selectedConversation.userId.slice(-1)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-semibold text-white">User {selectedConversation.userId.slice(-4)}</h2>
            <p className="text-xs text-zinc-400">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.sender_id === currentUser.id;
          return (
            <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                isOwn 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-zinc-800 text-zinc-100'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-purple-100' : 'text-zinc-400'}`}>
                  {format(new Date(message.created_date), "h:mm a")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 rounded-xl"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}