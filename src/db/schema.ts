import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum("difficulty", [
  "very_easy",
  "easy",
  "medium",
  "hard",
]);

export const roleEnum = pgEnum("role", [
  "user",
  "contributor", 
  "admin",
]);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const machines = pgTable("machines", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  difficulty: difficultyEnum("difficulty").notNull(),
  image: varchar("image", { length: 255 }),
  downloadLink: varchar("download_link", { length: 500 }),
  creationDate: varchar("creation_date", { length: 50 }),
  author: varchar("author", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  machineId: integer("machine_id")
    .notNull()
    .references(() => machines.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull().$type<1 | 2 | 3 | 4 | 5>(),
  text: text("text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  machineId: integer("machine_id")
    .notNull()
    .references(() => machines.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  machineId: integer("machine_id")
    .notNull()
    .references(() => machines.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  favorites: many(favorites),
  todos: many(todos),
}));

export const machinesRelations = relations(machines, ({ many }) => ({
  reviews: many(reviews),
  favorites: many(favorites),
  todos: many(todos),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  machine: one(machines, {
    fields: [reviews.machineId],
    references: [machines.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  machine: one(machines, {
    fields: [favorites.machineId],
    references: [machines.id],
  }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  machine: one(machines, {
    fields: [todos.machineId],
    references: [machines.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Machine = typeof machines.$inferSelect;
export type NewMachine = typeof machines.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type Difficulty = (typeof difficultyEnum.enumValues)[number];
export type Role = (typeof roleEnum.enumValues)[number];
