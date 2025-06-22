--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.products (id, name, description, price, features, category, status, created_at) VALUES (1, 'AI Assistant Pro', 'Advanced conversational AI assistant for business automation and customer support', 99.99, '{"24/7 Availability","Multi-language Support","Custom Training","API Integration"}', 'AI Assistant', 'active', '2025-06-21 14:42:44.73893');
INSERT INTO public.products (id, name, description, price, features, category, status, created_at) VALUES (2, 'Smart Analytics Dashboard', 'Comprehensive business intelligence platform with AI-powered insights', 149.99, '{"Real-time Analytics","Custom Reports","Data Visualization","Predictive Modeling"}', 'Analytics', 'active', '2025-06-21 14:42:44.73893');
INSERT INTO public.products (id, name, description, price, features, category, status, created_at) VALUES (3, 'Workflow Automation Suite', 'Streamline your business processes with intelligent automation tools', 199.99, '{"Process Automation","Task Scheduling","Email Integration","Custom Workflows"}', 'Automation', 'active', '2025-06-21 14:42:44.73893');
INSERT INTO public.products (id, name, description, price, features, category, status, created_at) VALUES (4, 'Basic AI Chatbot', 'Simple chatbot solution for small businesses and startups', 29.99, '{"Pre-built Templates","Easy Setup","Basic Analytics","Email Support"}', 'AI Assistant', 'active', '2025-06-21 14:42:44.73893');
INSERT INTO public.products (id, name, description, price, features, category, status, created_at) VALUES (5, 'Enterprise Analytics', 'Full-scale analytics solution for large organizations', 499.99, '{"Advanced Security","Custom Integrations","Dedicated Support","Unlimited Users"}', 'Analytics', 'active', '2025-06-21 14:42:44.73893');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users (id, username, email, password, first_name, last_name, role, status, profile_image, created_at) VALUES (1, 'admin', 'admin@botforge.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'owner', 'active', NULL, '2025-06-21 14:43:14.184068');
INSERT INTO public.users (id, username, email, password, first_name, last_name, role, status, profile_image, created_at) VALUES (2, 'johndoe', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'customer', 'active', NULL, '2025-06-21 14:43:14.184068');
INSERT INTO public.users (id, username, email, password, first_name, last_name, role, status, profile_image, created_at) VALUES (3, 'janedoe', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Doe', 'customer', 'active', NULL, '2025-06-21 14:43:14.184068');
INSERT INTO public.users (id, username, email, password, first_name, last_name, role, status, profile_image, created_at) VALUES (4, 'manager1', 'manager@botforge.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice', 'Manager', 'manager', 'active', NULL, '2025-06-22 13:18:51.214574');
INSERT INTO public.users (id, username, email, password, first_name, last_name, role, status, profile_image, created_at) VALUES (5, 'dev1', 'dev@botforge.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Developer', 'developer', 'active', NULL, '2025-06-22 13:18:51.214574');
INSERT INTO public.users (id, username, email, password, first_name, last_name, role, status, profile_image, created_at) VALUES (6, 'user1', 'user@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Charlie', 'User', 'user', 'active', NULL, '2025-06-22 13:18:51.214574');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.orders (id, user_id, product_id, status, amount, created_at, updated_at) VALUES (1, 1, 2, 'pending', 149.99, '2025-06-21 14:54:05.457707', '2025-06-21 14:54:05.457707');


--
-- Data for Name: password_change_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.reviews (id, user_id, rating, content, created_at) VALUES (1, 2, 5, 'Amazing AI assistant! It has completely transformed how we handle customer support. The integration was seamless and the results were immediate.', '2025-06-21 14:43:22.059533');
INSERT INTO public.reviews (id, user_id, rating, content, created_at) VALUES (2, 3, 4, 'Great analytics dashboard with powerful insights. The real-time data visualization helps us make better business decisions quickly.', '2025-06-21 14:43:22.059533');
INSERT INTO public.reviews (id, user_id, rating, content, created_at) VALUES (3, 2, 5, 'The workflow automation suite saved us countless hours. Setting up custom workflows was intuitive and the results exceeded our expectations.', '2025-06-21 14:43:22.059533');


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: ticket_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: updates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.updates (id, title, content, author_id, is_feature_update, is_important, created_at) VALUES (1, 'Welcome to BotForge 2.0', 'We are excited to announce the launch of BotForge 2.0 with enhanced AI capabilities, improved user interface, and better performance. This major update includes new automation tools and advanced analytics features.', 1, true, true, '2025-06-21 14:43:31.069724');
INSERT INTO public.updates (id, title, content, author_id, is_feature_update, is_important, created_at) VALUES (2, 'New Analytics Dashboard Released', 'Our new analytics dashboard is now live! Get deeper insights into your business data with real-time visualizations, custom reports, and predictive modeling capabilities.', 1, true, false, '2025-06-21 14:43:31.069724');
INSERT INTO public.updates (id, title, content, author_id, is_feature_update, is_important, created_at) VALUES (3, 'Maintenance Window Scheduled', 'We will be performing scheduled maintenance on December 25th from 2:00 AM to 4:00 AM UTC. During this time, some services may be temporarily unavailable.', 1, false, true, '2025-06-21 14:43:31.069724');


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- Name: password_change_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.password_change_requests_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.products_id_seq', 5, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reviews_id_seq', 3, true);


--
-- Name: ticket_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ticket_messages_id_seq', 1, false);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tickets_id_seq', 1, false);


--
-- Name: updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.updates_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

