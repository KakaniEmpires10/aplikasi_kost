import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  json,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const userRelations = relations(user, ({ many }) => ({
  ownedKosts: many(kosts),
  ownedRents: many(rents),
  bookings: many(bookings),
  rentBookings: many(rentBookings),
  wishlists: many(wishlists),
  rentWishlists: many(rentWishlists),
  reviews: many(reviews),
  rentReviews: many(rentReviews),
  notifications: many(notifications),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// LOCATION RELATED TABLES
export const provinces = pgTable("provinces", {
  id: varchar("id", { length: 2 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const provinceRelations = relations(provinces, ({ many }) => ({
  regencies: many(regencies),
  kosts: many(kosts),
}));

export const regencies = pgTable("regencies", {
  id: varchar("id", { length: 6 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  provinceId: varchar("province_id", { length: 10 })
    .notNull()
    .references(() => provinces.id, {
      onDelete: "cascade",
    }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regencyRelations = relations(regencies, ({ one, many }) => ({
  province: one(provinces, {
    fields: [regencies.provinceId],
    references: [provinces.id],
  }),
  districts: many(districts),
  kosts: many(kosts),
}));

export const districts = pgTable("districts", {
  id: varchar("id", { length: 10 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  regencyId: varchar("regency_id", { length: 10 })
    .notNull()
    .references(() => regencies.id, {
      onDelete: "cascade",
    }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const districtRelations = relations(districts, ({ one, many }) => ({
  regency: one(regencies, {
    fields: [districts.regencyId],
    references: [regencies.id],
  }),
  villages: many(villages),
  kosts: many(kosts),
}));

export const villages = pgTable("villages", {
  id: varchar("id", { length: 15 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  districtId: varchar("district_id", { length: 15 })
    .notNull()
    .references(() => districts.id, {
      onDelete: "cascade",
    }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const villageRelations = relations(villages, ({ one, many }) => ({
  district: one(districts, {
    fields: [villages.districtId],
    references: [districts.id],
  }),
  kosts: many(kosts),
}));

// PROPERTY RELATED TABLES
export const propertyCategories = pgTable("property_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const PropertyCategoryRelations = relations(
  propertyCategories,
  ({ many }) => ({
    kosts: many(kosts),
    kostRooms: many(kostRooms),
  })
);

export const kosts = pgTable("kosts", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => propertyCategories.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  provinceId: varchar("province_id", { length: 2 }).references(
    () => provinces.id
  ),
  regencyId: varchar("regency_id", { length: 6 }).references(
    () => regencies.id
  ),
  districtId: varchar("district_id", { length: 10 }).references(
    () => districts.id
  ),
  villageId: varchar("village_id", { length: 15 }).references(
    () => villages.id
  ),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isAvailable: boolean("is_available").default(true),
  isPublish: boolean("is_publish").default(false),
  totalRooms: integer("total_rooms").notNull(),
  availableRooms: integer("available_rooms").notNull(),
  floorLevel: integer("floor_level").default(1),
  gender: text("gender"),
  rules: text("rules")
    .array()
    .default(sql`ARRAY[]::text[]`),
  checkInTime: text("check_in_time"),
  checkOutTime: text("check_out_time"),
  minStayDuration: integer("min_stay_duration"), // In months
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const kostRelations = relations(kosts, ({ one, many }) => ({
  owner: one(user, {
    fields: [kosts.ownerId],
    references: [user.id],
  }),
  category: one(propertyCategories, {
    fields: [kosts.categoryId],
    references: [propertyCategories.id],
  }),
  provinceLocation: one(provinces, {
    fields: [kosts.provinceId],
    references: [provinces.id],
  }),
  regencyLocation: one(regencies, {
    fields: [kosts.regencyId],
    references: [regencies.id],
  }),
  districtLocation: one(districts, {
    fields: [kosts.districtId],
    references: [districts.id],
  }),
  villageLocation: one(villages, {
    fields: [kosts.villageId],
    references: [villages.id],
  }),
  rooms: many(kostRooms),
  facilities: many(kostFacilities),
  images: many(kostImages),
  landmarks: many(kostLandmarks),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

export const kostRooms = pgTable("kost_rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  kostId: uuid("kost_id")
    .notNull()
    .references(() => kosts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => propertyCategories.id),
  size: text("size"), // e.g., "3x4m"
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 12, scale: 2 }),
  isAvailable: boolean("is_available").default(true),
  maxOccupants: integer("max_occupants").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kostRoomRelations = relations(kostRooms, ({ one, many }) => ({
  kost: one(kosts, {
    fields: [kostRooms.kostId],
    references: [kosts.id],
  }),
  category: one(propertyCategories, {
    fields: [kostRooms.categoryId],
    references: [propertyCategories.id],
  }),
  facilities: many(roomFacilities),
  images: many(roomImages),
  bookings: many(bookings),
}));

export const rents = pgTable("rents", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => propertyCategories.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  provinceId: varchar("province_id", { length: 2 }).references(
    () => provinces.id
  ),
  regencyId: varchar("regency_id", { length: 6 }).references(
    () => regencies.id
  ),
  districtId: varchar("district_id", { length: 10 }).references(
    () => districts.id
  ),
  villageId: varchar("village_id", { length: 15 }).references(
    () => villages.id
  ),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  totalRooms: integer("total_rooms").notNull(),
  totalBathrooms: integer("total_bathrooms").notNull(),
  floorLevel: integer("floor_level").default(1),
  gender: text("gender"),
  size: text("size"), // e.g., "3x4m"
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  checkInTime: text("check_in_time"),
  checkOutTime: text("check_out_time"),
  minStayDuration: integer("min_stay_duration"), // In months
  isAvailable: boolean("is_available").default(true),
  isPublish: boolean("is_publish").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const rentRelations = relations(rents, ({ one, many }) => ({
  owner: one(user, {
    fields: [rents.ownerId],
    references: [user.id],
  }),
  category: one(propertyCategories, {
    fields: [rents.categoryId],
    references: [propertyCategories.id],
  }),
  provinceLocation: one(provinces, {
    fields: [rents.provinceId],
    references: [provinces.id],
  }),
  regencyLocation: one(regencies, {
    fields: [rents.regencyId],
    references: [regencies.id],
  }),
  districtLocation: one(districts, {
    fields: [rents.districtId],
    references: [districts.id],
  }),
  villageLocation: one(villages, {
    fields: [rents.villageId],
    references: [villages.id],
  }),
  facilities: many(rentFacilities),
  images: many(rentImages),
  landmarks: many(rentLandmarks),
  bookings: many(rentBookings),
  reviews: many(rentReviews),
  wishlists: many(rentWishlists),
}));

// FACILITIES & AMENITIES
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kostFacilities = pgTable("kost_facilities", {
  id: serial("id").primaryKey(),
  kostId: uuid("kost_id")
    .notNull()
    .references(() => kosts.id, { onDelete: "cascade" }),
  facilityId: integer("facility_id")
    .notNull()
    .references(() => facilities.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kostFacilityRelations = relations(kostFacilities, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostFacilities.kostId],
    references: [kosts.id],
  }),
  facility: one(facilities, {
    fields: [kostFacilities.facilityId],
    references: [facilities.id],
  }),
}));

export const roomFacilities = pgTable("room_facilities", {
  id: serial("id").primaryKey(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => kostRooms.id, { onDelete: "cascade" }),
  facilityId: integer("facility_id")
    .notNull()
    .references(() => facilities.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomFacilityRelations = relations(roomFacilities, ({ one }) => ({
  room: one(kostRooms, {
    fields: [roomFacilities.roomId],
    references: [kostRooms.id],
  }),
  facility: one(facilities, {
    fields: [roomFacilities.facilityId],
    references: [facilities.id],
  }),
}));

export const rentFacilities = pgTable("rent_facilities", {
  id: serial("id").primaryKey(),
  rentId: uuid("rent_id")
    .notNull()
    .references(() => rents.id, { onDelete: "cascade" }),
  facilityId: integer("facility_id")
    .notNull()
    .references(() => facilities.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentFacilityRelations = relations(rentFacilities, ({ one }) => ({
  rent: one(rents, {
    fields: [rentFacilities.rentId],
    references: [rents.id],
  }),
  facility: one(facilities, {
    fields: [rentFacilities.facilityId],
    references: [facilities.id],
  }),
}));

// IMAGES
export const kostImages = pgTable("kost_images", {
  id: serial("id").primaryKey(),
  kostId: uuid("kost_id")
    .notNull()
    .references(() => kosts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kostImageRelations = relations(kostImages, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostImages.kostId],
    references: [kosts.id],
  }),
}));

export const roomImages = pgTable("room_images", {
  id: serial("id").primaryKey(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => kostRooms.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomImageRelations = relations(roomImages, ({ one }) => ({
  room: one(kostRooms, {
    fields: [roomImages.roomId],
    references: [kostRooms.id],
  }),
}));

export const rentImages = pgTable("rent_images", {
  id: serial("id").primaryKey(),
  rentId: uuid("rent_id")
    .notNull()
    .references(() => rents.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentImageRelations = relations(rentImages, ({ one }) => ({
  room: one(rents, {
    fields: [rentImages.rentId],
    references: [rents.id],
  }),
}));

// LANDMARKS & LOCATION
export const landmarks = pgTable("landmarks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  category: text("category"), // e.g., campus, mall, hospital
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kostLandmarks = pgTable("kost_landmarks", {
  id: serial("id").primaryKey(),
  kostId: uuid("kost_id")
    .notNull()
    .references(() => kosts.id, { onDelete: "cascade" }),
  landmarkId: integer("landmark_id")
    .notNull()
    .references(() => landmarks.id),
  distance: decimal("distance", { precision: 10, scale: 2 }), // distance in meters
  travelTimeWalking: integer("travel_time_walking"), // in minutes
  travelTimeDriving: integer("travel_time_driving"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kostLandmarkRelations = relations(kostLandmarks, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostLandmarks.kostId],
    references: [kosts.id],
  }),
  landmark: one(landmarks, {
    fields: [kostLandmarks.landmarkId],
    references: [landmarks.id],
  }),
}));

export const rentLandmarks = pgTable("rent_landmarks", {
  id: serial("id").primaryKey(),
  rentId: uuid("rent_id")
    .notNull()
    .references(() => rents.id, { onDelete: "cascade" }),
  landmarkId: integer("landmark_id")
    .notNull()
    .references(() => landmarks.id),
  distance: decimal("distance", { precision: 10, scale: 2 }), // distance in meters
  travelTimeWalking: integer("travel_time_walking"), // in minutes
  travelTimeDriving: integer("travel_time_driving"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentLandmarkRelations = relations(rentLandmarks, ({ one }) => ({
  rent: one(rents, {
    fields: [rentLandmarks.rentId],
    references: [rents.id],
  }),
  landmark: one(landmarks, {
    fields: [rentLandmarks.landmarkId],
    references: [landmarks.id],
  }),
}));

// BOOKINGS & PAYMENTS
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  roomId: uuid("room_id")
    .notNull()
    .references(() => kostRooms.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("pending"), // pending, confirmed, canceled, completed
  notes: text("notes"),
  securityDepositPaid: boolean("security_deposit_paid").default(false),
  occupants: integer("occupants").default(1),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  canceledAt: timestamp("canceled_at"),
  cancelReason: text("cancel_reason"),
});

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id],
  }),
  room: one(kostRooms, {
    fields: [bookings.roomId],
    references: [kostRooms.id],
  }),
  payments: many(payments),
}));

export const rentBookings = pgTable("rent_bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  rentId: uuid("rent_id")
    .notNull()
    .references(() => rents.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("pending"), // pending, confirmed, canceled, completed
  notes: text("notes"),
  securityDepositPaid: boolean("security_deposit_paid").default(false),
  occupants: integer("occupants").default(1),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  canceledAt: timestamp("canceled_at"),
  cancelReason: text("cancel_reason"),
});

export const rentBookingRelations = relations(
  rentBookings,
  ({ one, many }) => ({
    user: one(user, {
      fields: [rentBookings.userId],
      references: [user.id],
    }),
    rent: one(rents, {
      fields: [rentBookings.rentId],
      references: [rents.id],
    }),
    payments: many(rentPayments),
  })
);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("IDR").notNull(),
  paymentType: text("payment_type").notNull(), // monthly_rent, security_deposit, service_fee
  paymentMethod: text("payment_method"), // bank_transfer, e-wallet, etc.
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  transactionId: text("transaction_id"),
  paymentProofUrl: text("payment_proof_url"),
  platformFee: decimal("platform_fee", { precision: 12, scale: 2 }),
  notes: text("notes"),
  metadata: json("metadata"), // For payment gateway specific data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export const rentPayments = pgTable("rent_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => rentBookings.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("IDR").notNull(),
  paymentType: text("payment_type").notNull(), // monthly_rent, security_deposit, service_fee
  paymentMethod: text("payment_method"), // bank_transfer, e-wallet, etc.
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  transactionId: text("transaction_id"),
  paymentProofUrl: text("payment_proof_url"),
  platformFee: decimal("platform_fee", { precision: 12, scale: 2 }),
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rentPaymentRelations = relations(rentPayments, ({ one }) => ({
  booking: one(rentBookings, {
    fields: [rentPayments.bookingId],
    references: [rentBookings.id],
  }),
}));

// DISCOUNTS & PROMOTIONS
export const discounts = pgTable("discounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique(),
  name: text("name").notNull(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // percentage, fixed
  discountValue: decimal("discount_value", {
    precision: 12,
    scale: 2,
  }).notNull(),
  minBookingDuration: integer("min_booking_duration"), // In months
  maxDiscountAmount: decimal("max_discount_amount", {
    precision: 12,
    scale: 2,
  }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => user.id),
});

export const kostDiscounts = pgTable("kost_discounts", {
  id: serial("id").primaryKey(),
  kostId: uuid("kost_id").references(() => kosts.id, { onDelete: "cascade" }),
  roomId: uuid("room_id").references(() => kostRooms.id, {
    onDelete: "cascade",
  }),
  discountId: uuid("discount_id")
    .notNull()
    .references(() => discounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kostDiscountRelations = relations(kostDiscounts, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostDiscounts.kostId],
    references: [kosts.id],
  }),
  room: one(kostRooms, {
    fields: [kostDiscounts.roomId],
    references: [kostRooms.id],
  }),
  discount: one(discounts, {
    fields: [kostDiscounts.discountId],
    references: [discounts.id],
  }),
}));

export const rentDiscounts = pgTable("rent_discounts", {
  id: serial("id").primaryKey(),
  rentId: uuid("rent_id").references(() => rents.id, { onDelete: "cascade" }),
  discountId: uuid("discount_id")
    .notNull()
    .references(() => discounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentDiscountRelations = relations(rentDiscounts, ({ one }) => ({
  rent: one(rents, {
    fields: [rentDiscounts.rentId],
    references: [rents.id],
  }),
  discount: one(discounts, {
    fields: [rentDiscounts.discountId],
    references: [discounts.id],
  }),
}));

// USER ENGAGEMENT
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  kostId: uuid("kost_id")
    .notNull()
    .references(() => kosts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishlistRelations = relations(wishlists, ({ one }) => ({
  user: one(user, {
    fields: [wishlists.userId],
    references: [user.id],
  }),
  kost: one(kosts, {
    fields: [wishlists.kostId],
    references: [kosts.id],
  }),
}));

export const rentWishlists = pgTable("rent_wishlists", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rentId: uuid("rent_id")
    .notNull()
    .references(() => rents.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentWishlistRelations = relations(rentWishlists, ({ one }) => ({
  user: one(user, {
    fields: [rentWishlists.userId],
    references: [user.id],
  }),
  rent: one(rents, {
    fields: [rentWishlists.rentId],
    references: [rents.id],
  }),
}));

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  kostId: uuid("kost_id")
    .notNull()
    .references(() => kosts.id),
  bookingId: uuid("booking_id").references(() => bookings.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  cleanlinessRating: integer("cleanliness_rating"),
  locationRating: integer("location_rating"),
  valueRating: integer("value_rating"),
  securityRating: integer("security_rating"),
  facilitiesRating: integer("facilities_rating"),
  ownerResponseComment: text("owner_response_comment"),
  ownerResponseDate: timestamp("owner_response_date"),
  isVerified: boolean("is_verified").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  kost: one(kosts, {
    fields: [reviews.kostId],
    references: [kosts.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

export const reviewImages = pgTable("review_images", {
  id: serial("id").primaryKey(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewImageRelations = relations(reviewImages, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewImages.reviewId],
    references: [reviews.id],
  }),
}));

export const rentReviews = pgTable("rent_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  rentId: uuid("rent_id")
    .notNull()
    .references(() => rents.id),
  bookingId: uuid("booking_id").references(() => rentBookings.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  cleanlinessRating: integer("cleanliness_rating"),
  locationRating: integer("location_rating"),
  valueRating: integer("value_rating"),
  securityRating: integer("security_rating"),
  facilitiesRating: integer("facilities_rating"),
  ownerResponseComment: text("owner_response_comment"),
  ownerResponseDate: timestamp("owner_response_date"),
  isVerified: boolean("is_verified").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rentReviewRelations = relations(rentReviews, ({ one }) => ({
  user: one(user, {
    fields: [rentReviews.userId],
    references: [user.id],
  }),
  rent: one(rents, {
    fields: [rentReviews.rentId],
    references: [rents.id],
  }),
  booking: one(rentBookings, {
    fields: [rentReviews.bookingId],
    references: [rentBookings.id],
  }),
}));

export const rentReviewImages = pgTable("rent_review_images", {
  id: serial("id").primaryKey(),
  rentReviewId: uuid("rent_review_id")
    .notNull()
    .references(() => rentReviews.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rentreviewImageRelations = relations(rentReviewImages, ({ one }) => ({
  rentReview: one(rentReviews, {
    fields: [rentReviewImages.rentReviewId],
    references: [rentReviews.id],
  }),
}));

// NOTIFICATIONS
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // system, payment, booking, etc.
  isRead: boolean("is_read").default(false),
  link: text("link"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
}));

// ADS & MARKETING
export const advertisements = pgTable("advertisements", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  position: text("position").notNull(), // homepage_top, homepage_middle, sidebar, etc.
  status: text("status").default("active").notNull(), // active, inactive, pending
  priority: integer("priority").default(0),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  advertiserId: text("advertiser_id").references(() => user.id),
  price: decimal("price", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TESTIMONIALS
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  name: text("name").notNull(),
  position: text("position"),
  content: text("content").notNull(),
  rating: integer("rating"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// REPORTS & ANALYTICS
export const ownerReports = pgTable("owner_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  reportType: text("report_type").notNull(), // financial, occupancy, etc.
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }),
  totalBookings: integer("total_bookings"),
  averageOccupancy: decimal("average_occupancy", { precision: 5, scale: 2 }),
  data: json("data"), // Flexible data structure for various report types
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SETTINGS & CONFIGURATIONS
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => user.id),
});

// SYSTEM LOGS
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id),
  action: text("action").notNull(),
  entityType: text("entity_type"), // user, kost, booking, etc.
  entityId: text("entity_id"),
  details: json("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// USER RELATED TYPES
export type User = InferSelectModel<typeof user>;
export type UserInsert = InferInsertModel<typeof user>;

export type Session = InferSelectModel<typeof session>;
export type SessionInsert = InferInsertModel<typeof session>;

export type Account = InferSelectModel<typeof account>;
export type AccountInsert = InferInsertModel<typeof account>;

export type Verification = InferSelectModel<typeof verification>;
export type VerificationInsert = InferInsertModel<typeof verification>;

//LOCATION RELATED TYPES
export type Province = InferSelectModel<typeof provinces>;
export type ProvinceInsert = InferInsertModel<typeof provinces>;

export type Regency = InferSelectModel<typeof regencies>;
export type RegencyInsert = InferInsertModel<typeof regencies>;

export type District = InferSelectModel<typeof districts>;
export type DistrictInsert = InferInsertModel<typeof districts>;

export type Village = InferSelectModel<typeof villages>;
export type VillageInsert = InferInsertModel<typeof villages>;

// PROPERTY RELATED TYPES
export type PropertyCategory = InferSelectModel<typeof propertyCategories>;
export type PropertyCategoryInsert = InferInsertModel<typeof propertyCategories>;

export type Kost = InferSelectModel<typeof kosts>;
export type KostInsert = InferInsertModel<typeof kosts>;

export type KostRoom = InferSelectModel<typeof kostRooms>;
export type KostRoomInsert = InferInsertModel<typeof kostRooms>;

export type Rent = InferSelectModel<typeof rents>;
export type RentInsert = InferInsertModel<typeof rents>;

// FACILITIES & AMENITIES TYPES
export type Facility = InferSelectModel<typeof facilities>;
export type FacilityInsert = InferInsertModel<typeof facilities>;

export type KostFacility = InferSelectModel<typeof kostFacilities>;
export type KostFacilityInsert = InferInsertModel<typeof kostFacilities>;

export type RoomFacility = InferSelectModel<typeof roomFacilities>;
export type RoomFacilityInsert = InferInsertModel<typeof roomFacilities>;

export type RentFacility = InferSelectModel<typeof rentFacilities>;
export type RentFacilityInsert = InferInsertModel<typeof rentFacilities>;

// IMAGES TYPES
export type KostImage = InferSelectModel<typeof kostImages>;
export type KostImageInsert = InferInsertModel<typeof kostImages>;

export type RoomImage = InferSelectModel<typeof roomImages>;
export type RoomImageInsert = InferInsertModel<typeof roomImages>;

export type RentImage = InferSelectModel<typeof rentImages>;
export type RentImageInsert = InferInsertModel<typeof rentImages>;

// LANDMARKS & LOCATION TYPES
export type Landmark = InferSelectModel<typeof landmarks>;
export type LandmarkInsert = InferInsertModel<typeof landmarks>;

export type KostLandmark = InferSelectModel<typeof kostLandmarks>;
export type KostLandmarkInsert = InferInsertModel<typeof kostLandmarks>;

export type RentLandmark = InferSelectModel<typeof rentLandmarks>;
export type RentLandmarkInsert = InferInsertModel<typeof rentLandmarks>;

// BOOKINGS & PAYMENTS TYPES
export type Booking = InferSelectModel<typeof bookings>;
export type BookingInsert = InferInsertModel<typeof bookings>;

export type RentBooking = InferSelectModel<typeof rentBookings>;
export type RentBookingInsert = InferInsertModel<typeof rentBookings>;

export type Payment = InferSelectModel<typeof payments>;
export type PaymentInsert = InferInsertModel<typeof payments>;

export type RentPayment = InferSelectModel<typeof rentPayments>;
export type RentPaymentInsert = InferInsertModel<typeof rentPayments>;

// DISCOUNTS & PROMOTIONS TYPES
export type Discount = InferSelectModel<typeof discounts>;
export type DiscountInsert = InferInsertModel<typeof discounts>;

export type KostDiscount = InferSelectModel<typeof kostDiscounts>;
export type KostDiscountInsert = InferInsertModel<typeof kostDiscounts>;

export type RentDiscount = InferSelectModel<typeof rentDiscounts>;
export type RentDiscountInsert = InferInsertModel<typeof rentDiscounts>;

// USER ENGAGEMENT TYPES
export type Wishlist = InferSelectModel<typeof wishlists>;
export type WishlistInsert = InferInsertModel<typeof wishlists>;

export type RentWishlist = InferSelectModel<typeof rentWishlists>;
export type RentWishlistInsert = InferInsertModel<typeof rentWishlists>;

export type Review = InferSelectModel<typeof reviews>;
export type ReviewInsert = InferInsertModel<typeof reviews>;

export type RentReview = InferSelectModel<typeof rentReviews>;
export type RentReviewInsert = InferInsertModel<typeof rentReviews>;

export type ReviewImage = InferSelectModel<typeof reviewImages>;
export type ReviewImageInsert = InferInsertModel<typeof reviewImages>;

export type RentReviewImage = InferSelectModel<typeof rentReviewImages>;
export type RentReviewImageInsert = InferInsertModel<typeof rentReviewImages>;

// NOTIFICATIONS TYPES
export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;

// ADS & MARKETING TYPES
export type Advertisement = InferSelectModel<typeof advertisements>;
export type AdvertisementInsert = InferInsertModel<typeof advertisements>;

// TESTIMONIALS TYPES
export type Testimonial = InferSelectModel<typeof testimonials>;
export type TestimonialInsert = InferInsertModel<typeof testimonials>;

// REPORTS & ANALYTICS TYPES
export type OwnerReport = InferSelectModel<typeof ownerReports>;
export type OwnerReportInsert = InferInsertModel<typeof ownerReports>;

// SETTINGS & CONFIGURATIONS TYPES
export type SiteSetting = InferSelectModel<typeof siteSettings>;
export type SiteSettingInsert = InferInsertModel<typeof siteSettings>;

// SYSTEM LOGS TYPES
export type ActivityLog = InferSelectModel<typeof activityLogs>;
export type ActivityLogInsert = InferInsertModel<typeof activityLogs>;
