import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Package, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';

const TradingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trading & Sales</h1>
          <p className="text-muted-foreground">Manage trading operations and sales activities</p>
        </div>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          New Trade
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$2.4M</div>
            <p className="text-sm text-muted-foreground mt-2">+12% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Volume Traded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">15,420 MT</div>
            <p className="text-sm text-muted-foreground mt-2">+8% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">28</div>
            <p className="text-sm text-muted-foreground mt-2">3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Avg Price/Ton
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$156</div>
            <p className="text-sm text-muted-foreground mt-2">+5% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          Trading & Sales functionality will be available in the next update. This will include order management, pricing, buyer relationships, and sales analytics.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TradingPage;