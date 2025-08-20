import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/utils/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Phone } from "lucide-react";

// Tipo que viene del backend
interface LeadFromAPI {
  nombre: string;
  numeroUsuario: string;
  telefono: string;
  correo: string;
  categoria: string;
}

// Tipo que usa el componente para mostrar en tabla
interface Lead {
  id: string;
  name: string;
  phone: string;
  status: "curioso" | "registro" | "prospecto";
  createdAt: string;
  assignedAgent: string;
}

const statusColors = {
  curioso: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  registro: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  prospecto: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const statusLabels = {
  curioso: "Curioso",
  registro: "Registro",
  prospecto: "Prospecto"
};

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Llamada al backend usando tu cliente axios
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get<LeadFromAPI[]>("/api/leads/datos"); // <-- ajusta endpoint
        const data = res.data;

        // Mapear datos del backend al formato de tabla
        const mappedLeads: Lead[] = data.map((lead, index) => ({
          id: String(index + 1),
          name: lead.nombre,
          phone: lead.telefono,
          status: (lead.categoria?.toLowerCase() as "curioso" | "registro" | "prospecto") || "curioso",
          createdAt: new Date().toISOString(), // No viene en SP, puedes ajustar
          assignedAgent: lead.numeroUsuario || "Sin asignar"
        }));

        setLeads(mappedLeads);
      } catch (error) {
        console.error("Error al obtener los leads", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
		const name = lead.name || "";
		const phone = lead.phone || "";

		const matchesSearch =
			name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			phone.includes(searchTerm);

		const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

		return matchesSearch && matchesStatus;
	});


  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestión de Leads</h1>
          <p className="text-muted-foreground">Administra y da seguimiento a tus leads de WhatsApp</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="curioso">Curioso</SelectItem>
            <SelectItem value="registro">Registro</SelectItem>
            <SelectItem value="prospecto">Prospecto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-primary">
            {leads.filter(lead => lead.status === "curioso").length}
          </div>
          <div className="text-sm text-muted-foreground">Leads Curiosos</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-warning">
            {leads.filter(lead => lead.status === "registro").length}
          </div>
          <div className="text-sm text-muted-foreground">Registrados</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-success">
            {leads.filter(lead => lead.status === "prospecto").length}
          </div>
          <div className="text-sm text-muted-foreground">Prospectos</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Cargando leads...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Número usuario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha creación</TableHead>
                    <TableHead className="hidden lg:table-cell">Agente asignado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div>{lead.name}</div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {lead.assignedAgent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status]}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {lead.assignedAgent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron leads que coincidan con los filtros.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
