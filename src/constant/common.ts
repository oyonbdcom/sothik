export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
export const UserRole = {
  PATIENT: "PATIENT",
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN",
  DIAGNOSTIC: "DIAGNOSTIC",
  AREA_MANAGER: "AREA_MANAGER",
  STAFF: "STAFF",
};
export const StaffType = {
  RECEPTIONIST: "RECEPTIONIST",
  COORDINATOR: "COORDINATOR",
};

// ফোন নম্বর: ইংরেজি (017...) এবং বাংলা (০১৭১...) উভয় সংখ্যা সাপোর্ট করবে
export const phoneRegex = /^(?:\+88|88)?(?:01[3-9]\d{8}|[০-৯]{11})$/;
