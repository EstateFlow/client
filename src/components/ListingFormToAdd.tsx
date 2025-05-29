import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { CreateProperty } from "@/lib/types";
import { FACILITY_OPTIONS } from "@/lib/types";
import { createProperty } from "@/api/properties";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ListingFormToAdd({ ownerId }: { ownerId: string }) {
   const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "house",
    transactionType: "sale",
    price: "",
    currency: "",
    size: "",
    rooms: "",
    address: "",
    status: "active",
    documentUrl: "",
    verificationComments: "",
    facilities: [] as string[],
    images: [{ imageUrl: "", isPrimary: true }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (facility: string) => {
    setForm((prev) => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities };
    });
  };

  const validateForm = () => {
    const requiredFields = [
    { name: "title", label: "Title" },
    { name: "propertyType", label: "Property Type" },
    { name: "transactionType", label: "Transaction Type" },
    { name: "price", label: "Price" },
    { name: "address", label: "Address" },
    { name: "ownerId", label: "Owner ID" },
    ];

    for (const field of requiredFields) {
    const value = field.name === "ownerId" ? ownerId : (form as any)[field.name];
    if (!value || (typeof value === "string" && value.trim() === "")) {
        toast.error(`The "${field.label}" field is required`);
        return false;
    }
    }

    if (form.rooms && (isNaN(Number(form.rooms)) || Number(form.rooms) < 0)) {
    toast.error("Number of rooms must be a positive number");
    return false;
    }

    if (form.price && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
    toast.error("Price must be a positive number");
    return false;
    }

    if (form.size && (isNaN(Number(form.size)) || Number(form.size) < 0)) {
    toast.error("Size must be a positive number");
    return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload: CreateProperty = {
      ownerId,
      title: form.title,
      description: form.description,
      propertyType: form.propertyType,
      transactionType: form.transactionType,
      price: form.price,
      currency: form.currency,
      size: form.size,
      rooms: Number(form.rooms),
      address: form.address,
      status: form.status as "active" | "inactive" | "sold" | "rented",
      documentUrl: form.documentUrl,
      verificationComments: form.verificationComments,
      facilities: form.facilities.join(", "),
      images: form.images,
    };

    try {
    await createProperty(payload);
    toast.success("Property successfully created!");
    navigate(-1);
    } catch (error) {
    console.error("Error creating property:", error);
    toast.error("An error occurred while creating the listing.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Provide core details about the listing</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          <Textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input name="propertyType" placeholder="Property Type" value={form.propertyType} onChange={handleChange} />
            <Input name="transactionType" placeholder="Transaction Type" value={form.transactionType} onChange={handleChange} />
            <Input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
            <Input name="currency" placeholder="Currency" value={form.currency} onChange={handleChange} />
            <Input name="size" placeholder="Size" value={form.size} onChange={handleChange} />
            <Input name="rooms" placeholder="Rooms" value={form.rooms} onChange={handleChange} />
          </div>
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <Input name="status" placeholder="Status" value={form.status} onChange={handleChange} />
          <Input name="documentUrl" placeholder="Document URL" value={form.documentUrl} onChange={handleChange} />
          <Textarea
            name="verificationComments"
            placeholder="Verification Comments"
            value={form.verificationComments}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {FACILITY_OPTIONS.map((facility) => (
              <label key={facility} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.facilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.images.map((img, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                placeholder={`Image URL ${index + 1}`}
                value={img.imageUrl}
                onChange={(e) => {
                  const newImages = [...form.images];
                  newImages[index].imageUrl = e.target.value;
                  setForm((prev) => ({ ...prev, images: newImages }));
                }}
              />
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  checked={img.isPrimary}
                  onChange={() => {
                    const newImages = form.images.map((image, i) => ({
                      ...image,
                      isPrimary: i === index,
                    }));
                    setForm((prev) => ({ ...prev, images: newImages }));
                  }}
                />
                Primary
              </label>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const newImages = form.images.filter((_, i) => i !== index);
                  setForm((prev) => ({ ...prev, images: newImages }));
                }}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                images: [...prev.images, { imageUrl: "", isPrimary: false }],
              }))
            }
          >
            Add Image
          </Button>
        </CardContent>
      </Card>

      <div className="text-right">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Listing"}
        </Button>
      </div>
    </form>
  );
}
