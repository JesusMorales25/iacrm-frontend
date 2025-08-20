import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, TrendingUp, Users, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/utils/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import jsPDF from "jspdf";
import "jspdf-autotable";
import type { jsPDF as jsPDFType } from "jspdf";
import * as XLSX from "xlsx";

// Tipos
interface ContactoReciente {
  id: string | number;
  nombre: string;
  numero_usuario: string;
  correo: string;
  categoria: string;
  ultima_interaccion: string;
  total_conversaciones: number;
}

interface ReportData {
  totales: {
    total_conversaciones: number;
    tasa_respuesta: number;
    total_mensajes: number;
    contactos_activos: number;
  };
  mensajes_por_dia: { fecha: string; total_mensajes: number }[];
  contactos_recientes: ContactoReciente[];
}

// Colores para badges
const categoriaColors: Record<string, string> = {
  prospecto: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  curioso: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  registro: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function Reports() {
  const today = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  const [dateFrom, setDateFrom] = useState(fifteenDaysAgo);
  const [dateTo, setDateTo] = useState(today);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<ReportData>("/api/reportes/metricas", {
          params: {
            fechaInicio: dateFrom.toISOString().split("T")[0],
            fechaFin: dateTo.toISOString().split("T")[0],
          },
        });
        setReportData(res.data);
      } catch (err: unknown) {
        console.error("Error al cargar métricas:", err);
        if (typeof err === "object" && err !== null && "response" in err) {
          // @ts-expect-error - err may have a response property from Axios error object
          setError(err.response?.data?.message || "Error al cargar métricas");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar métricas");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateFrom, dateTo]);

  if (loading) return <p>Cargando métricas...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!reportData) return <p>No hay datos para mostrar</p>;

  const { totales, mensajes_por_dia, contactos_recientes } = reportData;

  // Funciones de exportación
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Contactos Recientes", 14, 16);

    const tableColumn = ["Nombre", "Número", "Correo", "Categoria", "Última Interacción", "Total Conversaciones"];
    const tableRows = contactos_recientes.map((c) => [
      c.nombre,
      c.numero_usuario,
      c.correo,
      c.categoria,
      c.ultima_interaccion ? new Date(c.ultima_interaccion).toLocaleString() : "-",
      c.total_conversaciones ?? 0
    ]);

    // @ts-expect-error: autoTable is added by jspdf-autotable plugin
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("reportes.pdf");
  };

  const handleExportExcel = () => {
    if (!reportData) return;

    const wsData = contactos_recientes.map((c) => ({
      Nombre: c.nombre,
      Número: c.numero_usuario,
      Correo: c.correo,
      Categoria: c.categoria,
      "Última Interacción": c.ultima_interaccion ? new Date(c.ultima_interaccion).toLocaleString() : "-",
      "Total Conversaciones": c.total_conversaciones ?? 0
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contactos");
    XLSX.writeFile(wb, "reportes.xlsx");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Reportes y Métricas</h1>
          <p className="text-gray-500">Análisis de conversaciones</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg mb-1">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Fecha de inicio</label>
              <DatePicker
                selected={dateFrom}
                onChange={(date: Date) => setDateFrom(date)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium block">Fecha de fin</label>
              <DatePicker
                selected={dateTo}
                onChange={(date: Date) => setDateTo(date)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{ icon: <MessageSquare className="h-8 w-8 text-primary" />, value: totales.total_conversaciones, label: "Total Conversaciones" },
          { icon: <TrendingUp className="h-8 w-8 text-primary" />, value: `${totales.tasa_respuesta.toFixed(1)}%`, label: "Tasa de Respuesta" },
          { icon: <MessageSquare className="h-8 w-8 text-primary" />, value: totales.total_mensajes, label: "Mensajes Enviados" },
          { icon: <Users className="h-8 w-8 text-primary" />, value: totales.contactos_activos, label: "Contactos Activos" }
        ].map((card, idx) => (
          <Card key={idx}>
            <CardContent className="p-6 flex items-center space-x-4">
              {card.icon}
              <div>
                <p className="text-2xl font-bold mb-1">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Mensajes Enviados por Día</CardTitle>
          <CardDescription>Volumen de mensajes durante el período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mensajes_por_dia?.map((d) => ({ date: d.fecha, messages: d.total_mensajes })) || []}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-gray-500"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("es-ES", { month: "short", day: "numeric" })
                  }
                />
                <YAxis className="text-gray-500" />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString("es-ES")}
                  formatter={(value) => [value, "Mensajes"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Contactos Recientes</CardTitle>
          <CardDescription>Últimos contactos y sus métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Número</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Categoria</th>
                  <th className="px-4 py-2 text-left">Última Interacción</th>
                  <th className="px-4 py-2 text-left">Total Conversaciones</th>
                </tr>
              </thead>
              <tbody>
                {contactos_recientes?.map((c) => (
                  <tr key={c.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{c.nombre}</td>
                    <td className="px-4 py-2">{c.numero_usuario}</td>
                    <td className="px-4 py-2">{c.correo}</td>
                    <td className="px-4 py-2">
                      <Badge className={categoriaColors[c.categoria.toLowerCase()] || "bg-gray-100 text-gray-800"}>
                        {c.categoria}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{c.ultima_interaccion ? new Date(c.ultima_interaccion).toLocaleString() : "-"}</td>
                    <td className="px-4 py-2">{c.total_conversaciones ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
