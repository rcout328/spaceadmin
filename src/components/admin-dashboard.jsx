'use client';
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MoreVertical,
  Home,
  LogOut,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase'
import { AdminBestProperties } from './AdminBestProperties';
import { AdminTop4Properties } from './AdminTop4Properties';

export function AdminDashboardComponent() {
  const { currentEmail, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("properties")
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [propertySearch, setPropertySearch] = useState("")
  const [currentProperty, setCurrentProperty] = useState({
    property_id: null,
    property_name: "",
    property_type: "",
    location: "",
    city: "",
    bedrooms: "",
    bathrooms: "",
    size_sqft: "",
    price: "",
    available_from: "",
    listing_status: "",
    bhk: "",
    image: ""
  })
  const [isEditing, setIsEditing] = useState(false)
  const [visitCounts, setVisitCounts] = useState([]); // State to hold visit counts for properties
  const [normalInquiries, setNormalInquiries] = useState([]); // State to hold normal inquiries
  const [propertyInquiries, setPropertyInquiries] = useState([]); // State to hold property inquiries
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    if (!loading && currentEmail !== 'admin123@gmail.com') {
      logout();
    }
  }, [currentEmail, logout, loading]);

  useEffect(() => {
    if (currentEmail === 'admin123@gmail.com') {
      fetchProperties();
      fetchNormalInquiries(); // Fetch normal inquiries when admin logs in
      fetchPropertyInquiries(); // Fetch property inquiries when admin logs in
    }
  }, [currentEmail]);

  useEffect(() => {
    setFilteredProperties(
      properties.filter(property =>
        property.property_name.toLowerCase().includes(propertySearch.toLowerCase()) ||
        property.city.toLowerCase().includes(propertySearch.toLowerCase())
      )
    )
  }, [properties, propertySearch])

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
    if (error) {
      console.error('Error fetching properties:', error)
    } else {
      setProperties(data);
      // Fetch visit counts
      const counts = data.map(property => ({
        id: property.id,
        visited: property.visited || 0 // Default to 0 if null
      }));
      setVisitCounts(counts);
    }
  }

  const fetchNormalInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiry') // Assuming normal inquiries are stored in a separate table
      .select('*')
    if (error) {
      console.error('Error fetching normal inquiries:', error)
    } else {
      setNormalInquiries(data);
    }
  }

  const fetchPropertyInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiry') // Assuming property inquiries are stored in a separate table
      .select('*')
    if (error) {
      console.error('Error fetching property inquiries:', error)
    } else {
      setPropertyInquiries(data);
    }
  }

  const handlePropertySubmit = async () => {
    if (isEditing) {
      const { error } = await supabase
        .from('properties')
        .update(currentProperty)
        .eq('id', currentProperty.id)
      if (error) {
        console.error('Error updating property:', error)
        alert("Failed to update property. Please try again.")
      } else {
        alert("Property updated successfully.")
        setIsPropertyDialogOpen(false)
        fetchProperties()
      }
    } else {
      const { error } = await supabase
        .from('properties')
        .insert([currentProperty])
      if (error) {
        console.error('Error adding property:', error)
        alert("Failed to add property. Please try again.")
      } else {
        alert("Property added successfully.")
        setIsPropertyDialogOpen(false)
        fetchProperties()
      }
    }
    resetCurrentProperty()
  }

  const handleDeleteProperty = async (id) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting property:', error)
      alert("Failed to delete property. Please try again.")
    } else {
      alert("Property deleted successfully.")
      fetchProperties()
    }
  }

  const handleEditProperty = (property) => {
    setCurrentProperty(property)
    setIsEditing(true)
    setIsPropertyDialogOpen(true)
  }

  const resetCurrentProperty = () => {
    setCurrentProperty({
      property_id: null,
      property_name: "",
      property_type: "",
      location: "",
      city: "",
      bedrooms: "",
      bathrooms: "",
      size_sqft: "",
      price: "",
      available_from: "",
      listing_status: "",
      bhk: "",
      image: ""
    })
    setIsEditing(false)
  }

  const fetchInquiries = async () => {
    const { data, error } = await supabase.from('inquiry').select('*');
    if (error) {
      console.error('Error fetching inquiries:', error);
    } else {
      setInquiries(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-800" />
      </div>
    );
  }

  if (currentEmail !== 'admin123@gmail.com') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <aside className="hidden bg-green-800 text-white lg:block lg:w-64">
        <div className="p-4">
          <div className="text-2xl font-bold mb-8">Space Oracle</div>
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 rounded-lg bg-green-700">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 rounded-lg" onClick={() => setActiveTab("status")}>
                  <span>Status</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="absolute bottom-4 left-4 hidden lg:block" onClick={logout}>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-green-800">Admin</h1>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => {
              resetCurrentProperty()
              setIsPropertyDialogOpen(true)
            }}>
              <Plus className="h-5 w-5 lg:mr-2" /> <span className="hidden lg:inline">Add Property</span>
            </Button>
            <Button 
              className="lg:hidden bg-red-500 text-white hover:bg-red-600" 
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="normalInquiries">Normal Inquiries</TabsTrigger>
            <TabsTrigger value="propertyInquiries">Property Inquiries</TabsTrigger>
            <TabsTrigger value="top3">Top3 Main Properties</TabsTrigger>
            <TabsTrigger value="top4">Top4 Properties</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger> {/* New Status Tab */}
          </TabsList>
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    className="pl-10 pr-4 py-2"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Name</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.property_name}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.property_type}</TableCell>
                          <TableCell className="hidden lg:table-cell">{property.city}</TableCell>
                          <TableCell>${property.price.toLocaleString()}</TableCell>
                          <TableCell className="hidden sm:table-cell">{property.listing_status}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditProperty(property)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteProperty(property.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="normalInquiries">
            <Card>
              <CardHeader>
                <CardTitle>Normal Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Phone</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {normalInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{inquiry.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{inquiry.phone}</TableCell>
                          <TableCell>{inquiry.message}</TableCell>
                          <TableCell className="hidden sm:table-cell">{inquiry.date}</TableCell>
                          <TableCell>{inquiry.status}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditProperty(inquiry)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteProperty(inquiry.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="propertyInquiries">
            <Card>
              <CardHeader>
                <CardTitle>Property Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Phone</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Property</TableHead> {/* New Property Column */}
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyInquiries.map((inquiry) => {
                        const property = properties.find(p => p.property_id === inquiry.property)?.property_name; // Get property name by matching ID
                        console.log(inquiry);
                        console.log(inquiry.proprites);
                        console.log(property);
                        console.log(properties);
                        return (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{inquiry.email}</TableCell>
                            <TableCell className="hidden lg:table-cell">{inquiry.phone}</TableCell>
                            <TableCell>{inquiry.message}</TableCell>
                            <TableCell className="hidden sm:table-cell">{inquiry.date}</TableCell>
                            <TableCell>{inquiry.status}</TableCell>
                            <TableCell>{property ? property : 'N/A'}</TableCell> {/* Display property name */}
                            
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProperty(inquiry)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteProperty(inquiry.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Property Visit Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Visits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitCounts.sort((a, b) => b.visited - a.visited).map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell className="font-medium">{properties.find(p => p.id === visit.id)?.property_name || 'N/A'}</TableCell>
                          <TableCell>{visit.visited}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="top3">
            <AdminBestProperties />
          </TabsContent>
          <TabsContent value="top4">
            <AdminTop4Properties />
          </TabsContent>
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Phone</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Property</TableHead> {/* New Property Column */}
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry) => {
                        const property = properties.find(p => p.id === inquiry.property_id); // Match property by ID
                        return (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{inquiry.email}</TableCell>
                            <TableCell className="hidden lg:table-cell">{inquiry.phone}</TableCell>
                            <TableCell>{inquiry.message}</TableCell>
                            <TableCell className="hidden sm:table-cell">{new Date(inquiry.date).toLocaleDateString()}</TableCell>
                            <TableCell>{inquiry.status}</TableCell>
                            <TableCell>{property ? property.property_name : 'N/A'}</TableCell> {/* Display property name */}
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleDeleteInquiry(inquiry.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Property Dialog (Add/Edit) */}
      <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            <DialogDescription>
              Enter the details of the property below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Property form fields */}
          </div>
          <DialogFooter>
            <Button onClick={handlePropertySubmit}>{isEditing ? 'Update Property' : 'Add Property'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
