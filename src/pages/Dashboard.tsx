import { Users, MessageCircle, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ConversationsChart } from "@/components/ConversationsChart";
import { LeadsChart } from "@/components/LeadsChart";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/utils/axios";

// Tipos de datos esperados desde la API
type LeadPorEstado = {
  categoria: string;
  total: number;
};

type ConversacionPorDia = {
  dia: string;
  total_conversaciones: number;
};

export const Dashboard = () => {
  const [leads, setLeads] = useState(0);
  const [leadsPorEstado, setLeadsPorEstado] = useState<LeadPorEstado[]>([]);
  const [conversacionesHoy, setConversacionesHoy] = useState(0);
  const [contactos, setContactos] = useState(0);
  const [tiempoPromedio, setTiempoPromedio] = useState(0);
  const [conversacionesPorDia, setConversacionesPorDia] = useState<ConversacionPorDia[]>([]);
	const [totalContactos, setTotalContactos] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ✅ Tipamos cada solicitud con el tipo de dato esperado
        const [leadsHoyRes, leadsEstadoRes, conversHoyRes, conversDiaRes, tiempoRespRes, totalContac] = await Promise.all([
					api.get<{ total: number }>("/api/leads/total-hoy"),
					api.get<LeadPorEstado[]>("/api/leads/por-estado"),
					api.get<number>("/api/conversaciones/hoy"),
					api.get<ConversacionPorDia[]>("/api/conversaciones/por-dia"),
					api.get<{ tiempo_promedio_min: number }>("/api/conversaciones/tiempo-promedio-respuesta"),
					api.get<number>("/api/conversaciones/total-contactos")
				]);

        // ✅ Ahora no hay conflicto con los setters
        setLeads(typeof leadsHoyRes.data.total === "number" ? leadsHoyRes.data.total : 0);
        setLeadsPorEstado(leadsEstadoRes.data);
        setConversacionesHoy(conversHoyRes.data);
        setConversacionesPorDia(conversDiaRes.data);
        setTiempoPromedio(
					typeof tiempoRespRes.data.tiempo_promedio_min === "number"
						? tiempoRespRes.data.tiempo_promedio_min
						: 0
				);
				setTotalContactos(typeof totalContac.data === "number" ? totalContac.data : 0);

      } catch (error) {
        console.error("Error cargando datos del dashboard", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de actividad de tu plataforma WhatsApp CRM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Leads nuevos"
          value={leads}
          description="Desde ayer"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Conversaciones de hoy"
          value={conversacionesHoy}
          description="En tiempo real"
          icon={MessageCircle}
          trend={{ value: 8.2, isPositive: true }}
          variant="info"
        />
        <StatCard
          title="Contactos registrados"
          value={totalContactos}
          description="Total acumulado"
          icon={TrendingUp}
          trend={{ value: 15.3, isPositive: true }}
          variant="success"
        />
				<StatCard
				title="Tiempo promedio de respuesta del bot"
				value={
					typeof tiempoPromedio === "number" && !isNaN(tiempoPromedio)
						? `${tiempoPromedio.toFixed(2)} min`
						: "N/A"
				}
				description="Últimas 24h"
				icon={Clock}
				trend={{ value: -15.2, isPositive: false }}
				variant="warning"
			/>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 lg:gap-6">
        <ConversationsChart data={conversacionesPorDia} />
        <LeadsChart data={leadsPorEstado} />
      </div>
    </div>
  );
};
