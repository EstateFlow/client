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
import {
  FACILITY_OPTIONS,
  transactionTypeOptions,
  propertyTypeOptions,
  currencyOptions,
  statusOptions,
} from "@/lib/types";
import { createProperty } from "@/api/properties";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function ListingFormToAdd({ ownerId }: { ownerId: string }) {
  const normalizeFacilityKey = (facility: string) =>
    facility.toLowerCase().replace(/[\s/-]/g, "_");
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
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

  const isValidNumber = (value: string) => /[0-9.]/.test(value.trim());

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

    if (form.rooms && (!isValidNumber(form.rooms) || Number(form.rooms) < 0)) {
      errors["rooms"] = t("invalidRooms");
    }

    if (form.price && (!isValidNumber(form.price) || Number(form.price) < 0)) {
      errors["price"] = t("invalidPrice");
    }

    if (form.size && (!isValidNumber(form.size) || Number(form.size) < 0)) {
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

  const handleSubmit = async () => {
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
      toast(t("success"), {
        description: t("listingCreatedSuccess"),
      });
      navigate({ to: "/user-dashboard" });
    } catch (error) {
      toast(t("error"), {
        description: t("listingCreationFailed"),
      });
      console.error("Error while creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
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
                value={form.propertyType}
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
                value={form.transactionType}
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
                value={form.currency}
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
              value={form.status}
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

      <div className="text-right">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button type="button" disabled={loading}>
              {loading ? t("submitting") : t("createListing")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmListingCreation")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmListingCreationDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setIsDialogOpen(false);
                  handleSubmit();
                }}
              >
                {t("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}
