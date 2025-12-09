import { Facility } from "@/db/schema";
import { IconArmchair, IconDeviceCctvFilled, IconHanger2, IconLamp2, IconToolsKitchen } from "@tabler/icons-react";
import { AirVent, Bed, Bus, Car, Coffee, Fan, KeyRound, ParkingCircle, PlugZap, ShieldCheck, Shirt, ShowerHead, Snowflake, Sofa, Tv, Utensils, WashingMachine, Waves, Wifi } from "lucide-react";
import { z } from "zod";

export type propsDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsDialogDelete = propsDialog & { id: number }
export type propsDialogInsert = propsDialog & { data?: Facility, dataClient?: string, swrKey?: string }

export const availableIcons = [
  { value: "Wifi", component: Wifi },
  { value: "Bed", component: Bed },
  { value: "AirVent", component: AirVent },
  { value: "Fan", component: Fan },
  { value: "Shower", component: ShowerHead },
  { value: "Tv", component: Tv },
  { value: "Kitchen", component: IconToolsKitchen },
  { value: "Utensils", component: Utensils },
  { value: "KeyRound", component: KeyRound },
  { value: "Washing", component: WashingMachine },
  { value: "Shirt", component: Shirt },
  { value: "Plugzap", component: PlugZap },
  { value: "Car", component: Car },
  { value: "Parkingcircle", component: ParkingCircle },
  { value: "ShieldCheck", component: ShieldCheck },
  { value: "Waves", component: Waves },
  { value: "Snowflake", component: Snowflake },
  { value: "Coffee", component: Coffee },
  { value: "Bus", component: Bus },
  { value: "Sofa", component: Sofa },
  { value: "TableLamp", component: IconLamp2 },
  { value: "IconHanger2", component: IconHanger2 },
  { value: "IconArmchair", component: IconArmchair },
  { value: "IconDeviceCctvFilled", component: IconDeviceCctvFilled },
];

export const facilitiesSchema = z.object({
  icon: z.string().min(1, { message: "Icon Wajib DiPilih" }),
  category: z.string().min(1, { message: "Kategori Wajib DiPilih" }),
  name: z.string().min(1, { message: "Nama Icon Wajib Diisi" }),
});
