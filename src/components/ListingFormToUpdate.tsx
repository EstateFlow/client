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
import {
  FACILITY_OPTIONS,
  transactionTypeOptions,
  propertyTypeOptions,
  currencyOptions,
  statusOptions,
} from "@/lib/types";
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
import { useTranslation } from "react-i18next";

export default function ListingFormToUpdate({
  ownerId,
  propertyToEdit,
  onFinish,
}: {
  ownerId: string;
  propertyToEdit?: Property;
  onFinish?: () => void;
}) {
  const normalizeFacilityKey = (facility: string) =>
    facility.toLowerCase().replace(/[\s/-]/g, "_");
  const { t } = useTranslation();
  const remove = usePropertiesStore((state) => state.remove);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState({
    title: propertyToEdit?.title || "",
    description: propertyToEdit?.description || "",
    propertyType: propertyToEdit?.propertyType || "house",
    transactionType: propertyToEdit?.transactionType || "sale",
    price: propertyToEdit?.price || "",
    currency: currencyOptions[0] || "USD",
    size: propertyToEdit?.size || "",
    rooms: propertyToEdit?.rooms?.toString() || "",
    address: propertyToEdit?.address || "",
    status: "active",
    documentUrl: propertyToEdit?.documentUrl || "",
    verificationComments: propertyToEdit?.verificationComments || "",
    facilities: propertyToEdit?.facilities
      ? propertyToEdit.facilities.split(",").map((f) => f.trim())
      : ([] as string[]),
    images: propertyToEdit?.images?.length
      ? propertyToEdit.images
      : [{ imageUrl: "", isPrimary: true }],
  });

  useEffect(() => {
    if (propertyToEdit) {
      setForm({
        title: propertyToEdit.title,
        description: propertyToEdit.description || "",
        propertyType: propertyToEdit.propertyType.trim(),
        transactionType: propertyToEdit.transactionType.trim(),
        price: propertyToEdit.price.toString(),
        currency: propertyToEdit.currency.trim(),
        size: propertyToEdit.size || "",
        rooms: propertyToEdit.rooms.toString(),
        address: propertyToEdit.address,
        status: propertyToEdit.status.trim(),
        documentUrl: propertyToEdit.documentUrl || "",
        verificationComments: propertyToEdit.verificationComments || "",
        facilities: propertyToEdit.facilities
          ? propertyToEdit.facilities.split(",").map((f) => f.trim())
          : [],
        images: propertyToEdit.images?.length
          ? propertyToEdit.images
          : [{ imageUrl: "", isPrimary: true }],
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

    setLoading(true);
    try {
      await remove(propertyToEdit.id);
      toast(t("success"), {
        description: t("propertyDeletedSuccess"),
      });
      onFinish?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast(t("error"), {
        description: t("propertyDeleteFailed"),
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const requiredFields = [
      { name: "title", label: t("title") },
      { name: "propertyType", label: t("propertyType") },
      { name: "transactionType", label: t("transactionType") },
      { name: "price", label: t("price") },
      { name: "address", label: t("address") },
      { name: "ownerId", label: t("ownerId") },
    ];

    for (const field of requiredFields) {
      const value =
        field.name === "ownerId" ? ownerId : (form as any)[field.name];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field.name] = t("fieldRequired", { field: field.label });
      }
    }

    if (form.rooms && (isNaN(Number(form.rooms)) || Number(form.rooms) < 0)) {
      errors["rooms"] = t("invalidRooms");
    }

    if (form.price && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
      errors["price"] = t("invalidPrice");
    }

    if (form.size && (isNaN(Number(form.size)) || Number(form.size) < 0)) {
      errors["size"] = t("invalidSize");
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) =>
        toast(t("error"), { description: error }),
      );
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
        toast(t("success"), {
          description: t("propertyUpdatedSuccess"),
        });
      } else {
        await createProperty(payload);
        toast(t("success"), {
          description: t("propertyCreatedSuccess"),
        });
      }
      onFinish?.();
    } catch (error) {
      console.error("Error:", error);
      toast(t("error"), {
        description: t("propertySaveFailed"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-8 mt-6 px-4 sm:px-0"
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("basicInformation")}</CardTitle>
          <CardDescription>{t("basicInformationDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-1">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              name="title"
              placeholder={t("titlePlaceholder")}
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
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t("descriptionPlaceholder")}
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid gap-1">
              <Label htmlFor="propertyType">{t("propertyType")}</Label>
              <Select
                value={
                  propertyTypeOptions.includes(form.propertyType.trim())
                    ? form.propertyType.trim()
                    : ""
                }
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, propertyType: value }))
                }
              >
                <SelectTrigger aria-label={t("propertyType")}>
                  <SelectValue placeholder={t("selectPropertyType")} />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="transactionType">{t("transactionType")}</Label>
              <Select
                value={
                  transactionTypeOptions.includes(form.transactionType.trim())
                    ? form.transactionType.trim()
                    : ""
                }
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, transactionType: value }))
                }
              >
                <SelectTrigger aria-label={t("transactionType")}>
                  <SelectValue placeholder={t("selectTransactionType")} />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="price">{t("price")}</Label>
              <Input
                id="price"
                name="price"
                type="text"
                placeholder={t("pricePlaceholder")}
                value={form.price}
                onChange={handleChange}
                onKeyDown={(e) => {
                  const allowed = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ];
                  if (!/[0-9.]/.test(e.key) && !allowed.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                required
                className={formErrors["price"] ? "border-red-500" : ""}
              />
              {formErrors["price"] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors["price"]}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="currency">{t("currency")}</Label>
              <Select
                value={
                  currencyOptions.includes(form.currency.trim())
                    ? form.currency.trim()
                    : ""
                }
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger aria-label={t("currency")}>
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="size">{t("size")}</Label>
              <Input
                id="size"
                name="size"
                type="text"
                placeholder={t("sizePlaceholder")}
                value={form.size}
                onChange={handleChange}
                onKeyDown={(e) => {
                  const allowed = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ];
                  if (!/[0-9.]/.test(e.key) && !allowed.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={formErrors["size"] ? "border-red-500" : ""}
              />
              {formErrors["size"] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors["size"]}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="rooms">{t("rooms")}</Label>
              <Input
                id="rooms"
                name="rooms"
                type="text"
                placeholder={t("roomsPlaceholder")}
                value={form.rooms}
                onChange={handleChange}
                onKeyDown={(e) => {
                  const allowed = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ];
                  if (!/[0-9.]/.test(e.key) && !allowed.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={formErrors["rooms"] ? "border-red-500" : ""}
              />
              {formErrors["rooms"] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors["rooms"]}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="address">{t("address")}</Label>
            <Input
              id="address"
              name="address"
              placeholder={t("addressPlaceholder")}
              value={form.address}
              onChange={handleChange}
              required
              className={formErrors["address"] ? "border-red-500" : ""}
            />
            {formErrors["address"] && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors["address"]}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={
                statusOptions.includes(form.status.trim())
                  ? form.status.trim()
                  : ""
              }
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger aria-label={t("status")}>
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="documentUrl">{t("documentUrl")}</Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              type="url"
              placeholder={t("documentUrlPlaceholder")}
              value={form.documentUrl}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("facilities")}</CardTitle>
          <CardDescription>{t("facilitiesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="flex flex-wrap gap-4">
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
                <span>{t(facility)}</span>
              </label>
            ))}
          </div> */}
          <div className="flex flex-wrap gap-4">
            {FACILITY_OPTIONS.map((facility) => {
              console.log(facility);
              console.log(normalizeFacilityKey(facility));
              return (
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
                  <span>{t(`facilitiesList.${normalizeFacilityKey(facility)}`)}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("images")}</CardTitle>
          <CardDescription>{t("imagesDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.images.map((img, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <Input
                placeholder={t("imageUrlPlaceholder", { index: index + 1 })}
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
                {t("primaryImage")}
              </label>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const newImages = form.images.filter((_, i) => i !== index);
                  if (
                    newImages.length &&
                    !newImages.some((img) => img.isPrimary)
                  ) {
                    newImages[0].isPrimary = true;
                  }
                  setForm((prev) => ({ ...prev, images: newImages }));
                }}
                aria-label={t("deleteImage")}
              >
                {t("deleteImage")}
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
            {t("addImage")}
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center px-6 pb-6">
        {propertyToEdit && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" type="button" disabled={loading}>
                {t("deleteListing")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("confirmDeletion")}</DialogTitle>
                <DialogDescription>
                  {t("confirmDeletionDescription")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {t("delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Button type="submit" disabled={loading}>
          {propertyToEdit ? t("updateListing") : t("createListing")}
        </Button>
      </div>
    </form>
  );
}
