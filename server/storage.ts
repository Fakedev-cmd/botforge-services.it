import { 
  users, products, orders, reviews, updates, tickets, ticketMessages, passwordChangeRequests,
  type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder,
  type Review, type InsertReview, type Update, type InsertUpdate, type Ticket, type InsertTicket,
  type TicketMessage, type InsertTicketMessage, type PasswordChangeRequest, type InsertPasswordChangeRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Order methods
  getAllOrders(): Promise<(Order & { user: User; product: Product })[]>;
  getUserOrders(userId: number): Promise<(Order & { product: Product })[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Review methods
  getAllReviews(): Promise<(Review & { user: User })[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Update methods
  getAllUpdates(): Promise<(Update & { author: User })[]>;
  createUpdate(update: InsertUpdate): Promise<Update>;
  
  // Ticket methods
  getAllTickets(): Promise<(Ticket & { user: User })[]>;
  getUserTickets(userId: number): Promise<Ticket[]>;
  getTicket(id: number): Promise<(Ticket & { user: User; messages: (TicketMessage & { user: User })[] }) | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: number, status: string): Promise<Ticket | undefined>;
  
  // Ticket message methods
  createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage>;
  getTicketMessages(ticketId: number): Promise<(TicketMessage & { user: User })[]>;
  
  // Password change request methods
  getAllPasswordChangeRequests(): Promise<(PasswordChangeRequest & { user: User })[]>;
  createPasswordChangeRequest(request: InsertPasswordChangeRequest): Promise<PasswordChangeRequest>;
  updatePasswordChangeRequest(id: number, status: string, processedBy: number): Promise<PasswordChangeRequest | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.status, "active")).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async getAllOrders(): Promise<(Order & { user: User; product: Product })[]> {
    return await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(products, eq(orders.productId, products.id))
      .orderBy(desc(orders.createdAt))
      .then(rows => rows.map(row => ({
        ...row.orders,
        user: row.users!,
        product: row.products!
      })));
  }

  async getUserOrders(userId: number): Promise<(Order & { product: Product })[]> {
    return await db
      .select()
      .from(orders)
      .leftJoin(products, eq(orders.productId, products.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .then(rows => rows.map(row => ({
        ...row.orders,
        product: row.products!
      })));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  async getAllReviews(): Promise<(Review & { user: User })[]> {
    return await db
      .select()
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.createdAt))
      .then(rows => rows.map(row => ({
        ...row.reviews,
        user: row.users!
      })));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getAllUpdates(): Promise<(Update & { author: User })[]> {
    return await db
      .select()
      .from(updates)
      .leftJoin(users, eq(updates.authorId, users.id))
      .orderBy(desc(updates.createdAt))
      .then(rows => rows.map(row => ({
        ...row.updates,
        author: row.users!
      })));
  }

  async createUpdate(update: InsertUpdate): Promise<Update> {
    const [newUpdate] = await db
      .insert(updates)
      .values(update)
      .returning();
    return newUpdate;
  }

  async getAllTickets(): Promise<(Ticket & { user: User })[]> {
    return await db
      .select()
      .from(tickets)
      .leftJoin(users, eq(tickets.userId, users.id))
      .orderBy(desc(tickets.createdAt))
      .then(rows => rows.map(row => ({
        ...row.tickets,
        user: row.users!
      })));
  }

  async getUserTickets(userId: number): Promise<Ticket[]> {
    return await db
      .select()
      .from(tickets)
      .where(eq(tickets.userId, userId))
      .orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: number): Promise<(Ticket & { user: User; messages: (TicketMessage & { user: User })[] }) | undefined> {
    const [ticket] = await db
      .select()
      .from(tickets)
      .leftJoin(users, eq(tickets.userId, users.id))
      .where(eq(tickets.id, id));

    if (!ticket) return undefined;

    const messages = await db
      .select()
      .from(ticketMessages)
      .leftJoin(users, eq(ticketMessages.userId, users.id))
      .where(eq(ticketMessages.ticketId, id))
      .orderBy(ticketMessages.createdAt)
      .then(rows => rows.map(row => ({
        ...row.ticket_messages,
        user: row.users!
      })));

    return {
      ...ticket.tickets,
      user: ticket.users!,
      messages
    };
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db
      .insert(tickets)
      .values(ticket)
      .returning();
    return newTicket;
  }

  async updateTicketStatus(id: number, status: string): Promise<Ticket | undefined> {
    const [updatedTicket] = await db
      .update(tickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return updatedTicket || undefined;
  }

  async createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage> {
    const [newMessage] = await db
      .insert(ticketMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getTicketMessages(ticketId: number): Promise<(TicketMessage & { user: User })[]> {
    return await db
      .select()
      .from(ticketMessages)
      .leftJoin(users, eq(ticketMessages.userId, users.id))
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(ticketMessages.createdAt)
      .then(rows => rows.map(row => ({
        ...row.ticket_messages,
        user: row.users!
      })));
  }

  async getAllPasswordChangeRequests(): Promise<(PasswordChangeRequest & { user: User })[]> {
    return await db
      .select()
      .from(passwordChangeRequests)
      .leftJoin(users, eq(passwordChangeRequests.userId, users.id))
      .where(eq(passwordChangeRequests.status, "pending"))
      .orderBy(desc(passwordChangeRequests.requestedAt))
      .then(rows => rows.map(row => ({
        ...row.password_change_requests,
        user: row.users!
      })));
  }

  async createPasswordChangeRequest(request: InsertPasswordChangeRequest): Promise<PasswordChangeRequest> {
    const [newRequest] = await db
      .insert(passwordChangeRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updatePasswordChangeRequest(id: number, status: string, processedBy: number): Promise<PasswordChangeRequest | undefined> {
    const [updatedRequest] = await db
      .update(passwordChangeRequests)
      .set({ 
        status, 
        processedBy, 
        processedAt: new Date() 
      })
      .where(eq(passwordChangeRequests.id, id))
      .returning();
    return updatedRequest || undefined;
  }
}

export const storage = new DatabaseStorage();
