import { StaffType, UserRole } from "@/constant/common";
import { adminConfig } from "./admin.sidebar";
import { coordinatorConfig } from "./coordinator.sidebar";
import { diagnosticConfig } from "./diagnostic.sidebar";
import { doctorConfig } from "./doctor.sidebar";
import { managerConfig } from "./manager.sidebar";
import { patientConfig } from "./patient.sidebar";
import { receptionistConfig } from "./receptionist.sidebar";
import { SidebarConfigType } from "./sidebar.types";

export const sidebarConfigs: SidebarConfigType[] = [
  {
    role: UserRole.ADMIN,
    menus: adminConfig,
  },

  {
    role: UserRole.PATIENT,
    menus: patientConfig,
  },

  {
    role: UserRole.DIAGNOSTIC,
    menus: diagnosticConfig,
  },

  {
    role: UserRole.AREA_MANAGER,
    menus: managerConfig,
  },
  {
    role: UserRole.DOCTOR,
    menus: doctorConfig,
  },

  {
    role: UserRole.STAFF,
    staffType: StaffType.RECEPTIONIST,
    menus: receptionistConfig,
  },

  {
    role: UserRole.STAFF,
    staffType: StaffType.COORDINATOR,
    menus: coordinatorConfig,
  },
];

export const getSidebarMenus = (role?: string, staffType?: string) => {
  const matchedConfig = sidebarConfigs.find((config) => {
    if (config.role !== role) return false;

    if (role === "STAFF") {
      return config.staffType === staffType;
    }

    return true;
  });

  return matchedConfig?.menus || [];
};
