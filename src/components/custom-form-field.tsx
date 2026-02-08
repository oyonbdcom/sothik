/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Control,
  FieldError,
  useFormContext,
  UseFormSetError,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Checkbox } from "./ui/checkbox";

import {
  ChevronDown,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Import all Lucide icons dynamically
import { cn, getBaseUrl } from "@/lib/utils/utils";
import { RatingField } from "./ui/rating";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  RADIO = "radio",
  FILE_UPLOAD = "fileupload",
  PROFILE = "profile",
  MULTI_SELECT = "multiSelect",
  RATING = "rating",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  type?: string;
  value?: string;
  dateFormat?: string;
  showTimeSelect?: boolean;
  readonly?: boolean;
  checked?: boolean;
  children?: React.ReactNode;
  onCheckedChange?: (name: string) => void;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType | undefined;
  setError?: UseFormSetError<any>;
  defaultValue?: string;
  required?: boolean;
  options?: {
    value: string;
    label: string;
    id?: string;
    disabled?: boolean;
  }[];
  file?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | null | undefined;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  minLength?: number;
  maxLength?: number;
  loading?: boolean;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  iconClassName?: string; // New prop for icon styling
}

const RenderInput = ({
  field,
  props,
}: {
  field: any;
  props: CustomProps;
  fieldState: { error?: FieldError };
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // file
  const [preview, setPreview] = useState<string>(
    typeof field.value === "string" ? field.value : "",
  );
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // profile
  const [profilePreview, setProfilePreview] = useState<string | null>(
    typeof field.value === "string" ? field.value : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);

  // profile
  const Icon = props.icon;

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

      if (props.type === "password") {
        return (
          <div className="relative flex w-full items-center">
            {Icon && (
              <Icon className="absolute left-3 h-4 w-4 text-muted-foreground" />
            )}
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={props.placeholder}
                {...field}
                className={`${props.icon ? "pl-10" : ""} pr-10 ${
                  props.className || ""
                } ${
                  props.disabled
                    ? "font-medium "
                    : " focus-visible:border-primary"
                }`}
                disabled={props.disabled}
              />
            </FormControl>
            <button
              type="button"
              className="absolute right-3 text-muted-foreground hover:text-foreground"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        );
      }

      // Regular input field
      return (
        <div className="relative flex w-full items-center">
          {Icon && (
            <Icon className="absolute left-3 h-4 w-4 text-muted-foreground" />
          )}
          <FormControl>
            <Input
              type={props.type || "text"}
              placeholder={props.placeholder}
              {...field}
              className={`${props.icon ? "pl-10" : ""} ${
                props.className || ""
              } ${
                props.disabled
                  ? "focus-visible:border-primary"
                  : " focus-visible:border-primary"
              }`}
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="BD"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={(value) => {
              // সরাসরি field.onChange এ ভ্যালু পাস করুন
              field.onChange(value || "");
            }}
            className="input-phone h-24 focus:border-default-500/50"
            countries={["BD"]}
            // অতিরিক্ত অপশন যা পেস্ট করতে সাহায্য করে
            limitMaxLength={true}
            smartCaret={false}
          />
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 h-4 w-4 text-muted-foreground" />
          )}
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              className={`${props.icon ? "pl-10" : ""} ${
                props.className || ""
              }`}
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-3">
            <Checkbox
              className="rounded-lg"
              id={props.name}
              checked={props.checked}
              onCheckedChange={(isChecked) => {
                if (props.onCheckedChange) {
                  props.onCheckedChange(props.name);
                }
                field.onChange(isChecked);
              }}
            />
            {Icon && (
              <Icon className="absolute left-3 h-4 w-4 text-muted-foreground" />
            )}
            {props.label && (
              <label
                htmlFor={props.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {props.label}
              </label>
            )}
          </div>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="relative flex items-center">
          {Icon && (
            <Icon className="absolute left-3 h-4 w-4 text-muted-foreground" />
          )}
          <FormControl>
            <ReactDatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => field.onChange(date)}
              placeholderText={props.placeholder}
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName={`date-picker w-full ${
                props.icon ? "pl-10" : ""
              }`}
              className={`w-full border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                props.icon ? "pl-10" : ""
              }`}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <div className="relative w-full">
          {/* Left Icon */}
          {Icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon className="h-4 w-4" />
            </span>
          )}

          <FormControl>
            <select
              {...field}
              disabled={props.disabled || props.loading}
              className={cn(
                "w-full h-10 appearance-none rounded-md border border-input bg-background px-3 pr-8 text-sm shadow-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus:ring-primary focus-visible:ring-muted-background",
                "disabled:cursor-not-allowed disabled:opacity-50",
                Icon && "pl-10",
                props.className,
              )}
            >
              {props.loading ? (
                <option value="">Loading...</option>
              ) : (
                <>
                  <option value="">{` ${
                    props?.placeholder ?? "Select Options"
                  }`}</option>
                  {props.options?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          </FormControl>

          {/* Right dropdown arrow */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <ChevronDown />
          </span>
        </div>
      );

    case FormFieldType.MULTI_SELECT: {
      const selectedValues: string[] = Array.isArray(field.value)
        ? field.value
        : [];

      const toggleValue = (value: string) => {
        if (selectedValues.includes(value)) {
          field.onChange(selectedValues.filter((v) => v !== value));
        } else {
          field.onChange([...selectedValues, value]);
        }
      };

      return (
        <FormControl>
          <div className="space-y-3">
            {/* Dropdown */}
            <select
              className="w-full h-10 rounded-md border  text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  toggleValue(e.target.value);
                  e.target.value = "";
                }
              }}
              disabled={props.disabled}
              value=""
            >
              <option value="">Add specialization...</option>
              {props.options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={selectedValues.includes(option.value)}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Selected badges */}
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value) => {
                const label =
                  props.options?.find((o) => o.value === value)?.label ?? value;

                return (
                  <span
                    key={value}
                    className="flex items-center gap-2 rounded-full bg-muted   py-1 text-sm"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => toggleValue(value)}
                      className="hover:text-destructive"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </FormControl>
      );
    }

    case FormFieldType.FILE_UPLOAD: {
      const handleFileSelection = async (file: File) => {
        if (!file) return;

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/webp",
          "image/gif",
        ];
        const maxSize = 3 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
          setError("Only JPG, PNG, SVG, WebP, or GIF files are allowed.");
          return;
        }
        if (file.size > maxSize) {
          setError("File size must not exceed 3MB.");
          return;
        }

        setError(null);
        setLoading(true);

        // Local preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch(`${getBaseUrl()}/upload/single`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed. Please try again.");

          const data = await res.json();

          setPreview(data.data?.url);
          field.onChange(data.data?.url);
        } catch (err) {
          console.error(err);
          setError("Upload failed. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelection(file);
      };

      const handleRemove = async () => {
        if (!preview) return;
        setLoading(true);
        try {
          // Optional: delete from server/cloud
          const parts = preview.split("/");
          const publicIdWithExt = parts[parts.length - 1];
          const publicId = publicIdWithExt.split(".")[0];
          // await deleteImage(`uploads/${publicId}`);

          setPreview("");
          field.onChange("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
          console.error(err);
          setError("Failed to delete image.");
        } finally {
          setLoading(false);
        }
      };

      return (
        <FormControl>
          <div className="flex flex-col gap-3">
            {/* Preview Container */}
            <div
              className={`relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800 transition-colors`}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Uploading...</span>
                </div>
              ) : preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4-4h-4m4 0v4m0-4H7"
                    />
                  </svg>
                  <span className="text-sm mt-1">
                    Drag & drop or click to upload
                  </span>
                </div>
              )}

              {/* Remove button */}
              {preview && !loading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />

            {/* Action Button */}
            {!preview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Choose File
              </button>
            )}

            {/* Info & Error */}
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, SVG, or GIF. Max 3MB.
            </p>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        </FormControl>
      );
    }
    case FormFieldType.PROFILE: {
      const handleFileSelection = async (file: File) => {
        if (!file) return;

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/webp",
          "image/gif",
        ];
        const maxSize = 3 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
          setError("Only JPG, PNG, SVG, WebP, or GIF files are allowed.");
          return;
        }
        if (file.size > maxSize) {
          setError("File size must not exceed 3MB.");
          return;
        }

        setError(null);
        setIsLoading(true);

        // Local preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch(`${getBaseUrl()}/upload/single`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed. Please try again.");

          const data = await res.json();

          setProfilePreview(data.data?.url);
          field.onChange(data.data?.url);
        } catch (err) {
          console.error(err);
          setProfileError("Upload failed. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelection(file);
      };

      const handleRemove = async () => {
        if (!preview) return;
        setLoading(true);
        try {
          // Optional: delete from server/cloud
          const parts = preview.split("/");
          const publicIdWithExt = parts[parts.length - 1];
          const publicId = publicIdWithExt.split(".")[0];
          // await deleteImage(`uploads/${publicId}`);

          setPreview("");
          setError(null);
          field.onChange("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
          console.error(err);
          setError("Failed to delete image.");
        } finally {
          setLoading(false);
        }
      };

      return (
        <FormControl>
          <div className="relative  ">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden relative">
              {/* Check if profilePreview exists AND is not just whitespace */}
              {profilePreview && profilePreview.trim() !== "" ? (
                <Image
                  src={profilePreview.trim()} // Use .trim() to remove accidental spaces
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  // If using external URLs, ensure you have configured next.config.js
                  unoptimized={profilePreview.startsWith("data:")}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              )}

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            {profileError && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {!profileError && (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("patient-image-upload")?.click()
                }
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="patient-image-upload"
            />

            {/* Error message */}
            {error && (
              <p className="mt-2 text-sm text-destructive font-medium">
                {error}
              </p>
            )}
          </div>
        </FormControl>
      );
    }
    case FormFieldType.RATING: {
      const handleChange = (val: number) => {
        field.onChange(val);
      };

      return (
        <RatingField
          value={field.value || 0}
          readOnly={props.disabled}
          onChange={handleChange}
          size={24}
          className="mt-1"
        />
      );
    }

    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;
  const { setError } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const required = props.required || false;
        return (
          <FormItem className={`  w-full ${props.containerClassName || ""}`}>
            {props.fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel
                className={`text-sm font-medium ${props.labelClassName || ""}`}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <RenderInput
              field={field}
              props={{ ...props, setError }}
              fieldState={fieldState}
            />
            {fieldState.error && (
              <FormMessage className={`${props.errorClassName || ""}`}>
                {fieldState.error.message}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default CustomFormField;
