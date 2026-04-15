/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAddAreaMutation,
  useAddDepartmentMutation,
  useAddDistrictMutation,
  useDeleteAreaMutation,
  useDeleteDepartmentMutation,
  useDeleteDistrictMutation,
  useGetAreasQuery,
  useGetDepartmentsQuery,
  useGetDistrictsQuery,
  useUpdateAreaMutation,
  useUpdateDepartmentMutation,
  useUpdateDistrictMutation,
} from "@/redux/api/setup";
import {
  areaSchema,
  departmentSchema,
  districtSchema,
} from "@/zod-validation/setup";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export default function ManageAllPage() {
  const [activeTab, setActiveTab] = useState<"locations" | "departments">(
    "locations",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"district" | "area" | "dept">(
    "district",
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    districtId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // RTK Query Hooks
  const { data: districtData, isLoading: isDistLoading } =
    useGetDistrictsQuery();
  const { data: areaData, isLoading: isAreaLoading } = useGetAreasQuery();
  const { data: deptData, isLoading: isDeptLoading } = useGetDepartmentsQuery();

  // Mutations
  const [addDistrict, { isLoading: isDistAdding }] = useAddDistrictMutation();
  const [updateDistrict, { isLoading: isDistUpdating }] =
    useUpdateDistrictMutation();
  const [deleteDistrict] = useDeleteDistrictMutation();

  const [addArea, { isLoading: isAreaAdding }] = useAddAreaMutation();
  const [updateArea, { isLoading: isAreaUpdating }] = useUpdateAreaMutation();
  const [deleteArea] = useDeleteAreaMutation();

  const [addDept, { isLoading: isDeptAdding }] = useAddDepartmentMutation();
  const [updateDept, { isLoading: isDeptUpdating }] =
    useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  const isMutationLoading =
    isDistAdding ||
    isDistUpdating ||
    isAreaAdding ||
    isAreaUpdating ||
    isDeptAdding ||
    isDeptUpdating;

  const openModal = (type: "district" | "area" | "dept", data?: any) => {
    setModalType(type);
    if (data) {
      setEditingId(data.id);
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        image: data.image || "",
        districtId: data.districtId || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", slug: "", image: "", districtId: "" });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // ১. ভ্যালিডেশন (Zod)
      const validationData =
        modalType === "area"
          ? formData
          : { name: formData.name, slug: formData.slug, image: formData.image };
      if (modalType === "district") districtSchema.parse(validationData);
      if (modalType === "area") areaSchema.parse(formData);
      if (modalType === "dept") departmentSchema.parse(validationData);

      let res;
      // ২. API কল (Add or Update)
      if (modalType === "district") {
        const payload = { name: formData.name, slug: formData.slug };
        res = editingId
          ? await updateDistrict({ id: editingId, data: payload }).unwrap()
          : await addDistrict(payload).unwrap();
      } else if (modalType === "area") {
        const payload = {
          name: formData.name,
          slug: formData.slug,
          districtId: formData.districtId,
        };
        res = editingId
          ? await updateArea({ id: editingId, data: payload }).unwrap()
          : await addArea(payload).unwrap();
      } else {
        const payload = {
          name: formData.name,
          slug: formData.slug,
          image: formData.image,
        };
        res = editingId
          ? await updateDept({ id: editingId, data: payload }).unwrap()
          : await addDept(payload).unwrap();
      }

      if (res) {
        toast.success(
          `${getModalTitle()} ${editingId ? "আপডেট" : "যুক্ত"} হয়েছে`,
        );
        setIsModalOpen(false);
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) formattedErrors[e.path[0] as string] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        toast.error(err?.message || "কিছু একটা ভুল হয়েছে");
      }
    }
  };

  const handleDelete = async (
    type: "district" | "area" | "dept",
    id: string,
  ) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) {
      try {
        if (type === "district") await deleteDistrict(id).unwrap();
        if (type === "area") await deleteArea(id).unwrap();
        if (type === "dept") await deleteDept(id).unwrap();
        toast.success("ডিলিট সম্পন্ন হয়েছে");
      } catch (err: any) {
        console.log(err);
        toast.error(err?.message || "ডিলিট করা সম্ভব হয়নি");
      }
    }
  };

  const getModalTitle = () => {
    const prefix = editingId ? "আপডেট" : "নতুন";
    if (modalType === "district") return `${prefix} জেলা`;
    if (modalType === "area") return `${prefix} এরিয়া`;
    return `${prefix} ডিপার্টমেন্ট`;
  };

  const getPlaceholderText = (field: "name" | "slug") => {
    if (field === "name") {
      if (modalType === "district") return "উদা: দিনাজপুর";
      if (modalType === "area") return "উদা: বীরগঞ্জ";
      return "উদা: কার্ডিওলজি";
    }
    if (modalType === "district") return "dinajpur";
    if (modalType === "area") return "birganj";
    return "cardiology";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 min-h-screen">
      {/* Header (Keep as is) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            সিস্টেম ম্যানেজমেন্ট
          </h1>
          <p className="text-slate-500 text-sm">
            লোকেশন এবং বিভাগসমূহ পরিচালনা করুন
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openModal("district")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition active:scale-95"
          >
            <Plus size={16} /> জেলা
          </button>
          <button
            onClick={() => openModal("area")}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition active:scale-95"
          >
            <Plus size={16} /> এরিয়া
          </button>
          <button
            onClick={() => openModal("dept")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition active:scale-95"
          >
            <Plus size={16} /> ডিপার্টমেন্ট
          </button>
        </div>
      </div>

      {/* Tabs (Keep as is) */}
      <div className="flex border-b border-slate-200 gap-8 px-2">
        <button
          onClick={() => setActiveTab("locations")}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === "locations" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          লোকেশন এবং এরিয়া
          {activeTab === "locations" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === "departments" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          ডিপার্টমেন্টসমূহ
          {activeTab === "departments" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* List Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === "locations" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    নাম ও স্লাগ
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    ধরন
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isDistLoading || isAreaLoading ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center">
                      <Loader2 className="animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Districts List */}
                    {districtData?.districts?.map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">
                            {d.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            /{d.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase">
                            District
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal("district", d)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete("district", d.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Areas List */}
                    {areaData?.areas?.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">
                            {a.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            /{a.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase">
                            Area ({a.district?.name})
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal("area", a)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete("area", a.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {isDeptLoading ? (
              <div className="col-span-full py-10 text-center">
                <Loader2 className="animate-spin mx-auto" />
              </div>
            ) : (
              deptData?.departments?.map((dept: any) => (
                <div
                  key={dept.id}
                  className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-purple-200 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center overflow-hidden border border-purple-100">
                      {dept.image ? (
                        <img
                          src={dept.image}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      ) : (
                        dept.name[0]
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{dept.name}</h4>
                      <p className="text-[10px] text-slate-400">/{dept.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => openModal("dept", dept)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete("dept", dept.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal - Common for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isMutationLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-slate-900">
                {getModalTitle()}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
              {modalType === "area" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    জেলা নির্বাচন করুন
                  </label>
                  <select
                    className={`w-full p-3.5 bg-slate-50 border rounded-2xl outline-none ${errors.districtId ? "border-red-500" : "border-slate-200"}`}
                    value={formData.districtId}
                    onChange={(e) =>
                      setFormData({ ...formData, districtId: e.target.value })
                    }
                  >
                    <option value="">সিলেক্ট করুন</option>
                    {districtData?.districts?.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.districtId && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {errors.districtId}
                    </p>
                  )}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  নাম (বাংলায়)
                </label>
                <input
                  type="text"
                  placeholder={getPlaceholderText("name")}
                  className={`w-full p-3.5 bg-slate-50 border rounded-2xl outline-none ${errors.name ? "border-red-500" : "border-slate-200"}`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>
                )}
              </div>

              {/* Slug Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  স্লাগ (ইংরেজিতে)
                </label>
                <input
                  type="text"
                  placeholder={getPlaceholderText("slug")}
                  className={`w-full p-3.5 bg-slate-50 border rounded-2xl outline-none font-mono ${errors.slug ? "border-red-500" : "border-slate-200"}`}
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                />
                {errors.slug && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.slug}</p>
                )}
              </div>

              {/* Image URL (Only for Dept) */}
              {modalType === "dept" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    ইমেজ ইউআরএল (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isMutationLoading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 mt-4"
              >
                {isMutationLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : editingId ? (
                  <Edit size={20} />
                ) : (
                  <Plus size={20} />
                )}
                {isMutationLoading
                  ? "সংরক্ষণ হচ্ছে..."
                  : editingId
                    ? "আপডেট করুন"
                    : "সংরক্ষণ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
