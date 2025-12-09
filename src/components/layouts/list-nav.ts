import {
  IconBuildingWarehouse,
  IconCategory,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconMilitaryRank,
  IconReport,
  IconSettings,
} from "@tabler/icons-react"
import { AlertCircle } from "lucide-react";

export const listDashboardNav = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Manajemen Kost",
      url: "/dashboard/kost",
      icon: IconListDetails,
      open: true,
      children: [
        {
          title: "List Kost",
          url: "/dashboard/kost",
        },
        {
          title: "Tambah Kost",
          url: "/dashboard/kost/add-kost",
        },
        {
          title: "Tambah Kamar",
          url: "/dashboard/kost/add-room",
        },
      ],
    },
    {
      title: "Manajemen Rumah",
      url: "/dashboard/rent",
      icon: IconBuildingWarehouse,
      open: true,
      children: [
        {
          title: "List Rumah",
          url: "/dashboard/rent",
        },
        {
          title: "Tambah Rumah",
          url: "/dashboard/rent/add-rent",
        }
      ],
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Petunjuk",
      url: "/dashboard/guide",
      icon: IconHelp,
    },
    {
      title: "Lapor Bugs",
      url: "/dashboard/report-bug",
      icon: AlertCircle,
    },
  ],
  navMaster: [
    {
      title: "Fasilitas",
      url: "/dashboard/facilities",
      icon: IconMilitaryRank,
    },
    {
      title: "Tipe",
      url: "/dashboard/categories",
      icon: IconCategory,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export const listMainNav = [
    {
        title: "Tentang Kami",
        url: "/about-us",
    },
    {
        title: "Layanan",
        url: "/services",
    },
    {
        title: "Testimoni",
        url: "/testimonial",
    },
];
