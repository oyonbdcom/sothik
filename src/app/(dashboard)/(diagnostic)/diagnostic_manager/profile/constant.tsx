import CustomFormField, { FormFieldType } from "@/components/custom-form-field";

const ProfileHero = ({ clinic, control }: any) => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      {/* Logo / Image */}
      <div className="relative shrink-0">
        <div className="w-28 h-28 rounded-2xl overflow-hidden border bg-slate-50 shadow-sm">
          <CustomFormField
            fieldType={FormFieldType.PROFILE}
            name="user.image"
            control={control}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <h2 className="text-xl font-black text-slate-900">
          {clinic?.user?.name || "Clinic Name"}
        </h2>

        {/* Location hierarchy */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="px-2 py-1 bg-slate-100 rounded-full">
            📍 {clinic?.area?.name || "Area"}
          </span>
          <span className="px-2 py-1 bg-slate-100 rounded-full">
            🏙 {clinic?.district || "District"}
          </span>
          <span className="px-2 py-1 bg-slate-100 rounded-full">
            🌆 {clinic?.city || "City"}
          </span>
        </div>

        {/* Contact */}
        <div className="text-xs text-slate-500 flex items-center gap-2">
          📞 {clinic?.user?.phoneNumber}
        </div>
      </div>
    </div>
  </div>
);
const LocationSection = ({ control }: any) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
    <h3 className="text-sm font-bold text-slate-800">Location Information</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        name="city"
        label="City"
        control={control}
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        name="district"
        label="District"
        control={control}
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        name="area"
        label="Area"
        control={control}
      />
    </div>
  </div>
);
