import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { CreateProperty, Property } from "@/lib/types";
import { createProperty, updateProperty } from "@/api/properties";
import { FACILITY_OPTIONS, transactionTypeOptions, propertyTypeOptions, currencyOptions, statusOptions  } from "@/lib/types";
import { toast } from "sonner";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ListingFormToUpdate({
  ownerId,
  propertyToEdit,
  onFinish,
}: {
  ownerId: string;
  propertyToEdit?: Property;
  onFinish?: () => void;
}) {
  console.log("1:" + propertyToEdit?.transactionType)
    console.log("2:" +propertyToEdit?.propertyType)
      console.log("3:" +propertyToEdit?.currency)
        console.log("4:" +propertyToEdit?.status)
  const remove = usePropertiesStore((state) => state.remove);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState({
    title: propertyToEdit?.title || "",
    description: propertyToEdit?.description || "",
    propertyType: propertyToEdit?.propertyType || "",
    transactionType: propertyToEdit?.transactionType || "sale",
    price: propertyToEdit?.price || "",
    currency: propertyToEdit?.currency || "",
    size: propertyToEdit?.size || "",
    rooms: propertyToEdit?.rooms || "",
    address: propertyToEdit?.address ||"",
    status: "active",
    documentUrl: propertyToEdit?.documentUrl || "",
    verificationComments: propertyToEdit?.verificationComments || "",
    facilities: [] as string[],
    images: [{ imageUrl: "", isPrimary: true }],
  });

  useEffect(() => {
    if (propertyToEdit) {
      setForm({
        ...propertyToEdit,
        propertyType: propertyToEdit.propertyType.trim(),
        transactionType: propertyToEdit.transactionType.trim(),
        currency: propertyToEdit.currency.trim(),
        status: propertyToEdit.status.trim(),
        rooms: propertyToEdit.rooms.toString(),
        facilities: propertyToEdit.facilities
          ? propertyToEdit.facilities.split(",").map((f) => f.trim())
          : [],
      });
    }
  }, [propertyToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
  const handleDelete = async () => {
    if (!propertyToEdit) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?",
    );
    if (!confirm) return;

    setLoading(true);
    try {
      await remove(propertyToEdit.id);
      toast.success("Property successfully deleted!");
      onFinish?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the property.");
    } finally {
      setLoading(false);
    }
  };
    const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const requiredFields = [
      { name: "title", label: "Title" },
      { name: "propertyType", label: "Property Type" },
      { name: "transactionType", label: "Transaction Type" },
      { name: "price", label: "Price" },
      { name: "address", label: "Address" },
      { name: "ownerId", label: "Owner ID" },
    ];

    for (const field of requiredFields) {
      const value =
        field.name === "ownerId" ? ownerId : (form as any)[field.name];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field.name] = `Поле "${field.label}" обязательно для заполнения`;
      }
    }

    if (form.rooms && (isNaN(Number(form.rooms)) || Number(form.rooms) < 0)) {
      errors["rooms"] = "Количество комнат должно быть положительным числом";
    }

    if (form.price && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
      errors["price"] = "Цена должна быть положительным числом";
    }

    if (form.size && (isNaN(Number(form.size)) || Number(form.size) < 0)) {
      errors["size"] = "Размер должен быть положительным числом";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
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
      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, payload);
        toast.success("Property successfully updated!");
      } else {
        await createProperty(payload);
        toast.success("Property successfully created!");
      }
      onFinish?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving the property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 mt-6 px-4 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide core details about the listing
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter title"
              value={form.title}
              onChange={handleChange}
              required
              className={formErrors["title"] ? "border-red-500" : ""}
            />
            {formErrors["title"] && (
              <p className="text-red-500 text-sm mt-1">{formErrors["title"]}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter a detailed description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid gap-1">
              
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter title"
              value={propertyTypeOptions.includes(form.propertyType.trim()) ? form.propertyType.trim() : ""}
              onChange={handleChange}
              required
              className={formErrors["title"] ? "border-red-500" : ""}
            />
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
              
                value={propertyTypeOptions.includes(form.propertyType.trim()) ? form.propertyType.trim() : ""}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, propertyType: value }))
                }
              >
                <SelectTrigger aria-label="Property Type">
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={form.transactionType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, transactionType: value }))
                }
              >
                <SelectTrigger aria-label="Transaction Type">
                  <SelectValue placeholder="Select Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                value={form.price}
                onChange={handleChange}
                required
                className={formErrors["title"] ? "border-red-500" : ""}
              />
              {formErrors["price"] && (
                <p className="text-red-500 text-sm mt-1">{formErrors["price"]}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger aria-label="Currency">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="size">Size (sq.m.)</Label>
              <Input
                id="size"
                name="size"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter size"
                value={form.size}
                onChange={handleChange}
                className={formErrors["size"] ? "border-red-500" : ""}
              />
              {formErrors["size"] && (
                <p className="text-red-500 text-sm mt-1">{formErrors["size"]}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="rooms">Rooms</Label>
                <Input
                id="rooms"
                name="rooms"
                type="number"
                min="0"
                placeholder="Enter number of rooms"
                value={form.rooms}
                onChange={handleChange}
                className={formErrors["rooms"] ? "border-red-500" : ""}
              />
              {formErrors["rooms"] && (
                <p className="text-red-500 text-sm mt-1">{formErrors["rooms"]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="address">Address</Label>
              <Input
              id="address"
              name="address"
              placeholder="Enter full address"
              value={form.address}
              onChange={handleChange}
              required
                className={formErrors["address"] ? "border-red-500" : ""}
              />
              {formErrors["address"] && (
                <p className="text-red-500 text-sm mt-1">{formErrors["address"]}</p>
              )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger aria-label="Status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="documentUrl">Document URL</Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              type="url"
              placeholder="Enter document URL"
              value={form.documentUrl}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      

      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
          <CardDescription>Select available facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {FACILITY_OPTIONS.map((facility) => (
              <label
                key={facility}
                className="flex items-center space-x-2 text-sm cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={form.facilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                  className="cursor-pointer"
                />
                <span>{facility.charAt(0).toUpperCase() + facility.slice(1)}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Manage property images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.images.map((img, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Input
                placeholder={`Image URL ${index + 1}`}
                value={img.imageUrl}
                onChange={(e) => {
                  const newImages = [...form.images];
                  newImages[index].imageUrl = e.target.value;
                  setForm((prev) => ({ ...prev, images: newImages }));
                }}
              />
              <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
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
                  className="cursor-pointer"
                />
                Primary
              </label>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const newImages = form.images.filter((_, i) => i !== index);
                  // Ensure at least one primary image remains
                  if (newImages.length && !newImages.some(img => img.isPrimary)) {
                    newImages[0].isPrimary = true;
                  }
                  setForm((prev) => ({ ...prev, images: newImages }));
                }}
                aria-label={`Delete Image ${index + 1}`}
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
      </Card>
      <div className="flex justify-between items-center px-6 pb-6">
      {propertyToEdit && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" type="button">
              Delete Listing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this listing? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
  <Button type="submit" disabled={loading}>
    {propertyToEdit ? "Update Listing" : "Create Listing"}
  </Button>

      </div>
    </form>
  );
}
