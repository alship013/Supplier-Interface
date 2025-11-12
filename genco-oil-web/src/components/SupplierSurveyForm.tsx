import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Upload, MapPin, Calendar, FileText, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
const format = (date: Date, fmt: string) => {
  return date.toISOString().split('T')[0]; // Simple date formatting for YYYY-MM-DD
};

interface PlotData {
  id: string;
  identifier: string;
  size: number;
  gpsCoordinates: string;
}

interface SurveyFormData {
  // Basic Information
  formId: string;
  uniqueSupplierId: string;
  surveyDate: string;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  plantationAddress: string;
  gpsCoordinate: string;

  // Land Status and Legality
  ownershipType: string;
  proofOfOwnership: string[];
  certificateNumber: string;
  legalStatusOfLand: string;
  currentBuyer: string;
  otherOwnershipDetails: string;
  otherLegalStatusDetails: string;

  // EUDR Compliance
  hasDeforestation: string;
  evidenceOfNoDeforestation: string;
  legalityChecklist: string[];
  proximityToIndigenous: string;
  landConflicts: string;
  harvestDateStart: string;
  harvestDateEnd: string;
  firstPointOfSale: string;
  plots: PlotData[];

  // ISCC Self Assessment
  isccLandUse: string;
  previousLandUse: string[];
  environmentalPractices: string[];
  healthSafetyChecklist: string[];
  workerRights: string[];
  grievanceMechanism: string;
  freedomOfAssociation: string;
  recordKeeping: string[];
  gapTraining: string;

  // Plantation Profile
  mainCropType: string;
  plantingYear: number;
  ageOfTrees: number;
  totalLandSize: number;
  estimatedYield: number;
  soilType: string;
  topography: string;
  farmingSystem: string;
  laborType: string[];
  permanentWorkers: number;
  seasonalWorkers: number;
  roadCondition: string;
  distance: number;
  accessCategory: string;
  waterSource: string;
  pestControlMethod: string;
  quantitySpecs: string;
  fertilizerUse: string;
  fertilizerUsageType: string;
  fertilizerBrandDetails: string;
  fertilizerMonths: string[];
  costFertilizer: number;
  costLabor: number;
  costTransport: number;
  peakSeasonStart: string;
  peakSeasonEnd: string;
  seedCollectionStart: string;
  seedCollectionEnd: string;
  fruitDevelopmentStart: string;
  fruitDevelopmentEnd: string;

  // Review and Submit
  finalNotes: string;
  observedRedFlags: string[];
  recommendedAction: string;
  reason: string;
  declaration: boolean;
  surveyorSignature: string;
  supplierSignature: string;
  dateVerified: string;
}

const SupplierSurveyForm: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<SurveyFormData>>({
    formId: `SUP-${Date.now()}`,
    uniqueSupplierId: `SUP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    surveyDate: format(new Date(), 'yyyy-MM-dd'),
    dateVerified: format(new Date(), 'yyyy-MM-dd'),
    plots: [{ id: '1', identifier: 'Plot 1', size: 0, gpsCoordinates: '' }],
    observedRedFlags: [],
    fertilizerMonths: [],
    proofOfOwnership: [],
    previousLandUse: [],
    environmentalPractices: [],
    healthSafetyChecklist: [],
    workerRights: [],
    recordKeeping: [],
    laborType: []
  });

  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File[]}>({});

  const updateFormData = (field: keyof SurveyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPlot = () => {
    const newPlot: PlotData = {
      id: Date.now().toString(),
      identifier: `Plot ${formData.plots?.length || 0 + 1}`,
      size: 0,
      gpsCoordinates: ''
    };
    setFormData(prev => ({
      ...prev,
      plots: [...(prev.plots || []), newPlot]
    }));
  };

  const updatePlot = (plotId: string, field: keyof PlotData, value: any) => {
    setFormData(prev => ({
      ...prev,
      plots: prev.plots?.map(plot =>
        plot.id === plotId ? { ...plot, [field]: value } : plot
      )
    }));
  };

  const removePlot = (plotId: string) => {
    setFormData(prev => ({
      ...prev,
      plots: prev.plots?.filter(plot => plot.id !== plotId)
    }));
  };

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (!files) return;

    const maxSize = 10 * 1024 * 1024; // 10MB per file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const validFiles = Array.from(files).filter(file => {
      // Check file size
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      // Check file type for PDF and images only
      if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
        alert(`File ${file.name} is not supported. Please use images, PDF, or DOCX files.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [category]: validFiles
      }));

      // Create preview for image files
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log('Image preview ready:', file.name);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const toggleArrayItem = (field: keyof SurveyFormData, item: string) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const getProgress = () => {
    const totalSections = 6;
    const completedSections = [1, 2, 3, 4, 5, 6].filter(num => {
      const sectionMap: {[key: number]: string} = {
        1: 'basic',
        2: 'land',
        3: 'eudr',
        4: 'iscc',
        5: 'plantation',
        6: 'review'
      };
      return currentTab === sectionMap[num] || (num === 1 && currentTab === 'basic');
    }).length;
    return (completedSections / totalSections) * 100;
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Uploaded files:', uploadedFiles);
    alert('Supplier survey form submitted successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Supplier & Plantation Survey Form
          </CardTitle>
          <CardDescription>
            Comprehensive supplier evaluation and compliance assessment
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Form Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
          <TabsTrigger value="land">2. Land Status</TabsTrigger>
          <TabsTrigger value="eudr">3. EUDR</TabsTrigger>
          <TabsTrigger value="iscc">4. ISCC</TabsTrigger>
          <TabsTrigger value="plantation">5. Plantation</TabsTrigger>
          <TabsTrigger value="review">6. Review</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General supplier and contact information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="formId">Form ID</Label>
                <Input id="formId" value={formData.formId} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniqueSupplierId">Unique Supplier ID</Label>
                <Input id="uniqueSupplierId" value={formData.uniqueSupplierId} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surveyDate">Survey Date</Label>
                <Input
                  id="surveyDate"
                  type="date"
                  value={formData.surveyDate}
                  onChange={(e) => updateFormData('surveyDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  placeholder="Enter supplier name"
                  value={formData.supplierName || ''}
                  onChange={(e) => updateFormData('supplierName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson || ''}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpsCoordinate">GPS Coordinates</Label>
                <Input
                  id="gpsCoordinate"
                  placeholder="Latitude, Longitude"
                  value={formData.gpsCoordinate || ''}
                  onChange={(e) => updateFormData('gpsCoordinate', e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="plantationAddress">Plantation Address</Label>
                <Textarea
                  id="plantationAddress"
                  placeholder="Enter complete plantation address"
                  rows={3}
                  value={formData.plantationAddress || ''}
                  onChange={(e) => updateFormData('plantationAddress', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Interactive Map Placeholder</span>
                  <Badge variant="outline">GPS: {formData.gpsCoordinate || 'Not set'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Land Status and Legality */}
        <TabsContent value="land" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Land Status and Legality</CardTitle>
              <CardDescription>Land ownership, legal documentation, and compliance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ownership Type</Label>
                  <Select value={formData.ownershipType || ''} onValueChange={(value) => updateFormData('ownershipType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="customary">Customary</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Legal Status of Land</Label>
                  <Select value={formData.legalStatusOfLand || ''} onValueChange={(value) => updateFormData('legalStatusOfLand', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="in_process">In Process</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proof of Ownership</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['SHM', 'HGB', 'HGU', 'HP', 'Girik', 'Adat', 'Other'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`proof-${type}`}
                        checked={formData.proofOfOwnership?.includes(type) || false}
                        onCheckedChange={() => toggleArrayItem('proofOfOwnership', type)}
                      />
                      <Label htmlFor={`proof-${type}`} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateNumber">Certificate Number</Label>
                  <Input
                    id="certificateNumber"
                    placeholder="Enter certificate number"
                    value={formData.certificateNumber || ''}
                    onChange={(e) => updateFormData('certificateNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Buyer (Competitor)</Label>
                  <Select value={formData.currentBuyer || ''} onValueChange={(value) => updateFormData('currentBuyer', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select buyer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="middleman">Middleman</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proofDocs">Proof of Ownership Documents</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload PDF documents</p>
                  <Input
                    id="proofDocs"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => handleFileUpload('proof', e.target.files)}
                    className="max-w-xs mx-auto"
                  />
                  {uploadedFiles.proof && (
                    <div className="mt-2 text-sm text-green-600">
                      {uploadedFiles.proof.length} file(s) uploaded
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: EUDR Compliance */}
        <TabsContent value="eudr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>EUDR Compliance</CardTitle>
              <CardDescription>European Union Deforestation Regulation compliance assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Has deforestation occurred since Dec 31, 2020?</Label>
                <RadioGroup value={formData.hasDeforestation || ''} onValueChange={(value) => updateFormData('hasDeforestation', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="deforest-yes" />
                    <Label htmlFor="deforest-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="deforest-no" />
                    <Label htmlFor="deforest-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidenceNoDeforest">Evidence of no deforestation</Label>
                <Textarea
                  id="evidenceNoDeforest"
                  placeholder="Provide evidence or notes about no deforestation"
                  rows={3}
                  value={formData.evidenceOfNoDeforestation || ''}
                  onChange={(e) => updateFormData('evidenceOfNoDeforestation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>EUDR Legality Checklist</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Land rights and use title verified and documented',
                    'No deforestation occurred after December 31, 2020',
                    'Legal land acquisition process followed',
                    'Required environmental permits obtained and valid',
                    'Social impact assessment conducted (if applicable)',
                    'Free, prior, and informed consent obtained (if applicable)',
                    'No conflicts with customary land rights',
                    'Compliance with national and local forestry laws'
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`legality-${item.replace(/\s+/g, '_').substring(0, 30)}`}
                        checked={formData.legalityChecklist?.includes(item) || false}
                        onCheckedChange={() => toggleArrayItem('legalityChecklist', item)}
                      />
                      <Label htmlFor={`legality-${item.replace(/\s+/g, '_').substring(0, 30)}`} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Proximity to Indigenous/local communities</Label>
                  <RadioGroup value={formData.proximityToIndigenous || ''} onValueChange={(value) => updateFormData('proximityToIndigenous', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="indig-yes" />
                      <Label htmlFor="indig-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="indig-no" />
                      <Label htmlFor="indig-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="indig-unsure" />
                      <Label htmlFor="indig-unsure">Unsure</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Known land conflicts/disputes</Label>
                  <RadioGroup value={formData.landConflicts || ''} onValueChange={(value) => updateFormData('landConflicts', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="conflict-yes" />
                      <Label htmlFor="conflict-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="conflict-no" />
                      <Label htmlFor="conflict-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="conflict-unsure" />
                      <Label htmlFor="conflict-unsure">Unsure</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="harvestStart">Harvest Date Start</Label>
                  <Input
                    id="harvestStart"
                    type="date"
                    value={formData.harvestDateStart || ''}
                    onChange={(e) => updateFormData('harvestDateStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestEnd">Harvest Date End</Label>
                  <Input
                    id="harvestEnd"
                    type="date"
                    value={formData.harvestDateEnd || ''}
                    onChange={(e) => updateFormData('harvestDateEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstPointOfSale">First Point of Sale/Aggregation</Label>
                <Input
                  id="firstPointOfSale"
                  placeholder="Enter first point of sale"
                  value={formData.firstPointOfSale || ''}
                  onChange={(e) => updateFormData('firstPointOfSale', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">Plots of Land</Label>
                  <Button onClick={addPlot} variant="outline" size="sm">
                    Add Plot
                  </Button>
                </div>

                {formData.plots?.map((plot) => (
                  <Card key={plot.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Input
                        value={plot.identifier}
                        onChange={(e) => updatePlot(plot.id, 'identifier', e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        onClick={() => removePlot(plot.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plot Size (Ha)</Label>
                        <Input
                          type="number"
                          value={plot.size}
                          onChange={(e) => updatePlot(plot.id, 'size', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPS Coordinates (polygon)</Label>
                        <Input
                          placeholder="Polygon coordinates"
                          value={plot.gpsCoordinates}
                          onChange={(e) => updatePlot(plot.id, 'gpsCoordinates', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-muted rounded text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Interactive map tool placeholder
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: ISCC Self Assessment */}
        <TabsContent value="iscc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ISCC Self Assessment</CardTitle>
              <CardDescription>International Sustainability and Carbon Certification evaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 1: Land Use</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>ISCC Land Use Check: conversion after Jan 1, 2008?</Label>
                    <RadioGroup value={formData.isccLandUse || ''} onValueChange={(value) => updateFormData('isccLandUse', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="iscc-yes" />
                        <Label htmlFor="iscc-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="iscc-no" />
                        <Label htmlFor="iscc-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unknown" id="iscc-unknown" />
                        <Label htmlFor="iscc-unknown">Unknown</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Previous Land Use (ISCC Definition)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['primary forest', 'peatland', 'HBD', 'HCS'].map((use) => (
                        <div key={use} className="flex items-center space-x-2">
                          <Checkbox
                            id={`use-${use}`}
                            checked={formData.previousLandUse?.includes(use) || false}
                            onCheckedChange={() => toggleArrayItem('previousLandUse', use)}
                          />
                          <Label htmlFor={`use-${use}`} className="text-sm capitalize">{use}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 2: Environmental Management</h3>
                <div className="space-y-2">
                  <Label>Environmental Practices in Place</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Environmental impact assessment conducted',
                      'Waste management system implemented',
                      'Water conservation measures in place',
                      'Soil erosion prevention program',
                      'Biodiversity conservation plan',
                      'Pesticide and fertilizer management plan',
                      'Emergency response procedures established'
                    ].map((practice) => (
                      <div key={practice} className="flex items-center space-x-2">
                        <Checkbox
                          id={`env-${practice.replace(/\s+/g, '_').substring(0, 20)}`}
                          checked={formData.environmentalPractices?.includes(practice) || false}
                          onCheckedChange={() => toggleArrayItem('environmentalPractices', practice)}
                        />
                        <Label htmlFor={`env-${practice.replace(/\s+/g, '_').substring(0, 20)}`} className="text-sm">{practice}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 3: Health, Safety and Labor</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Health & Safety Checklist</Label>
                    <div className="space-y-2">
                      {[
                        'Personal protective equipment (PPE) provided',
                        'Regular safety training conducted',
                        'First aid facilities available',
                        'Emergency evacuation procedures in place',
                        'Fire safety equipment installed',
                        'Chemical safety procedures implemented',
                        'Regular workplace inspections conducted'
                      ].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={`hs-${item.replace(/\s+/g, '_').substring(0, 15)}`}
                            checked={formData.healthSafetyChecklist?.includes(item) || false}
                            onCheckedChange={() => toggleArrayItem('healthSafetyChecklist', item)}
                          />
                          <Label htmlFor={`hs-${item.replace(/\s+/g, '_').substring(0, 15)}`} className="text-sm">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Worker Rights</Label>
                    <div className="space-y-2">
                      {[
                        'Fair wages and timely payment',
                        'No forced or child labor',
                        'Freedom of association respected',
                        'Working hours comply with legal limits',
                        'Safe and healthy working conditions',
                        'Equal opportunity employment practices',
                        'Right to collective bargaining'
                      ].map((right) => (
                        <div key={right} className="flex items-center space-x-2">
                          <Checkbox
                            id={`right-${right.replace(/\s+/g, '_').substring(0, 15)}`}
                            checked={formData.workerRights?.includes(right) || false}
                            onCheckedChange={() => toggleArrayItem('workerRights', right)}
                          />
                          <Label htmlFor={`right-${right.replace(/\s+/g, '_').substring(0, 15)}`} className="text-sm">{right}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Grievance mechanism available?</Label>
                    <RadioGroup value={formData.grievanceMechanism || ''} onValueChange={(value) => updateFormData('grievanceMechanism', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="grievance-yes" />
                        <Label htmlFor="grievance-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="grievance-no" />
                        <Label htmlFor="grievance-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Freedom of association respected?</Label>
                    <RadioGroup value={formData.freedomOfAssociation || ''} onValueChange={(value) => updateFormData('freedomOfAssociation', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="assoc-yes" />
                        <Label htmlFor="assoc-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="assoc-no" />
                        <Label htmlFor="assoc-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 4&5: Management & Traceability</h3>
                <div className="space-y-2">
                  <Label>Record Keeping System</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Procurement records maintained',
                      'Production records tracked',
                      'Quality control results documented',
                      'Sales and distribution records',
                      'Training records maintained',
                      'Environmental monitoring records',
                      'Compliance audit documentation',
                      'Traceability records complete'
                    ].map((record) => (
                      <div key={record} className="flex items-center space-x-2">
                        <Checkbox
                          id={`record-${record.replace(/\s+/g, '_').substring(0, 15)}`}
                          checked={formData.recordKeeping?.includes(record) || false}
                          onCheckedChange={() => toggleArrayItem('recordKeeping', record)}
                        />
                        <Label htmlFor={`record-${record.replace(/\s+/g, '_').substring(0, 15)}`} className="text-sm">{record}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Participated in GAP training?</Label>
                  <RadioGroup value={formData.gapTraining || ''} onValueChange={(value) => updateFormData('gapTraining', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="gap-yes" />
                      <Label htmlFor="gap-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="gap-no" />
                      <Label htmlFor="gap-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Plantation Profile */}
        <TabsContent value="plantation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantation Profile</CardTitle>
              <CardDescription>Detailed farm and operational information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Profile</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainCrop">Main Crop Type</Label>
                    <Input
                      id="mainCrop"
                      placeholder="e.g., Oil Palm"
                      value={formData.mainCropType || ''}
                      onChange={(e) => updateFormData('mainCropType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantingYear">Planting Year (average)</Label>
                    <Input
                      id="plantingYear"
                      type="number"
                      placeholder="e.g., 2015"
                      value={formData.plantingYear || ''}
                      onChange={(e) => updateFormData('plantingYear', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageOfTrees">Age of Trees (Years)</Label>
                    <Input
                      id="ageOfTrees"
                      type="number"
                      placeholder="e.g., 8"
                      value={formData.ageOfTrees || ''}
                      onChange={(e) => updateFormData('ageOfTrees', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalLandSize">Total Land Size (Ha)</Label>
                    <Input
                      id="totalLandSize"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.totalLandSize || ''}
                      onChange={(e) => updateFormData('totalLandSize', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedYield">Estimated Yield (kg/Ha)</Label>
                    <Input
                      id="estimatedYield"
                      type="number"
                      placeholder="e.g., 20000"
                      value={formData.estimatedYield || ''}
                      onChange={(e) => updateFormData('estimatedYield', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input
                      id="soilType"
                      placeholder="e.g., Clay loam"
                      value={formData.soilType || ''}
                      onChange={(e) => updateFormData('soilType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topography">Topography</Label>
                    <Select value={formData.topography || ''} onValueChange={(value) => updateFormData('topography', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topography" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="gently_sloping">Gently Sloping</SelectItem>
                        <SelectItem value="moderately_sloping">Moderately Sloping</SelectItem>
                        <SelectItem value="steep">Steep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Farming System</Label>
                    <RadioGroup value={formData.farmingSystem || ''} onValueChange={(value) => updateFormData('farmingSystem', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monoculture" id="mono" />
                        <Label htmlFor="mono">Monoculture</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intercropped" id="inter" />
                        <Label htmlFor="inter">Intercropped</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Labor</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Labor Type</Label>
                    <div className="space-y-2">
                      {['Family', 'Hired', 'Local', 'Migrant'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`labor-${type}`}
                            checked={formData.laborType?.includes(type) || false}
                            onCheckedChange={() => toggleArrayItem('laborType', type)}
                          />
                          <Label htmlFor={`labor-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentWorkers">Number of Workers (Permanent)</Label>
                      <Input
                        id="permanentWorkers"
                        type="number"
                        placeholder="e.g., 10"
                        value={formData.permanentWorkers || ''}
                        onChange={(e) => updateFormData('permanentWorkers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seasonalWorkers">Number of Workers (Seasonal)</Label>
                      <Input
                        id="seasonalWorkers"
                        type="number"
                        placeholder="e.g., 25"
                        value={formData.seasonalWorkers || ''}
                        onChange={(e) => updateFormData('seasonalWorkers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access and Logistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Road Condition</Label>
                    <Select value={formData.roadCondition || ''} onValueChange={(value) => updateFormData('roadCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select road condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paved">Paved</SelectItem>
                        <SelectItem value="semi_paved">Semi-paved</SelectItem>
                        <SelectItem value="no_road">No road</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.distance || ''}
                      onChange={(e) => updateFormData('distance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Category</Label>
                    <RadioGroup value={formData.accessCategory || ''} onValueChange={(value) => updateFormData('accessCategory', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="access-easy" />
                        <Label htmlFor="access-easy">Easy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="access-moderate" />
                        <Label htmlFor="access-moderate">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="access-hard" />
                        <Label htmlFor="access-hard">Hard</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Farming Practices & Costs</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="waterSource">Water Source</Label>
                    <Input
                      id="waterSource"
                      placeholder="e.g., River, well, irrigation"
                      value={formData.waterSource || ''}
                      onChange={(e) => updateFormData('waterSource', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pestControl">Pest Control Method</Label>
                    <Input
                      id="pestControl"
                      placeholder="e.g., Integrated pest management"
                      value={formData.pestControlMethod || ''}
                      onChange={(e) => updateFormData('pestControlMethod', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantitySpecs">Quantity Specs</Label>
                    <Input
                      id="quantitySpecs"
                      placeholder="e.g., Fertilizer amounts"
                      value={formData.quantitySpecs || ''}
                      onChange={(e) => updateFormData('quantitySpecs', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fertilizerUse">Fertilizer Use</Label>
                    <Input
                      id="fertilizerUse"
                      placeholder="e.g., NPK application rates"
                      value={formData.fertilizerUse || ''}
                      onChange={(e) => updateFormData('fertilizerUse', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Fertilizer Usage Type</Label>
                    <Select value={formData.fertilizerUsageType || ''} onValueChange={(value) => updateFormData('fertilizerUsageType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fertilizer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chemical">Chemical</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="mix">Mix</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fertilizerDetails">Fertilizer Brand/Type Details</Label>
                    <Textarea
                      id="fertilizerDetails"
                      placeholder="Enter fertilizer brand and type details"
                      rows={2}
                      value={formData.fertilizerBrandDetails || ''}
                      onChange={(e) => updateFormData('fertilizerBrandDetails', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fertilizer Application Months</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                      <div key={month} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fert-${month}`}
                          checked={formData.fertilizerMonths?.includes(month) || false}
                          onCheckedChange={() => toggleArrayItem('fertilizerMonths', month)}
                        />
                        <Label htmlFor={`fert-${month}`} className="text-sm">{month}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="costFertilizer">Cost: Fertilizer (IDR/year)</Label>
                    <Input
                      id="costFertilizer"
                      type="number"
                      placeholder="e.g., 5000000"
                      value={formData.costFertilizer || ''}
                      onChange={(e) => updateFormData('costFertilizer', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costLabor">Cost: Labor (IDR/year)</Label>
                    <Input
                      id="costLabor"
                      type="number"
                      placeholder="e.g., 120000000"
                      value={formData.costLabor || ''}
                      onChange={(e) => updateFormData('costLabor', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costTransport">Cost: Transport (IDR/shipment)</Label>
                    <Input
                      id="costTransport"
                      type="number"
                      placeholder="e.g., 1500000"
                      value={formData.costTransport || ''}
                      onChange={(e) => updateFormData('costTransport', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seasonality</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Peak Season</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={formData.peakSeasonStart || ''} onValueChange={(value) => updateFormData('peakSeasonStart', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.peakSeasonEnd || ''} onValueChange={(value) => updateFormData('peakSeasonEnd', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="End month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Seed Collection</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={formData.seedCollectionStart || ''} onValueChange={(value) => updateFormData('seedCollectionStart', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.seedCollectionEnd || ''} onValueChange={(value) => updateFormData('seedCollectionEnd', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="End month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Fruit Development</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={formData.fruitDevelopmentStart || ''} onValueChange={(value) => updateFormData('fruitDevelopmentStart', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.fruitDevelopmentEnd || ''} onValueChange={(value) => updateFormData('fruitDevelopmentEnd', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="End month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Review and Submit */}
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review and Submit</CardTitle>
              <CardDescription>Final review, documentation, and submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Summary</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Supplier:</strong> {formData.supplierName || 'Not provided'}<br />
                    <strong>Contact Person:</strong> {formData.contactPerson || 'Not provided'}<br />
                    <strong>Crop Type:</strong> {formData.mainCropType || 'Not provided'}<br />
                    <strong>Total Land Size:</strong> {formData.totalLandSize || 'Not provided'} Ha
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalNotes">Final Survey Details: Notes</Label>
                <Textarea
                  id="finalNotes"
                  placeholder="Enter any additional notes or observations"
                  rows={4}
                  value={formData.finalNotes || ''}
                  onChange={(e) => updateFormData('finalNotes', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Observed Red Flags</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Evidence of burning', 'Child labor', 'Encroachment on protected land'].map((flag) => (
                    <div key={flag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`flag-${flag}`}
                        checked={formData.observedRedFlags?.includes(flag) || false}
                        onCheckedChange={() => toggleArrayItem('observedRedFlags', flag)}
                      />
                      <Label htmlFor={`flag-${flag}`} className="text-sm">{flag}</Label>
                    </div>
                  ))}
                </div>
                {formData.observedRedFlags && formData.observedRedFlags.length > 0 && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {formData.observedRedFlags.length} red flag(s) identified
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4">
                <Label>Photos</Label>
                <div className="grid grid-cols-5 gap-4">
                  {['Supplier', 'Crop Sample', 'Plantation', 'Land Title/Docs', 'Road Access'].map((category) => (
                    <div key={category} className="space-y-2">
                      <Label className="text-sm">{category}</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-3 text-center">
                        <Camera className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(`photo_${category}`, e.target.files)}
                          className="text-xs"
                        />
                        {uploadedFiles[`photo_${category}`] && (
                          <div className="mt-1 text-xs text-green-600">
                            {uploadedFiles[`photo_${category}`].length} uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Recommended Follow-Up Action</Label>
                  <RadioGroup value={formData.recommendedAction || ''} onValueChange={(value) => updateFormData('recommendedAction', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="do_not_follow_up" id="follow-none" />
                      <Label htmlFor="follow-none">Do not follow up</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="require_verification" id="follow-verify" />
                      <Label htmlFor="follow-verify">Require verification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="do_not_engage" id="follow-no" />
                      <Label htmlFor="follow-no">Do not engage</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for selected action"
                    rows={3}
                    value={formData.reason || ''}
                    onChange={(e) => updateFormData('reason', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Declaration</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="declaration"
                    checked={formData.declaration || false}
                    onCheckedChange={(checked) => updateFormData('declaration', checked)}
                  />
                  <Label htmlFor="declaration" className="text-sm">
                    I, the undersigned, declare that the information provided in this form is true and accurate to the best of my knowledge.
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="surveyorSignature">Surveyor Signature and Name</Label>
                    <Input
                      id="surveyorSignature"
                      placeholder="Enter surveyor name"
                      value={formData.surveyorSignature || ''}
                      onChange={(e) => updateFormData('surveyorSignature', e.target.value)}
                    />
                    <div className="p-3 border rounded bg-muted text-sm text-center">
                      Digital Signature Pad Placeholder
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierSignature">Supplier Signature and Name</Label>
                    <Input
                      id="supplierSignature"
                      placeholder="Enter supplier name"
                      value={formData.supplierSignature || ''}
                      onChange={(e) => updateFormData('supplierSignature', e.target.value)}
                    />
                    <div className="p-3 border rounded bg-muted text-sm text-center">
                      Digital Signature Pad Placeholder
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateVerified">Date Verified</Label>
                  <Input
                    id="dateVerified"
                    type="date"
                    value={formData.dateVerified || ''}
                    onChange={(e) => updateFormData('dateVerified', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentTab('plantation')}>
                  Previous Section
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.declaration}
                  className="px-8"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Survey Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => {
            const tabs = ['basic', 'land', 'eudr', 'iscc', 'plantation', 'review'];
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex > 0) {
              setCurrentTab(tabs[currentIndex - 1]);
            }
          }}
          disabled={currentTab === 'basic'}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            const tabs = ['basic', 'land', 'eudr', 'iscc', 'plantation', 'review'];
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex < tabs.length - 1) {
              setCurrentTab(tabs[currentIndex + 1]);
            }
          }}
          disabled={currentTab === 'review'}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SupplierSurveyForm;