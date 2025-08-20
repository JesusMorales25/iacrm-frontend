import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Clock, 
  Zap,
  Settings as SettingsIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickResponse {
  id: number;
  title: string;
  message: string;
}

interface WorkingHours {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const Settings = () => {
  const { toast } = useToast();
  
  // Estados para mensajes automáticos
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("¡Hola! Bienvenido a nuestro servicio de atención al cliente. ¿En qué podemos ayudarte hoy?");
  const [offHoursEnabled, setOffHoursEnabled] = useState(true);
  const [offHoursMessage, setOffHoursMessage] = useState("Gracias por contactarnos. Actualmente estamos fuera de horario de atención. Te responderemos lo antes posible.");

  // Estados para respuestas rápidas
  const [quickResponses, setQuickResponses] = useState<QuickResponse[]>([
    { id: 1, title: "Saludo", message: "¡Hola! ¿En qué puedo ayudarte?" },
    { id: 2, title: "Información de productos", message: "Te envío información sobre nuestros productos disponibles." },
    { id: 3, title: "Despedida", message: "¡Gracias por contactarnos! Que tengas un excelente día." },
  ]);
  const [newResponseTitle, setNewResponseTitle] = useState("");
  const [newResponseMessage, setNewResponseMessage] = useState("");
  const [editingResponse, setEditingResponse] = useState<number | null>(null);

  // Estados para horarios de atención
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: "Lunes", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "Martes", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "Miércoles", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "Jueves", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "Viernes", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "Sábado", enabled: false, startTime: "09:00", endTime: "14:00" },
    { day: "Domingo", enabled: false, startTime: "09:00", endTime: "14:00" },
  ]);

  const handleAddQuickResponse = () => {
    if (newResponseTitle.trim() && newResponseMessage.trim()) {
      const newResponse: QuickResponse = {
        id: Math.max(...quickResponses.map(r => r.id), 0) + 1,
        title: newResponseTitle.trim(),
        message: newResponseMessage.trim(),
      };
      setQuickResponses([...quickResponses, newResponse]);
      setNewResponseTitle("");
      setNewResponseMessage("");
      toast({
        title: "Respuesta rápida agregada",
        description: "La nueva respuesta rápida se ha guardado correctamente.",
      });
    }
  };

  const handleEditQuickResponse = (id: number) => {
    const response = quickResponses.find(r => r.id === id);
    if (response) {
      setNewResponseTitle(response.title);
      setNewResponseMessage(response.message);
      setEditingResponse(id);
    }
  };

  const handleUpdateQuickResponse = () => {
    if (editingResponse && newResponseTitle.trim() && newResponseMessage.trim()) {
      setQuickResponses(prev => 
        prev.map(r => 
          r.id === editingResponse 
            ? { ...r, title: newResponseTitle.trim(), message: newResponseMessage.trim() }
            : r
        )
      );
      setNewResponseTitle("");
      setNewResponseMessage("");
      setEditingResponse(null);
      toast({
        title: "Respuesta rápida actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
    }
  };

  const handleDeleteQuickResponse = (id: number) => {
    setQuickResponses(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Respuesta rápida eliminada",
      description: "La respuesta rápida se ha eliminado correctamente.",
    });
  };

  const handleWorkingHoursChange = (index: number, field: keyof WorkingHours, value: string | boolean) => {
    setWorkingHours(prev => 
      prev.map((hour, i) => 
        i === index ? { ...hour, [field]: value } : hour
      )
    );
  };

  const handleSaveConfiguration = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log("Guardando configuración...", {
      automaticMessages: {
        welcome: { enabled: welcomeEnabled, message: welcomeMessage },
        offHours: { enabled: offHoursEnabled, message: offHoursMessage }
      },
      quickResponses,
      workingHours
    });
    
    toast({
      title: "Configuración guardada",
      description: "Todos los cambios se han guardado correctamente.",
    });
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-7 w-7" />
              Configuración del Sistema
            </h1>
            <p className="text-muted-foreground">
              Configura mensajes automáticos, respuestas rápidas y horarios de atención
            </p>
          </div>
          <Button onClick={handleSaveConfiguration} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>

        {/* Mensajes Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mensajes Automáticos
            </CardTitle>
            <CardDescription>
              Configura los mensajes que se envían automáticamente a los clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mensaje de Bienvenida */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="welcome-enabled" className="text-base font-medium">
                    Mensaje de Bienvenida
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Se envía cuando un cliente inicia una conversación
                  </p>
                </div>
                <Switch
                  id="welcome-enabled"
                  checked={welcomeEnabled}
                  onCheckedChange={setWelcomeEnabled}
                />
              </div>
              {welcomeEnabled && (
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Escribe tu mensaje de bienvenida..."
                  className="min-h-[80px]"
                />
              )}
            </div>

            <Separator />

            {/* Mensaje Fuera de Horario */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="offhours-enabled" className="text-base font-medium">
                    Mensaje Fuera de Horario
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Se envía cuando un cliente escribe fuera del horario de atención
                  </p>
                </div>
                <Switch
                  id="offhours-enabled"
                  checked={offHoursEnabled}
                  onCheckedChange={setOffHoursEnabled}
                />
              </div>
              {offHoursEnabled && (
                <Textarea
                  value={offHoursMessage}
                  onChange={(e) => setOffHoursMessage(e.target.value)}
                  placeholder="Escribe tu mensaje fuera de horario..."
                  className="min-h-[80px]"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Respuestas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Respuestas Rápidas
            </CardTitle>
            <CardDescription>
              Gestiona frases frecuentes para agilizar las conversaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulario para agregar/editar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="response-title">Título de la respuesta</Label>
                <Input
                  id="response-title"
                  value={newResponseTitle}
                  onChange={(e) => setNewResponseTitle(e.target.value)}
                  placeholder="Ej: Saludo, Información, Despedida..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="response-message">Mensaje</Label>
                <Textarea
                  id="response-message"
                  value={newResponseMessage}
                  onChange={(e) => setNewResponseMessage(e.target.value)}
                  placeholder="Escribe el mensaje que se enviará..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="md:col-span-2">
                {editingResponse ? (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateQuickResponse} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Actualizar Respuesta
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingResponse(null);
                        setNewResponseTitle("");
                        setNewResponseMessage("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleAddQuickResponse} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Respuesta Rápida
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Lista de respuestas rápidas */}
            <div className="space-y-3">
              <h4 className="font-medium">Respuestas Configuradas</h4>
              {quickResponses.map((response) => (
                <div key={response.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{response.title}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{response.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditQuickResponse(response.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuickResponse(response.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horarios de Atención */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios de Atención
            </CardTitle>
            <CardDescription>
              Configura los días y horarios en que el equipo está disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workingHours.map((schedule, index) => (
                <div key={schedule.day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) => handleWorkingHoursChange(index, 'enabled', checked)}
                    />
                    <span className="font-medium w-20">{schedule.day}</span>
                  </div>
                  
                  {schedule.enabled && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Desde:</Label>
                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                        className="w-32"
                      />
                      <Label className="text-sm">Hasta:</Label>
                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                  
                  {!schedule.enabled && (
                    <Badge variant="secondary">Cerrado</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Settings;