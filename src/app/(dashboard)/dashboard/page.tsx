'use client';

import { useTheme } from '@/src/contexts/ThemeContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';

export default function DashboardPage() {
  const { theme } = useTheme();

  const styles = {
    light: {
      background: 'bg-neutral-50',
      header: 'text-black',
      subtitle: 'text-neutral-600',
      card: 'bg-white border border-neutral-200 rounded-3xl',
      cardHover: 'hover:shadow-lg hover:border-neutral-300',
      statsCard: 'bg-gradient-to-br from-white to-neutral-50 border border-neutral-200',
      bigCard: 'bg-white border border-neutral-200',
      statValue: 'text-black',
      statLabel: 'text-neutral-500',
      statChange: 'text-neutral-600',
      statChangePositive: 'text-green-600 bg-green-50',
      statChangeNegative: 'text-red-600 bg-red-50',
      iconBg: 'bg-neutral-100',
      iconColor: 'text-neutral-700',
      emptyIcon: 'text-neutral-300',
      emptyTitle: 'text-black',
      emptyText: 'text-neutral-500',
      badge: 'bg-neutral-100 text-neutral-700',
      chartLine: 'stroke-neutral-300',
    },
    dark: {
      background: 'bg-black',
      header: 'text-white',
      subtitle: 'text-neutral-400',
      card: 'bg-neutral-900 border border-neutral-800 rounded-3xl',
      cardHover: 'hover:shadow-2xl hover:border-neutral-700',
      statsCard: 'bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800',
      bigCard: 'bg-neutral-900 border border-neutral-800',
      statValue: 'text-white',
      statLabel: 'text-neutral-400',
      statChange: 'text-neutral-300',
      statChangePositive: 'text-green-400 bg-green-950/30',
      statChangeNegative: 'text-red-400 bg-red-950/30',
      iconBg: 'bg-neutral-800',
      iconColor: 'text-neutral-300',
      emptyIcon: 'text-neutral-700',
      emptyTitle: 'text-white',
      emptyText: 'text-neutral-500',
      badge: 'bg-neutral-800 text-neutral-300',
      chartLine: 'stroke-neutral-700',
    },
  };

  const currentStyles = styles[theme];

  const stats = [
    {
      name: 'Total Tarjetas',
      value: '156',
      change: '+12.5%',
      trend: 'up',
      icon: CreditCard,
      color: 'blue',
    },
    {
      name: 'Clientes Activos',
      value: '89',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      name: 'Movimientos Hoy',
      value: '1,247',
      change: '-3.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'green',
    },
    {
      name: 'Valor Total',
      value: '$45,231',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'yellow',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'Nueva tarjeta registrada', time: 'Hace 5 min', user: 'Juan Pérez' },
    { id: 2, action: 'Movimiento procesado', time: 'Hace 12 min', user: 'María García' },
    { id: 3, action: 'Cliente actualizado', time: 'Hace 28 min', user: 'Carlos Ruiz' },
    { id: 4, action: 'Tarjeta desactivada', time: 'Hace 1 hora', user: 'Ana López' },
  ];

  const quickStats = [
    { label: 'Tarjetas Activas', value: '142', icon: Activity },
    { label: 'Pendientes', value: '14', icon: Package },
    { label: 'Este Mes', value: '2,341', icon: Calendar },
  ];

  return (
    <div className="space-y-8 max-w-[1800px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`${currentStyles.header} text-4xl font-bold mb-2`}>
            Panel de Control (Demo)
          </h1>
          <p className={currentStyles.subtitle}>
            Bienvenido de nuevo, aquí está tu resumen de hoy 
          </p>
        </div>
        <div className="flex gap-3">
          <button className={`${currentStyles.badge} px-4 py-2 rounded-xl text-sm font-medium transition-all`}>
            <Calendar className="w-4 h-4 inline mr-2" />
            Hoy
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${currentStyles.statsCard} ${currentStyles.cardHover} p-6 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${currentStyles.iconBg} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`${currentStyles.iconColor} w-6 h-6`} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  stat.trend === 'up' ? currentStyles.statChangePositive : currentStyles.statChangeNegative
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className={`${currentStyles.statValue} text-3xl font-bold mb-1`}>
                  {stat.value}
                </p>
                <p className={`${currentStyles.statLabel} text-sm font-medium`}>
                  {stat.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`${currentStyles.card} ${currentStyles.cardHover} p-4 transition-all duration-300`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`${currentStyles.iconColor} w-5 h-5`} />
                <div>
                  <p className={`${currentStyles.statLabel} text-xs font-medium`}>
                    {item.label}
                  </p>
                  <p className={`${currentStyles.statValue} text-xl font-bold`}>
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area - Takes 2 columns */}
        <div className={`lg:col-span-2 ${currentStyles.bigCard} rounded-3xl p-8 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`${currentStyles.header} text-xl font-semibold mb-1`}>
                Análisis de Actividad
              </h2>
              <p className={`${currentStyles.subtitle} text-sm`}>
                Resumen de los últimos 7 días
              </p>
            </div>
          </div>
          
          {/* Empty State with better design */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className={`${currentStyles.iconBg} p-6 rounded-3xl mb-6`}>
              <BarChart3 className={`${currentStyles.emptyIcon} w-16 h-16`} />
            </div>
            <h3 className={`${currentStyles.emptyTitle} text-lg font-semibold mb-2`}>
              Gráficos Próximamente
            </h3>
            <p className={`${currentStyles.emptyText} text-sm text-center max-w-sm`}>
              Los análisis visuales y gráficos interactivos estarán disponibles aquí
            </p>
          </div>
        </div>

        {/* Activity Feed - Takes 1 column */}
        <div className={`${currentStyles.bigCard} rounded-3xl p-6 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${currentStyles.header} text-lg font-semibold`}>
              Actividad Reciente
            </h2>
            <Activity className={`${currentStyles.iconColor} w-5 h-5`} />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`${currentStyles.card} ${currentStyles.cardHover} p-4 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${currentStyles.iconBg} p-2 rounded-xl`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${currentStyles.statValue} text-sm font-medium truncate`}>
                      {activity.action}
                    </p>
                    <p className={`${currentStyles.statLabel} text-xs mt-1`}>
                      {activity.user}
                    </p>
                    <p className={`${currentStyles.subtitle} text-xs mt-1`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info Card */}
      <div className={`${currentStyles.card} ${currentStyles.cardHover} p-6 transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`${currentStyles.iconBg} p-4 rounded-2xl`}>
              <Package className={`${currentStyles.iconColor} w-6 h-6`} />
            </div>
            <div>
              <h3 className={`${currentStyles.header} text-lg font-semibold mb-1`}>
                Sistema Funcionando Correctamente
              </h3>
              <p className={`${currentStyles.subtitle} text-sm`}>
                Todos los servicios operando normalmente
              </p>
            </div>
          </div>
          <div className={`${currentStyles.statChangePositive} px-4 py-2 rounded-xl text-sm font-semibold`}>
            100% Uptime
          </div>
        </div>
      </div>
    </div>
  );
}