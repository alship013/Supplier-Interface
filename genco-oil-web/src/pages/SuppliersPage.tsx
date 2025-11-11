import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockSuppliers } from '@/data/mockData';
import type { Supplier } from '@/types';
import { Plus, Search, Edit, Eye, MapPin, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';

const SuppliersPage: React.FC = () => {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'supplier' | 'farmer'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || supplier.type === filterType;
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return <Badge variant={type === 'supplier' ? 'default' : 'secondary'}>{type}</Badge>;
  };

  const SupplierDetailsDialog = ({ supplier }: { supplier: Supplier }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {supplier.name}
          {getTypeBadge(supplier.type)}
          {getStatusBadge(supplier.status)}
        </DialogTitle>
        <DialogDescription>
          Supplier and farmer details and performance metrics
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {supplier.email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {supplier.phone}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {supplier.location.address}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Registered: {new Date(supplier.registrationDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Reliability:</span>
              <span className="font-medium">{supplier.performance.reliability}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quality:</span>
              <span className="font-medium">{supplier.performance.quality}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery:</span>
              <span className="font-medium">{supplier.performance.delivery}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Quality:</span>
              <span className="font-medium">{supplier.averageQuality}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Volume & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {(supplier.totalVolume / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-muted-foreground">Total Volume (tons)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {supplier.contracts.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Contracts</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              supplier.complianceStatus === 'compliant' ? 'text-green-600' :
              supplier.complianceStatus === 'non-compliant' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {supplier.feedstockHistory.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Deliveries</div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
          Close
        </Button>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Supplier
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers & Farmers</h1>
          <p className="text-muted-foreground">Manage your supplier and farmer network</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier/Farmer</DialogTitle>
              <DialogDescription>
                Register a new supplier or farmer in the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Name</label>
                <Input id="name" className="col-span-3" placeholder="Enter name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">Email</label>
                <Input id="email" type="email" className="col-span-3" placeholder="Enter email" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">Phone</label>
                <Input id="phone" className="col-span-3" placeholder="Enter phone number" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="supplier">Suppliers</SelectItem>
            <SelectItem value="farmer">Farmers</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>
            {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Total Volume</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{getTypeBadge(supplier.type)}</TableCell>
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{supplier.email}</div>
                    <div>{supplier.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{supplier.location.address}</div>
                    <div className="text-muted-foreground">{supplier.location.region}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{(supplier.totalVolume / 1000).toFixed(1)}K tons</div>
                    <div className="text-sm text-muted-foreground">Quality: {supplier.averageQuality}%</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-12">Rel:</span>
                        <span className={`font-medium ${
                          supplier.performance.reliability >= 90 ? 'text-green-600' :
                          supplier.performance.reliability >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {supplier.performance.reliability}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-12">Qual:</span>
                        <span className={`font-medium ${
                          supplier.performance.quality >= 90 ? 'text-green-600' :
                          supplier.performance.quality >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {supplier.performance.quality}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSupplier && (
        <SupplierDetailsDialog supplier={selectedSupplier} />
      )}
    </div>
  );
};

export default SuppliersPage;