'use client';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MoreVertical,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboardComponent() {
  const { currentEmail, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentEmail !== 'admin123@gmail.com') {
      logout();
    }
  }, [currentEmail, logout, loading]);

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

  const [activeTab, setActiveTab] = useState("properties")
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [filteredInquiries, setFilteredInquiries] = useState([])
  const [propertySearch, setPropertySearch] = useState("")
  const [inquirySearch, setInquirySearch] = useState("")
  const [currentProperty, setCurrentProperty] = useState({
    id: null,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    fetchProperties()
    fetchInquiries()
  }, [])

  useEffect(() => {
    setFilteredProperties(
      properties.filter(property =>
        property.property_name.toLowerCase().includes(propertySearch.toLowerCase()) ||
        property.city.toLowerCase().includes(propertySearch.toLowerCase())
      )
    )
  }, [properties, propertySearch])

  useEffect(() => {
    setFilteredInquiries(
      inquiries.filter(inquiry =>
        inquiry.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(inquirySearch.toLowerCase())
      )
    )
  }, [inquiries, inquirySearch])

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
    if (error) {
      console.error('Error fetching properties:', error)
    } else {
      setProperties(data)
    }
  }

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiry')
      .select('*')
    if (error) {
      console.error('Error fetching inquiries:', error)
    } else {
      setInquiries(data)
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
      id: null,
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

  const handleDeleteInquiry = async (id) => {
    const { error } = await supabase
      .from('inquiry')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting inquiry:', error)
      alert("Failed to delete inquiry. Please try again.")
    } else {
      alert("Inquiry deleted successfully.")
      fetchInquiries()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <aside className={`bg-green-800 text-white lg:w-64 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
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
            </ul>
          </nav>
        </div>
        <div className="absolute bottom-4 left-4" onClick={logout}>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-green-800">Admin</h1>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => {
              resetCurrentProperty()
              setIsPropertyDialogOpen(true)
            }}>
              <Plus className="h-5 w-5 lg:mr-2" /> <span className="hidden lg:inline">Add Property</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{inquiry.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{inquiry.phone}</TableCell>
                          <TableCell>{inquiry.message.substring(0, 30)}...</TableCell>
                          <TableCell className="hidden sm:table-cell">{new Date(inquiry.inquiry_date).toLocaleDateString()}</TableCell>
                          <TableCell>{inquiry.status}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleDeleteInquiry(inquiry.id)}>
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
        </Tabs>
      </main>
      
      {/* Property Dialog (Add/Edit) */}
      <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            <DialogDescription>
              Enter the details of the property below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="property_name" className="text-right">
                Name
              </Label>
              <Input
                id="property_name"
                value={currentProperty.property_name}
                onChange={(e) => setCurrentProperty({ ...currentProperty, property_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="property_type" className="text-right">
                Type
              </Label>
              <Input
                id="property_type"
                value={currentProperty.property_type}
                onChange={(e) => setCurrentProperty({ ...currentProperty, property_type: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={currentProperty.location}
                onChange={(e) => setCurrentProperty({ ...currentProperty, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                value={currentProperty.city}
                onChange={(e) => setCurrentProperty({ ...currentProperty, city: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bedrooms" className="text-right">
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                value={currentProperty.bedrooms}
                onChange={(e) => setCurrentProperty({ ...currentProperty, bedrooms: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bathrooms" className="text-right">
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                value={currentProperty.bathrooms}
                onChange={(e) => setCurrentProperty({ ...currentProperty, bathrooms: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size_sqft" className="text-right">
                Size (sqft)
              </Label>
              <Input
                id="size_sqft"
                type="number"
                value={currentProperty.size_sqft}
                onChange={(e) => setCurrentProperty({ ...currentProperty, size_sqft: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={currentProperty.price}
                onChange={(e) => setCurrentProperty({ ...currentProperty, price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available_from" className="text-right">
                Available From
              </Label>
              <Input
                id="available_from"
                type="date"
                value={currentProperty.available_from}
                onChange={(e) => setCurrentProperty({ ...currentProperty, available_from: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="listing_status" className="text-right">
                Status
              </Label>
              <Input
                id="listing_status"
                value={currentProperty.listing_status}
                onChange={(e) => setCurrentProperty({ ...currentProperty, listing_status: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bhk" className="text-right">
                BHK
              </Label>
              <Input
                id="bhk"
                value={currentProperty.bhk}
                onChange={(e) => setCurrentProperty({ ...currentProperty, bhk: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={currentProperty.image}
                onChange={(e) => setCurrentProperty({ ...currentProperty, image: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePropertySubmit}>{isEditing ? 'Update Property' : 'Add Property'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button onClick={logout} className="bg-red-500 text-white hover:bg-red-600">
        Logout
      </Button>
    </div>
  );
}