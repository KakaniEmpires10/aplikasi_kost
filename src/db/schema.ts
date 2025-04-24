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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  bookings: many(bookings),
  wishlists: many(wishlists),
  reviews: many(reviews),
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

// PROPERTY RELATED TABLES
export const kostCategories = pgTable('kost_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const kostCategoryRelations = relations(kostCategories, ({ many }) => ({
  kosts: many(kosts)
}));

export const kosts = pgTable('kosts', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => kostCategories.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  postalCode: text('postal_code'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  isAvailable: boolean('is_available').default(true),
  isVerified: boolean('is_verified').default(false),
  totalRooms: integer('total_rooms').notNull(),
  availableRooms: integer('available_rooms').notNull(),
  gender: text('gender'), // male, female, mixed
  rules: text('rules'),
  checkInTime: text('check_in_time'),
  checkOutTime: text('check_out_time'),
  minStayDuration: integer('min_stay_duration'), // In months
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at')
});

export const kostRelations = relations(kosts, ({ one, many }) => ({
  owner: one(user, {
    fields: [kosts.ownerId],
    references: [user.id]
  }),
  category: one(kostCategories, {
    fields: [kosts.categoryId],
    references: [kostCategories.id]
  }),
  rooms: many(kostRooms),
  facilities: many(kostFacilities),
  images: many(kostImages),
  landmarks: many(kostLandmarks),
  reviews: many(reviews),
  wishlists: many(wishlists)
}));

export const kostRooms = pgTable('kost_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  kostId: uuid('kost_id').notNull().references(() => kosts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  size: text('size'), // e.g., "3x4m"
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  securityDeposit: decimal('security_deposit', { precision: 12, scale: 2 }),
  isAvailable: boolean('is_available').default(true),
  floorLevel: integer('floor_level'),
  maxOccupants: integer('max_occupants').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const kostRoomRelations = relations(kostRooms, ({ one, many }) => ({
  kost: one(kosts, {
    fields: [kostRooms.kostId],
    references: [kosts.id]
  }),
  facilities: many(roomFacilities),
  images: many(roomImages),
  bookings: many(bookings)
}));

// FACILITIES & AMENITIES
export const facilities = pgTable('facilities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  category: text('category'), // e.g., bathroom, kitchen, security
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const kostFacilities = pgTable('kost_facilities', {
  id: serial('id').primaryKey(),
  kostId: uuid('kost_id').notNull().references(() => kosts.id, { onDelete: 'cascade' }),
  facilityId: integer('facility_id').notNull().references(() => facilities.id),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const kostFacilityRelations = relations(kostFacilities, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostFacilities.kostId],
    references: [kosts.id]
  }),
  facility: one(facilities, {
    fields: [kostFacilities.facilityId],
    references: [facilities.id]
  })
}));

export const roomFacilities = pgTable('room_facilities', {
  id: serial('id').primaryKey(),
  roomId: uuid('room_id').notNull().references(() => kostRooms.id, { onDelete: 'cascade' }),
  facilityId: integer('facility_id').notNull().references(() => facilities.id),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const roomFacilityRelations = relations(roomFacilities, ({ one }) => ({
  room: one(kostRooms, {
    fields: [roomFacilities.roomId],
    references: [kostRooms.id]
  }),
  facility: one(facilities, {
    fields: [roomFacilities.facilityId],
    references: [facilities.id]
  })
}));

// IMAGES
export const kostImages = pgTable('kost_images', {
  id: serial('id').primaryKey(),
  kostId: uuid('kost_id').notNull().references(() => kosts.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  isFeatured: boolean('is_featured').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const kostImageRelations = relations(kostImages, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostImages.kostId],
    references: [kosts.id]
  })
}));

export const roomImages = pgTable('room_images', {
  id: serial('id').primaryKey(),
  roomId: uuid('room_id').notNull().references(() => kostRooms.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  isFeatured: boolean('is_featured').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const roomImageRelations = relations(roomImages, ({ one }) => ({
  room: one(kostRooms, {
    fields: [roomImages.roomId],
    references: [kostRooms.id]
  })
}));

// LANDMARKS & LOCATION
export const landmarks = pgTable('landmarks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city'),
  province: text('province'),
  category: text('category'), // e.g., campus, mall, hospital
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const kostLandmarks = pgTable('kost_landmarks', {
  id: serial('id').primaryKey(),
  kostId: uuid('kost_id').notNull().references(() => kosts.id, { onDelete: 'cascade' }),
  landmarkId: integer('landmark_id').notNull().references(() => landmarks.id),
  distance: decimal('distance', { precision: 10, scale: 2 }), // distance in meters
  travelTimeWalking: integer('travel_time_walking'), // in minutes
  travelTimeDriving: integer('travel_time_driving'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const kostLandmarkRelations = relations(kostLandmarks, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostLandmarks.kostId],
    references: [kosts.id]
  }),
  landmark: one(landmarks, {
    fields: [kostLandmarks.landmarkId],
    references: [landmarks.id]
  })
}));

// BOOKINGS & PAYMENTS
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  roomId: uuid('room_id').notNull().references(() => kostRooms.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  status: text('status').notNull().default('pending'), // pending, confirmed, canceled, completed
  notes: text('notes'),
  securityDepositPaid: boolean('security_deposit_paid').default(false),
  occupants: integer('occupants').default(1),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  canceledAt: timestamp('canceled_at'),
  cancelReason: text('cancel_reason')
});

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id]
  }),
  room: one(kostRooms, {
    fields: [bookings.roomId],
    references: [kostRooms.id]
  }),
  payments: many(payments)
}));

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('IDR').notNull(),
  paymentType: text('payment_type').notNull(), // monthly_rent, security_deposit, service_fee
  paymentMethod: text('payment_method'), // bank_transfer, e-wallet, etc.
  status: text('status').notNull().default('pending'), // pending, completed, failed, refunded
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  transactionId: text('transaction_id'),
  paymentProofUrl: text('payment_proof_url'),
  platformFee: decimal('platform_fee', { precision: 12, scale: 2 }),
  notes: text('notes'),
  metadata: json('metadata'), // For payment gateway specific data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const paymentRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id]
  })
}));

// DISCOUNTS & PROMOTIONS
export const discounts = pgTable('discounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').unique(),
  name: text('name').notNull(),
  description: text('description'),
  discountType: text('discount_type').notNull(), // percentage, fixed
  discountValue: decimal('discount_value', { precision: 12, scale: 2 }).notNull(),
  minBookingDuration: integer('min_booking_duration'), // In months
  maxDiscountAmount: decimal('max_discount_amount', { precision: 12, scale: 2 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: text('created_by').references(() => user.id)
});

export const kostDiscounts = pgTable('kost_discounts', {
  id: serial('id').primaryKey(),
  kostId: uuid('kost_id').references(() => kosts.id, { onDelete: 'cascade' }),
  roomId: uuid('room_id').references(() => kostRooms.id, { onDelete: 'cascade' }),
  discountId: uuid('discount_id').notNull().references(() => discounts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const kostDiscountRelations = relations(kostDiscounts, ({ one }) => ({
  kost: one(kosts, {
    fields: [kostDiscounts.kostId],
    references: [kosts.id]
  }),
  room: one(kostRooms, {
    fields: [kostDiscounts.roomId],
    references: [kostRooms.id]
  }),
  discount: one(discounts, {
    fields: [kostDiscounts.discountId],
    references: [discounts.id]
  })
}));

// USER ENGAGEMENT
export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  kostId: uuid('kost_id').notNull().references(() => kosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const wishlistRelations = relations(wishlists, ({ one }) => ({
  user: one(user, {
    fields: [wishlists.userId],
    references: [user.id]
  }),
  kost: one(kosts, {
    fields: [wishlists.kostId],
    references: [kosts.id]
  })
}));

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  kostId: uuid('kost_id').notNull().references(() => kosts.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  cleanlinessRating: integer('cleanliness_rating'),
  locationRating: integer('location_rating'),
  valueRating: integer('value_rating'),
  securityRating: integer('security_rating'),
  facilitiesRating: integer('facilities_rating'),
  ownerResponseComment: text('owner_response_comment'),
  ownerResponseDate: timestamp('owner_response_date'),
  isVerified: boolean('is_verified').default(false),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id]
  }),
  kost: one(kosts, {
    fields: [reviews.kostId],
    references: [kosts.id]
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id]
  })
}));

export const reviewImages = pgTable('review_images', {
  id: serial('id').primaryKey(),
  reviewId: uuid('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const reviewImageRelations = relations(reviewImages, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewImages.reviewId],
    references: [reviews.id]
  })
}));

// NOTIFICATIONS
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // system, payment, booking, etc.
  isRead: boolean('is_read').default(false),
  link: text('link'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id]
  })
}));

// ADS & MARKETING
export const advertisements = pgTable('advertisements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  position: text('position').notNull(), // homepage_top, homepage_middle, sidebar, etc.
  status: text('status').default('active').notNull(), // active, inactive, pending
  priority: integer('priority').default(0),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  advertiserId: text('advertiser_id').references(() => user.id),
  price: decimal('price', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// TESTIMONIALS
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  name: text('name').notNull(),
  position: text('position'),
  content: text('content').notNull(),
  rating: integer('rating'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// REPORTS & ANALYTICS
export const ownerReports = pgTable('owner_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: text('owner_id').notNull().references(() => user.id),
  reportType: text('report_type').notNull(), // financial, occupancy, etc.
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }),
  totalBookings: integer('total_bookings'),
  averageOccupancy: decimal('average_occupancy', { precision: 5, scale: 2 }),
  data: json('data'), // Flexible data structure for various report types
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// SETTINGS & CONFIGURATIONS
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value'),
  description: text('description'),
  isPublic: boolean('is_public').default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: text('updated_by').references(() => user.id)
});

// SYSTEM LOGS
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id),
  action: text('action').notNull(),
  entityType: text('entity_type'), // user, kost, booking, etc.
  entityId: text('entity_id'),
  details: json('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});