import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockFeedstockRecords, mockSuppliers } from '@/data/mockData';
import { FeedstockRecord } from '@/types';
import { Plus, Search, Eye, CheckCircle, XCircle, Clock, MapPin, Calendar, TrendingUp, AlertCircle, Camera, FileText, Truck } from 'lucide-react';

const FieldOperationsPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<FeedstockRecord[]>(mockFeedstockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<FeedstockRecord | null>(null);
  const [isTrackDeliveryOpen, setIsTrackDeliveryOpen] = useState(false);

  const filteredDeliveries = deliveries.filter(delivery => {
    const supplier = mockSuppliers.find(s => s.id === delivery.supplierId);
    const matchesSearch = supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      pending: 'outline',
      rejected: 'destructive'
    };
    const icons: Record<string, React.ReactNode> = {
      approved: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const getQualityScore = (quality: FeedstockRecord['quality']) => {
    const purityWeight = 0.5;
    const moistureWeight = 0.3;
    const contaminationWeight = 0.2;

    const moistureScore = Math.max(0, 100 - quality.moisture * 5);
    const purityScore = quality.purity;
    const contaminationScore = Math.max(0, 100 - quality.contamination * 10);

    return Math.round(
      purityScore * purityWeight +
      moistureScore * moistureWeight +
      contaminationScore * contaminationWeight
    );
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApproveDelivery = (deliveryId: string) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? { ...d, status: 'approved' as const, certificateUrl: `/certificates/${deliveryId}.pdf` }
          : d
      )
    );
  };

  const handleRejectDelivery = (deliveryId: string) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? { ...d, status: 'rejected' as const }
          : d
      )
    );
  };

  const DeliveryDetailsDialog = ({ delivery }: { delivery: FeedstockRecord }) => {
    const supplier = mockSuppliers.find(s => s.id === delivery.supplierId);
    const qualityScore = getQualityScore(delivery.quality);

    return (
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Delivery Details
            {getStatusBadge(delivery.status)}
          </DialogTitle>
          <DialogDescription>
            Feedstock delivery information and quality metrics
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {new Date(delivery.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {delivery.location}
              </div>
              <div className="text-sm">
                <div className="font-medium">Supplier:</div>
                <div className="text-muted-foreground">{supplier?.name}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Volume:</div>
                <div className="text-muted-foreground">{delivery.volume.toLocaleString()} tons</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Moisture:</span>
                <span className={`font-medium ${
                  delivery.quality.moisture <= 1 ? 'text-green-600' :
                  delivery.quality.moisture <= 1.5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delivery.quality.moisture}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Purity:</span>
                <span className={`font-medium ${
                  delivery.quality.purity >= 95 ? 'text-green-600' :
                  delivery.quality.purity >= 90 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delivery.quality.purity}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contamination:</span>
                <span className={`font-medium ${
                  delivery.quality.contamination <= 0.3 ? 'text-green-600' :
                  delivery.quality.contamination <= 0.5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delivery.quality.contamination}%
                </span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="font-medium">Overall Score:</span>
                <span className={`font-bold ${getQualityColor(qualityScore)}`}>
                  {qualityScore}/100
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {delivery.photos.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Delivery Photos ({delivery.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {delivery.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {delivery.certificateUrl && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Download Quality Certificate
              </Button>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedDelivery(null)}>
            Close
          </Button>
          {delivery.status === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  handleRejectDelivery(delivery.id);
                  setSelectedDelivery(null);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  handleApproveDelivery(delivery.id);
                  setSelectedDelivery(null);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    );
  };

  const TrackDeliveryDialog = () => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Track New Delivery</DialogTitle>
        <DialogDescription>
          Record a new feedstock delivery from a supplier
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="supplier" className="text-right">Supplier</label>
          <Select>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {mockSuppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="volume" className="text-right">Volume (tons)</label>
          <Input id="volume" type="number" className="col-span-3" placeholder="Enter volume" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="location" className="text-right">Location</label>
          <Input id="location" className="col-span-3" placeholder="Enter collection point" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="moisture" className="text-right">Moisture (%)</label>
          <Input id="moisture" type="number" step="0.1" className="col-span-3" placeholder="Enter moisture percentage" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="purity" className="text-right">Purity (%)</label>
          <Input id="purity" type="number" step="0.1" className="col-span-3" placeholder="Enter purity percentage" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsTrackDeliveryOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsTrackDeliveryOpen(false)}>
          Record Delivery
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Field Operations</h1>
          <p className="text-muted-foreground">Track and manage feedstock deliveries</p>
        </div>
        <Dialog open={isTrackDeliveryOpen} onOpenChange={setIsTrackDeliveryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Track Delivery
            </Button>
          </DialogTrigger>
          <TrackDeliveryDialog />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
                <p className="text-2xl font-bold">{deliveries.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">
                  {deliveries.reduce((sum, d) => sum + d.volume, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Tracking</CardTitle>
          <CardDescription>
            {filteredDeliveries.length} {filteredDeliveries.length === 1 ? 'delivery' : 'deliveries'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => {
                const supplier = mockSuppliers.find(s => s.id === delivery.supplierId);
                const qualityScore = getQualityScore(delivery.quality);

                return (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      {new Date(delivery.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{supplier?.name}</TableCell>
                    <TableCell>{delivery.location}</TableCell>
                    <TableCell>
                      <div className="font-medium">{delivery.volume.toLocaleString()} tons</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="w-12">Score:</span>
                          <span className={`font-medium ${getQualityColor(qualityScore)}`}>
                            {qualityScore}/100
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-12">Purity:</span>
                          <span>{delivery.quality.purity}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {delivery.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveDelivery(delivery.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectDelivery(delivery.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDelivery && (
        <DeliveryDetailsDialog delivery={selectedDelivery} />
      )}
    </div>
  );
};

export default FieldOperationsPage;