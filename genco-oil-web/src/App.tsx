import React from 'react';
import {
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Activity,
  CheckCircle,
  Plus,
  Truck,
  Search,
  Bell,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import SuppliersPage from '@/pages/SuppliersPage';
import FieldOperationsPage from '@/pages/FieldOperationsPage';
import { mockDashboardStats } from '@/data/mockData';

const StatCard = ({ title, value, change, changeType, icon, color }: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold mb-2">{value}</p>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Header = () => (
  <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4 flex-1">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search suppliers, farmers, or documents..."
          className="pl-10"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon">
        <Moon className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </Button>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">Admin User</div>
          <div className="text-xs text-gray-500">System Administrator</div>
        </div>
        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
          A
        </div>
      </div>
    </div>
  </header>
);

const DashboardPage = () => {
  const statCards = [
    {
      title: 'Total Suppliers',
      value: mockDashboardStats.totalSuppliers.toLocaleString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Total Farmers',
      value: mockDashboardStats.totalFarmers.toLocaleString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Active Suppliers',
      value: mockDashboardStats.activeSuppliers.toLocaleString(),
      change: '+5%',
      changeType: 'increase' as const,
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-100'
    },
    {
      title: 'Total Volume (tons)',
      value: `${(mockDashboardStats.totalVolume / 1000).toFixed(1)}K`,
      change: '+15%',
      changeType: 'increase' as const,
      icon: <Package className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Average Quality',
      value: `${mockDashboardStats.averageQuality}%`,
      change: '+2%',
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Pending Registrations',
      value: mockDashboardStats.pendingRegistrations.toLocaleString(),
      change: '-3%',
      changeType: 'decrease' as const,
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-100'
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Supplier & Farmer Management Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start text-left">
                <div className="flex flex-col items-start">
                  <Plus className="w-6 h-6 text-primary-600 mb-2" />
                  <div className="font-semibold mb-1">Add New Supplier</div>
                  <div className="text-sm text-muted-foreground">Register a new supplier or farmer</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 justify-start text-left">
                <div className="flex flex-col items-start">
                  <Truck className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-semibold mb-1">Track Delivery</div>
                  <div className="text-sm text-muted-foreground">Record new feedstock delivery</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'delivery' ? 'bg-green-100' :
                    activity.type === 'registration' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'delivery' ? <Package className="w-4 h-4 text-green-600" /> :
                     activity.type === 'registration' ? <Plus className="w-4 h-4 text-blue-600" /> :
                     <CheckCircle className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{activity.entityName}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/field-operations" element={<FieldOperationsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;