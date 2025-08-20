import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  MoreVertical,
  Search
} from "lucide-react";

// Mock data
const conversations = [
  {
    id: 1,
    name: "María González",
    phone: "+52 55 1234 5678",
    lastMessage: "Hola, necesito ayuda con mi pedido",
    time: "10:30",
    unread: 2,
    tags: ["VIP", "Frecuente"]
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    phone: "+52 55 8765 4321",
    lastMessage: "¿Cuándo llega mi envío?",
    time: "09:45",
    unread: 0,
    tags: ["Nuevo"]
  },
  {
    id: 3,
    name: "Ana Martínez",
    phone: "+52 55 2468 1357",
    lastMessage: "Gracias por la ayuda",
    time: "08:15",
    unread: 0,
    tags: ["Satisfecho"]
  },
  {
    id: 4,
    name: "Luis Hernández",
    phone: "+52 55 9876 5432",
    lastMessage: "Tengo una queja sobre el producto",
    time: "07:20",
    unread: 1,
    tags: ["Urgente"]
  }
];

const messages = [
  {
    id: 1,
    text: "Hola, necesito ayuda con mi pedido #12345",
    sender: "client",
    time: "10:25"
  },
  {
    id: 2,
    text: "Hola María, con gusto te ayudo. ¿Podrías decirme qué problema tienes con tu pedido?",
    sender: "agent",
    time: "10:27"
  },
  {
    id: 3,
    text: "No me ha llegado la confirmación de envío y ya pasaron 3 días",
    sender: "client",
    time: "10:28"
  },
  {
    id: 4,
    text: "Entiendo tu preocupación. Déjame revisar el estado de tu pedido. Un momento por favor.",
    sender: "agent",
    time: "10:29"
  },
  {
    id: 5,
    text: "Hola, necesito ayuda con mi pedido",
    sender: "client",
    time: "10:30"
  }
];

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.phone.includes(searchTerm)
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      console.log("Enviando mensaje:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-background">
        {/* Panel izquierdo - Lista de conversaciones */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
          {/* Header de conversaciones */}
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold mb-3">Chat en Vivo</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de conversaciones */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 mb-1 ${
                    selectedConversation?.id === conversation.id 
                      ? "bg-primary/10 border border-primary/20" 
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {conversation.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-wrap gap-1">
                          {conversation.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Panel derecho - Chat */}
        <div className="flex-1 flex flex-col hidden md:flex">
          {selectedConversation ? (
            <>
              {/* Header del chat */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedConversation.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{selectedConversation.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedConversation.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mensajes */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "agent" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "agent"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === "agent" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="pr-12"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-sm text-muted-foreground">
                  Elige una conversación del panel izquierdo para comenzar a chatear
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Vista móvil - Solo mostrar chat si hay conversación seleccionada */}
        {selectedConversation && (
          <div className="fixed inset-0 bg-background z-50 flex flex-col md:hidden">
            {/* Header del chat móvil */}
            <div className="p-4 border-b border-border flex items-center space-x-3 bg-card">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedConversation(null)}
              >
                ←
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {selectedConversation.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>

            {/* Mensajes móvil */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "agent" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg ${
                        message.sender === "agent"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === "agent" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input móvil */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Chat;