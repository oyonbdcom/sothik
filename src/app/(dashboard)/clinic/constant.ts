import { bangladeshDistricts } from "@/constant/dristrict";
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  Globe,
  Lock,
  LucideIcon,
  MapPin,
  Phone,
} from "lucide-react";

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "url"
  | "textarea"
  | "select";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SectionField {
  name: string;
  label: string;
  placeholder?: string;
  type?: FieldType;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  icon?: LucideIcon;
  max?: number;
}

export interface Section {
  title: string;
  description?: string;
  icon?: LucideIcon;
  fields: SectionField[];
}

export const sections: Section[] = [
  {
    title: "ক্লিনিকের সাধারণ তথ্য",
    icon: Building2,
    description: "আপনার ক্লিনিকের প্রাথমিক তথ্য এখানে প্রদান করুন",
    fields: [
      {
        name: "user.name",
        label: "ক্লিনিকের নাম",
        placeholder: "যেমন: সিটি মেডিকেল সেন্টার",
        required: true,
        icon: Building2,
      },
      {
        name: "establishedYear",
        label: "প্রতিষ্ঠিত সাল",
        placeholder: "যেমন: ২০১০",
        type: "number",
        icon: Calendar,
      },
    ],
  },
  {
    title: "যোগাযোগের তথ্য",
    icon: Phone,
    description: "রোগীরা যেভাবে আপনার সাথে যোগাযোগ করবে",
    fields: [
      {
        name: "phoneNumber",
        label: " যোগাযোগ নম্বর",
        placeholder: "যেমন: ০১৭XXXXXXXX",
        required: true,
        icon: Phone,
      },
      {
        name: "user.phoneNumber",
        label: "লগইন নাম্বার",
        placeholder: "০১৭XXXXXXXX ",

        disabled: true,
        icon: Lock,
      },
    ],
  },
  {
    title: "অবস্থান ও ঠিকানা",
    icon: MapPin,
    description: "আপনার ক্লিনিকটি যেখানে অবস্থিত",
    fields: [
      {
        name: "address",
        label: "বিস্তারিত ঠিকানা",
        placeholder: "যেমন: ১২৩, মেডিকেল রোড",
        required: true,
        icon: MapPin,
      },
      {
        name: "city",
        label: "শহর",
        placeholder: "আপনার শহরের নাম লিখুন",
        required: true,
        icon: MapPin,
      },
      {
        name: "district",
        label: "জেলা",
        placeholder: "জেলা নির্বাচন করুন",
        required: true,
        type: "select",
        options: bangladeshDistricts,
        icon: MapPin,
      },
    ],
  },
  {
    title: "পরিচালনার বিস্তারিত",
    icon: Clock,
    description: "ক্লিনিক খোলা-বন্ধের সময় এবং অনলাইন তথ্য",
    fields: [
      {
        name: "openingHour",
        label: "খোলা থাকার সময়",
        placeholder: "যেমন: সকাল ১০টা - রাত ৮টা",
        required: true,
        icon: Clock,
      },
      {
        name: "website",
        label: "ওয়েবসাইট",
        placeholder: "https://yourclinic.com",
        type: "url",
        icon: Globe,
      },
    ],
  },
  {
    title: "ক্লিনিক সম্পর্কে",
    icon: FileText,
    description: "ক্লিনিকের সেবাসমূহ এবং বৈশিষ্ট্য বর্ণনা করুন",
    fields: [
      {
        name: "description",
        label: "ক্লিনিকের বর্ণনা",
        placeholder:
          "রোগীদের উদ্দেশ্যে ক্লিনিকের সেবা এবং উদ্দেশ্য সম্পর্কে লিখুন (সর্বোচ্চ ৩৫০ অক্ষর)...",
        type: "textarea",
        max: 350,
      },
    ],
  },
];
