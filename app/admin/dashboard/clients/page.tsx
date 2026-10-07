"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Calendar,
  Building2,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Package,
  Layers,
  ArrowDownRight,
  Eye,
  X,
  Save,
  Receipt,
  Check,
  RotateCcw,
  Flame,
  AlertTriangle,
  Sparkles,
  Coins,
  Truck,
} from "lucide-react";
import { Client, ClientOrder, DeliveryInstallment, Product } from "@/lib/types";

export default function ClientsAndOrdersPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [trashedOrders, setTrashedOrders] = useState<ClientOrder[]>([]);
  const [trashedClients, setTrashedClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active view tab: 'orders' | 'clients' | 'overview' | 'trash'
  const [activeTab, setActiveTab] = useState<"orders" | "clients" | "overview" | "trash">("orders");
  const [trashSubTab, setTrashSubTab] = useState<"orders" | "clients">("orders");

  // Selected Currency for KPIs: 'ALL' | 'TND' | 'EUR' | 'USD'
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ALL");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  // Modals state
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ClientOrder | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<ClientOrder | null>(null);

  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<ClientOrder | null>(null);

  // Confirmation Modal (like messages)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: "trash_order" | "trash_client" | "permanent_order" | "permanent_client" | "empty_trash_orders" | "empty_trash_clients";
    id?: string;
    label?: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionType: "trash_order",
  });

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: "",
    tax_id: "",
    contact_person: "",
    email: "",
    phone: "",
    country: "Tunisie",
    address: "",
    notes: "",
  });

  // Order form state
  const [orderForm, setOrderForm] = useState({
    order_number: "",
    client_id: "",
    product_id: "",
    product_name: "",
    packaging: "Flexitank 22,000L",
    quantity: "22",
    unit: "Tonnes",
    unit_price: "",
    currency: "TND",
    total_amount: "",
    paid_amount: "0",
    payment_date: new Date().toISOString().split("T")[0],
    order_date: new Date().toISOString().split("T")[0],
    order_status: "confirmed",
    notes: "",
  });

  // Payment installment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "virement",
    reference: "",
    notes: "",
  });

  // Delivery installment form state
  const [deliveryForm, setDeliveryForm] = useState({
    quantity: "",
    delivery_date: new Date().toISOString().split("T")[0],
    bl_number: "",
    notes: "",
  });


  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Load all clients, orders, products, and stats
  const fetchData = async () => {
    try {
      const ts = Date.now();
      const [ordersRes, clientsRes, trashedOrdersRes, trashedClientsRes] = await Promise.all([
        fetch(`/api/admin/orders?mode=active&_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
        fetch(`/api/admin/clients?mode=active&_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
        fetch(`/api/admin/orders?mode=trash&_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
        fetch(`/api/admin/clients?mode=trash&_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
      ]);

      const ordersData = await ordersRes.json();
      const clientsData = await clientsRes.json();
      const trashedOrdersData = await trashedOrdersRes.json();
      const trashedClientsData = await trashedClientsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.orders || []);
        setStats(ordersData.stats || null);
        setProducts(ordersData.products || []);
      }
      if (clientsData.success) {
        setClients(clientsData.clients || []);
      }
      if (trashedOrdersData.success) {
        setTrashedOrders(trashedOrdersData.orders || []);
      }
      if (trashedClientsData.success) {
        setTrashedClients(trashedClientsData.clients || []);
      }
    } catch (err) {
      console.error("Error fetching clients/orders data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Open client modal
  const openClientModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setClientForm({
        name: client.name,
        tax_id: client.tax_id || "",
        contact_person: client.contact_person || "",
        email: client.email || "",
        phone: client.phone || "",
        country: client.country || "Tunisie",
        address: client.address || "",
        notes: client.notes || "",
      });
    } else {
      setEditingClient(null);
      setClientForm({
        name: "",
        tax_id: "",
        contact_person: "",
        email: "",
        phone: "",
        country: "Tunisie",
        address: "",
        notes: "",
      });
    }
    setClientModalOpen(true);
  };

  // Save client
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name.trim()) {
      alert("Le nom du client est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingClient) {
        const res = await fetch("/api/admin/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClient.id, ...clientForm }),
        });
        const data = await res.json();
        if (data.success) {
          showNotification("Client mis à jour avec succès !");
          setClientModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "Erreur de mise à jour");
        }
      } else {
        const res = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientForm),
        });
        const data = await res.json();
        if (data.success) {
          showNotification("Nouveau client ajouté avec succès !");
          setClientModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "Erreur d'ajout");
        }
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open order modal
  const openOrderModal = (order?: ClientOrder) => {
    if (order) {
      setEditingOrder(order);
      setOrderForm({
        order_number: order.order_number,
        client_id: order.client_id,
        product_id: order.product_id || "",
        product_name: order.product_name,
        packaging: order.packaging || "Flexitank 22,000L",
        quantity: String(order.quantity),
        unit: order.unit || "Tonnes",
        unit_price: order.unit_price ? String(order.unit_price) : "",
        currency: order.currency || "TND",
        total_amount: String(order.total_amount),
        paid_amount: String(order.paid_amount),
        payment_date: order.payment_date || new Date().toISOString().split("T")[0],
        order_date: order.order_date || new Date().toISOString().split("T")[0],
        order_status: order.order_status || "confirmed",
        notes: order.notes || "",
      });
    } else {
      setEditingOrder(null);
      const defaultClient = clients[0]?.id || "";
      const defaultProduct = products[0]?.translations?.fr?.name || "Huile d'Olive Extra Vierge Biologique";
      const defaultProdId = products[0]?.id || "";

      setOrderForm({
        order_number: `CMD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`,
        client_id: defaultClient,
        product_id: defaultProdId,
        product_name: defaultProduct,
        packaging: "Flexitank 22,000L",
        quantity: "22",
        unit: "Tonnes",
        unit_price: "24",
        currency: "TND",
        total_amount: "528000",
        paid_amount: "0",
        payment_date: new Date().toISOString().split("T")[0],
        order_date: new Date().toISOString().split("T")[0],
        order_status: "confirmed",
        notes: "",
      });
    }
    setOrderModalOpen(true);
  };

  // Auto calculate total when qty or unit price changes
  const handleQtyPriceChange = (qtyStr: string, priceStr: string) => {
    const q = parseFloat(qtyStr) || 0;
    const p = parseFloat(priceStr) || 0;
    const total = q * p;
    setOrderForm((prev) => ({
      ...prev,
      quantity: qtyStr,
      unit_price: priceStr,
      total_amount: total > 0 ? String(total) : prev.total_amount,
    }));
  };

  // Save order
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.client_id) {
      alert("Veuillez sélectionner un client.");
      return;
    }
    if (!orderForm.product_name) {
      alert("Veuillez choisir un produit.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingOrder) {
        const res = await fetch("/api/admin/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingOrder.id, ...orderForm }),
        });
        const data = await res.json();
        if (data.success) {
          if (data.order) {
            setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
          }
          showNotification("Commande mise à jour avec succès !");
          setOrderModalOpen(false);
          await fetchData();
        } else {
          alert(data.error || "Erreur de mise à jour");
        }
      } else {
        const res = await fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderForm),
        });
        const data = await res.json();
        if (data.success) {
          if (data.order) {
            setOrders((prev) => [data.order, ...prev.filter((o) => o.id !== data.order.id)]);
          }
          showNotification("Nouvelle commande créée avec succès !");
          setOrderModalOpen(false);
          await fetchData();
        } else {
          alert(data.error || "Erreur de création");
        }
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Payment installment modal
  const openPaymentModal = (order: ClientOrder) => {
    const freshOrder = orders.find((o) => o.id === order.id) || order;
    setSelectedOrderForPayment(freshOrder);
    setPaymentForm({
      amount: String(freshOrder.remaining_amount > 0 ? freshOrder.remaining_amount : ""),
      date: new Date().toISOString().split("T")[0],
      method: "virement",
      reference: "",
      notes: `Versement pour commande ${freshOrder.order_number}`,
    });
    setPaymentModalOpen(true);
  };

  // Submit Payment installment
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPayment) return;
    const amt = parseFloat(paymentForm.amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }

    const currentRemaining = typeof selectedOrderForPayment.remaining_amount === "number"
      ? selectedOrderForPayment.remaining_amount
      : Math.max(0, selectedOrderForPayment.total_amount - (selectedOrderForPayment.paid_amount || 0));

    if (amt > currentRemaining + 0.001) {
      alert(
        `Montant excessif : Le montant saisi (${amt.toLocaleString()} ${selectedOrderForPayment.currency}) dépasse le reste dû (${currentRemaining.toLocaleString()} ${selectedOrderForPayment.currency}).`
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrderForPayment.id,
          ...paymentForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.order) {
          setOrders((prev) =>
            prev.map((o) => (o.id === data.order.id ? data.order : o))
          );
        }
        showNotification(`Paiement de ${amt.toLocaleString()} ${selectedOrderForPayment.currency} enregistré !`);
        setPaymentModalOpen(false);
        await fetchData();
      } else {
        alert(data.error || "Erreur lors de l'enregistrement du paiement.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delivery installment modal
  const openDeliveryModal = (order: ClientOrder) => {
    const freshOrder = orders.find((o) => o.id === order.id) || order;
    setSelectedOrderForDelivery(freshOrder);
    const totalQty = Number(freshOrder.quantity) || 0;
    const delivered = Number(freshOrder.delivered_quantity) || (freshOrder.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
    const remainQty = Math.max(0, totalQty - delivered);
    setDeliveryForm({
      quantity: remainQty > 0 ? String(remainQty) : "",
      delivery_date: new Date().toISOString().split("T")[0],
      bl_number: "",
      notes: `Livraison pour commande ${freshOrder.order_number}`,
    });
    setDeliveryModalOpen(true);
  };

  // Submit Delivery installment
  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDelivery) return;
    const qty = parseFloat(deliveryForm.quantity);
    if (isNaN(qty) || qty <= 0) {
      alert("Veuillez saisir une quantité valide.");
      return;
    }

    const totalQty = Number(selectedOrderForDelivery.quantity) || 0;
    const delivered = Number(selectedOrderForDelivery.delivered_quantity) || (selectedOrderForDelivery.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
    const remainQty = Math.max(0, totalQty - delivered);

    if (qty > remainQty + 0.0001) {
      alert(
        `Quantité excessive : La quantité saisie (${qty.toLocaleString()} ${selectedOrderForDelivery.unit}) dépasse la quantité restante à livrer (${remainQty.toLocaleString()} ${selectedOrderForDelivery.unit}).`
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrderForDelivery.id,
          ...deliveryForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.order) {
          setOrders((prev) =>
            prev.map((o) => (o.id === data.order.id ? data.order : o))
          );
        }
        showNotification(`Livraison de ${qty.toLocaleString()} ${selectedOrderForDelivery.unit} enregistrée !`);
        setDeliveryModalOpen(false);
        await fetchData();
      } else {
        alert(data.error || "Erreur lors de l'enregistrement de la livraison.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= TRASH & RESTORE ACTIONS =================
  // Move order to trash
  const handleTrashOrder = async (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Mettre la commande à la corbeille ?",
      description: `La commande "${label}" sera déplacée vers la corbeille. Vous pourrez la restaurer à tout moment.`,
      actionType: "trash_order",
      id,
      label,
    });
  };

  // Move client to trash
  const handleTrashClient = async (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Mettre le client à la corbeille ?",
      description: `Le client "${label}" sera déplacé vers la corbeille. Vous pourrez le restaurer à tout moment.`,
      actionType: "trash_client",
      id,
      label,
    });
  };

  // Restore order from trash
  const handleRestoreOrder = async (id: string) => {
    const targetOrder = trashedOrders.find((o) => o.id === id);
    if (targetOrder) {
      setTrashedOrders((prev) => prev.filter((o) => o.id !== id));
      setOrders((prev) => [{ ...targetOrder, deleted_at: undefined }, ...prev]);
    }
    showNotification("Commande restaurée avec succès !");

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "restore" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch {
      alert("Erreur lors de la restauration.");
      fetchData();
    }
  };

  // Restore client from trash
  const handleRestoreClient = async (id: string) => {
    const targetClient = trashedClients.find((c) => c.id === id);
    if (targetClient) {
      setTrashedClients((prev) => prev.filter((c) => c.id !== id));
      setClients((prev) => [{ ...targetClient, deleted_at: undefined }, ...prev]);
    }
    showNotification("Client restauré avec succès !");

    try {
      const res = await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "restore" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch {
      alert("Erreur lors de la restauration.");
      fetchData();
    }
  };

  // Permanent Delete Order
  const handlePermanentDeleteOrder = async (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer définitivement la commande ?",
      description: `Attention : La commande "${label}" sera définitivement effacée. Cette action est irréversible.`,
      actionType: "permanent_order",
      id,
      label,
    });
  };

  // Permanent Delete Client
  const handlePermanentDeleteClient = async (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer définitivement le client ?",
      description: `Attention : Le client "${label}" sera définitivement effacé de la base de données.`,
      actionType: "permanent_client",
      id,
      label,
    });
  };

  // Execute confirmed modal action
  const executeConfirmAction = async () => {
    try {
      if (confirmModal.actionType === "trash_order" && confirmModal.id) {
        const orderId = confirmModal.id;
        const target = orders.find((o) => o.id === orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (target) {
          setTrashedOrders((prev) => [{ ...target, deleted_at: new Date().toISOString() }, ...prev]);
        }
        showNotification("Commande déplacée vers la corbeille.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } else if (confirmModal.actionType === "trash_client" && confirmModal.id) {
        const clientId = confirmModal.id;
        const target = clients.find((c) => c.id === clientId);
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        if (target) {
          setTrashedClients((prev) => [{ ...target, deleted_at: new Date().toISOString() }, ...prev]);
        }
        showNotification("Client déplacé vers la corbeille.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const res = await fetch(`/api/admin/clients?id=${clientId}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } else if (confirmModal.actionType === "permanent_order" && confirmModal.id) {
        const orderId = confirmModal.id;
        setTrashedOrders((prev) => prev.filter((o) => o.id !== orderId));
        showNotification("Commande supprimée définitivement.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const res = await fetch(`/api/admin/orders?id=${orderId}&permanent=true`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } else if (confirmModal.actionType === "permanent_client" && confirmModal.id) {
        const clientId = confirmModal.id;
        setTrashedClients((prev) => prev.filter((c) => c.id !== clientId));
        showNotification("Client supprimé définitivement.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const res = await fetch(`/api/admin/clients?id=${clientId}&permanent=true`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } else if (confirmModal.actionType === "empty_trash_orders") {
        setTrashedOrders([]);
        showNotification("Corbeille des commandes vidée.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const res = await fetch("/api/admin/orders?empty_trash=true", { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } else if (confirmModal.actionType === "empty_trash_clients") {
        setTrashedClients([]);
        showNotification("Corbeille des clients vidée.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const res = await fetch("/api/admin/clients?empty_trash=true", { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.client_tax_id && o.client_tax_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        o.product_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" || o.payment_status === statusFilter;

      const matchClient =
        clientFilter === "all" || o.client_id === clientFilter;

      const matchCurrency =
        selectedCurrency === "ALL" || o.currency === selectedCurrency;

      return matchSearch && matchStatus && matchClient && matchCurrency;
    });
  }, [orders, searchQuery, statusFilter, clientFilter, selectedCurrency]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.tax_id && c.tax_id.toLowerCase().includes(q)) ||
        c.contact_person.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    });
  }, [clients, searchQuery]);

  // Currency specific calculations
  const currencyStats = useMemo(() => {
    const list = selectedCurrency === "ALL" ? orders : orders.filter((o) => o.currency === selectedCurrency);
    const rev = list.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
    const paid = list.reduce((s, o) => s + (Number(o.paid_amount) || 0), 0);
    const rem = list.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0);

    // Also get breakdown for TND and EUR separately for clean badge display
    const tndOrders = orders.filter((o) => o.currency === "TND");
    const eurOrders = orders.filter((o) => o.currency === "EUR");
    const usdOrders = orders.filter((o) => o.currency === "USD");

    return {
      filteredRevenue: rev,
      filteredPaid: paid,
      filteredRemaining: rem,
      filteredCount: list.length,
      tnd: {
        revenue: tndOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0),
        paid: tndOrders.reduce((s, o) => s + (Number(o.paid_amount) || 0), 0),
        remaining: tndOrders.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0),
        count: tndOrders.length,
      },
      eur: {
        revenue: eurOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0),
        paid: eurOrders.reduce((s, o) => s + (Number(o.paid_amount) || 0), 0),
        remaining: eurOrders.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0),
        count: eurOrders.length,
      },
      usd: {
        revenue: usdOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0),
        paid: usdOrders.reduce((s, o) => s + (Number(o.paid_amount) || 0), 0),
        remaining: usdOrders.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0),
        count: usdOrders.length,
      },
    };
  }, [orders, selectedCurrency]);

  const totalTrashCount = trashedOrders.length + trashedClients.length;

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-500">
        Chargement des clients et commandes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with High-End Nouveau Client Button */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-verdalia-olive/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
              Espace Commercial & Financier
            </span>
            <span className="text-[10px] font-semibold text-gray-400">Verdalia Company VC</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1.5">
            Clients, Commandes & Suivi des Paiements
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Gestion des clients avec Matricule Fiscal, suivi des commandes d&apos;huiles, encaissements par devise (TND, EUR, USD), et historique corbeille.
          </p>
        </div>

        {/* Action Buttons with Stunning Nouveau Client Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Magnificently Styled "Nouveau Client" Button */}
          <button
            onClick={() => openClientModal()}
            className="group relative inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#192E15] via-[#24431E] to-[#192E15] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-xl transition-all duration-300 border border-verdalia-gold/40 hover:border-verdalia-gold hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-6 h-6 rounded-lg bg-verdalia-gold/20 flex items-center justify-center text-verdalia-gold group-hover:rotate-12 transition-transform duration-300 shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="bg-gradient-to-r from-white via-[#F5E6C8] to-white bg-clip-text text-transparent font-serif tracking-wider text-xs font-bold drop-shadow-sm">
              + Nouveau Client B2B
            </span>
            <span className="px-1.5 py-0.5 rounded bg-verdalia-gold/20 text-verdalia-gold text-[9px] font-mono uppercase tracking-wider font-extrabold border border-verdalia-gold/30">
              MF
            </span>
          </button>

          {/* Nouvelle Commande Button */}
          <button
            onClick={() => openOrderModal()}
            className="btn-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Commande</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{actionMessage}</span>
        </div>
      )}

      {/* Financial Currency Selector & KPI Cards */}
      <div className="space-y-3">
        {/* Currency Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-verdalia-gold" />
            <span className="text-xs font-bold text-gray-700">Devise affichée :</span>
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
              <button
                onClick={() => setSelectedCurrency("ALL")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  selectedCurrency === "ALL"
                    ? "bg-white text-verdalia-dark shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Toutes les devises
              </button>
              <button
                onClick={() => setSelectedCurrency("TND")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedCurrency === "TND"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>🇹🇳 TND (Dinar)</span>
                {currencyStats.tnd.count > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/20">{currencyStats.tnd.count}</span>
                )}
              </button>
              <button
                onClick={() => setSelectedCurrency("EUR")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedCurrency === "EUR"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>🇪🇺 EUR (Euro)</span>
                {currencyStats.eur.count > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/20">{currencyStats.eur.count}</span>
                )}
              </button>
              <button
                onClick={() => setSelectedCurrency("USD")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedCurrency === "USD"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>🇺🇸 USD ($)</span>
              </button>
            </div>
          </div>

          {/* Quick Currency Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {currencyStats.tnd.count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                TND Reste: {currencyStats.tnd.remaining.toLocaleString()} TND
              </span>
            )}
            {currencyStats.eur.count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                EUR Reste: {currencyStats.eur.remaining.toLocaleString()} EUR
              </span>
            )}
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Chiffre d'Affaires */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Chiffre d&apos;Affaires Total
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-verdalia-dark mt-2">
              {currencyStats.filteredRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}{" "}
              <span className="text-sm font-semibold text-verdalia-olive">
                {selectedCurrency === "ALL" ? "(Cumul)" : selectedCurrency}
              </span>
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {currencyStats.filteredCount} commande(s) active(s)
            </p>
          </div>

          {/* Total Encaissé / Paid */}
          <div className="bg-white p-5 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Total Encaissé (Flous reçu)
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">
              {currencyStats.filteredPaid.toLocaleString(undefined, { minimumFractionDigits: 0 })}{" "}
              <span className="text-sm font-semibold text-emerald-600">
                {selectedCurrency === "ALL" ? "(Cumul)" : selectedCurrency}
              </span>
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {currencyStats.filteredRevenue > 0
                ? `${((currencyStats.filteredPaid / currencyStats.filteredRevenue) * 100).toFixed(1)}% recouvré`
                : "0%"}
            </p>
          </div>

          {/* Total Reste à Payer / Balance Due */}
          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Reste Flous (À Recouvrer)
              </span>
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-800 mt-2">
              {currencyStats.filteredRemaining.toLocaleString(undefined, { minimumFractionDigits: 0 })}{" "}
              <span className="text-sm font-bold text-amber-700">
                {selectedCurrency === "ALL" ? "(Cumul)" : selectedCurrency}
              </span>
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Créances clients à encaisser
            </p>
          </div>

          {/* Total Clients */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Clients B2B Actifs
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-verdalia-dark mt-2">
              {clients.length}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Comptes avec Matricule Fiscal
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "bg-white text-verdalia-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Commandes & Reste Flous ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "clients"
                  ? "bg-white text-verdalia-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clients & Matricule Fiscal ({clients.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-white text-verdalia-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Synthèse par Client</span>
            </button>
            <button
              onClick={() => setActiveTab("trash")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "trash"
                  ? "bg-rose-50 text-rose-800 shadow-sm border border-rose-200"
                  : "text-gray-500 hover:text-rose-700"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Corbeille</span>
              {totalTrashCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono">
                  {totalTrashCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar & filter */}
          {activeTab !== "trash" && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={activeTab === "clients" ? "Rechercher client, MF..." : "Rechercher réf, client, MF, produit..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-verdalia-olive transition-colors"
                />
              </div>

              {activeTab === "orders" && (
                <>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="paid">Payé 100%</option>
                    <option value="partial">Paiement Partiel (Reste)</option>
                    <option value="pending">En attente (Impayé)</option>
                  </select>

                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none"
                  >
                    <option value="all">Tous les clients</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: ACTIVE ORDERS */}
        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-500">
                Aucune commande trouvée. Cliquez sur &quot;Nouvelle Commande&quot; pour en ajouter une.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Réf & Date</th>
                    <th className="py-3 px-4">Client & Matricule Fiscal</th>
                    <th className="py-3 px-4">Produit & Conditionnement</th>
                    <th className="py-3 px-4 text-right">Montant Total</th>
                    <th className="py-3 px-4 text-right">Flous Payé</th>
                    <th className="py-3 px-4 text-right">Reste Flous</th>
                    <th className="py-3 px-4 text-center">Statut Paiement</th>
                    <th className="py-3 px-4 text-center">Livraison / Expédition</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const isFullyPaid = order.payment_status === "paid" || order.remaining_amount <= 0;
                    const isPartial = order.payment_status === "partial" && order.remaining_amount > 0;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Order Ref & Date */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-verdalia-dark">{order.order_number}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>{order.order_date}</span>
                          </p>
                        </td>

                        {/* Client & Matricule Fiscal */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-gray-900">{order.client_name}</p>
                          {order.client_tax_id ? (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold mt-0.5">
                              MF: {order.client_tax_id}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">MF non renseigné</span>
                          )}
                        </td>

                        {/* Product & Quantity */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-verdalia-olive">{order.product_name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {order.quantity} {order.unit} • {order.packaging}
                          </p>
                        </td>

                        {/* Total Amount in order's currency */}
                        <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                          {order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 0 })} {order.currency}
                        </td>

                        {/* Paid Amount & Payment Date */}
                        <td className="py-3.5 px-4 text-right">
                          <p className="font-bold text-emerald-700">
                            {order.paid_amount.toLocaleString(undefined, { minimumFractionDigits: 0 })} {order.currency}
                          </p>
                          {order.payment_date && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Payé le: {order.payment_date}
                            </p>
                          )}
                          {order.payments && order.payments.length > 1 && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              ({order.payments.length} versements)
                            </span>
                          )}
                        </td>

                        {/* Remaining Amount in order's currency */}
                        <td className="py-3.5 px-4 text-right">
                          <p
                            className={`font-bold ${
                              order.remaining_amount > 0 ? "text-amber-800 font-extrabold" : "text-gray-400"
                            }`}
                          >
                            {order.remaining_amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}{" "}
                            {order.currency}
                          </p>
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-4 text-center">
                          {isFullyPaid ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Payé 100%
                            </span>
                          ) : isPartial ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Partiel (Reste)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              En attente
                            </span>
                          )}
                        </td>

                        {/* Delivery status and progress bar */}
                        <td className="py-3.5 px-4 text-center">
                          {(() => {
                            const totalQty = Number(order.quantity) || 0;
                            const deliveredQty = Number(order.delivered_quantity) || (order.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
                            const deliveryPercentage = totalQty > 0 ? Math.min(100, Math.round((deliveredQty / totalQty) * 100)) : 0;
                            const deliveryStatus = order.delivery_status || (deliveredQty >= totalQty && totalQty > 0 ? "fully_delivered" : deliveredQty > 0 ? "partially_delivered" : "pending");

                            return (
                              <div className="flex flex-col items-center gap-1 min-w-[130px]">
                                {deliveryStatus === "fully_delivered" ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Livrée
                                  </span>
                                ) : deliveryStatus === "partially_delivered" ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Partiellement livrée
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                    Non livrée
                                  </span>
                                )}

                                <span className="text-[10px] font-semibold text-gray-700">
                                  {deliveredQty.toLocaleString()} / {totalQty.toLocaleString()} {order.unit}
                                </span>

                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      deliveryStatus === "fully_delivered"
                                        ? "bg-emerald-500"
                                        : deliveryStatus === "partially_delivered"
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                    }`}
                                    style={{ width: `${deliveryPercentage}%` }}
                                  />
                                </div>

                                {order.delivery_installments && order.delivery_installments.length > 0 && (
                                  <span className="text-[9px] text-gray-400 font-medium">
                                    ({order.delivery_installments.length} expédition{order.delivery_installments.length > 1 ? "s" : ""})
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.remaining_amount > 0 && (
                              <button
                                onClick={() => openPaymentModal(order)}
                                className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                                title="Encaisser un versement"
                              >
                                <DollarSign className="w-3 h-3" />
                                <span>Paiement</span>
                              </button>
                            )}
                            <button
                              onClick={() => openDeliveryModal(order)}
                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                              title="Enregistrer une expédition / livraison"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Livraison</span>
                            </button>
                            <button
                              onClick={() => openOrderModal(order)}
                              className="p-1.5 text-gray-400 hover:text-verdalia-olive hover:bg-gray-100 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTrashOrder(order.id, order.order_number)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Déplacer vers la corbeille"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE CLIENTS */}
        {activeTab === "clients" && (
          <div className="overflow-x-auto">
            {filteredClients.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-500">
                Aucun client trouvé. Cliquez sur &quot;Nouveau Client B2B&quot; pour commencer.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Client / Société</th>
                    <th className="py-3 px-4">Matricule Fiscal (MF)</th>
                    <th className="py-3 px-4">Contact & Coordonnées</th>
                    <th className="py-3 px-4">Pays / Adresse</th>
                    <th className="py-3 px-4 text-center">Commandes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map((client) => {
                    const clientOrders = orders.filter((o) => o.client_id === client.id);
                    const clientRemaining = clientOrders.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0);
                    const clientCurrency = clientOrders[0]?.currency || "TND";

                    return (
                      <tr key={client.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-verdalia-dark text-sm">{client.name}</p>
                          {client.notes && (
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                              {client.notes}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {client.tax_id ? (
                            <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-mono font-bold text-xs border border-blue-200">
                              {client.tax_id}
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">Non renseigné</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 space-y-0.5">
                          <p className="font-semibold text-gray-800">{client.contact_person || "—"}</p>
                          {client.phone && (
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-verdalia-olive" />
                              <span>{client.phone}</span>
                            </p>
                          )}
                          {client.email && (
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-verdalia-olive" />
                              <span>{client.email}</span>
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-800 block">{client.country}</span>
                          <span className="text-[11px] text-gray-400">{client.address || "—"}</span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[11px]">
                            {clientOrders.length} commande(s)
                          </span>
                          {clientRemaining > 0 && (
                            <span className="block text-[10px] text-amber-700 font-bold mt-1">
                              Reste: {clientRemaining.toLocaleString()} {clientCurrency}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setClientFilter(client.id);
                                setActiveTab("orders");
                              }}
                              className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold transition-colors"
                              title="Voir ses commandes"
                            >
                              Commandes
                            </button>
                            <button
                              onClick={() => openClientModal(client)}
                              className="p-1.5 text-gray-400 hover:text-verdalia-olive hover:bg-gray-100 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTrashClient(client.id, client.name)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Déplacer vers la corbeille"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: SYNTHÈSE FINANCIÈRE PAR CLIENT */}
        {activeTab === "overview" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[11px] font-bold uppercase text-gray-500">Commandes Globales</span>
                <p className="text-xl font-bold text-verdalia-dark mt-1">
                  {orders.length} commande(s) active(s)
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-bold uppercase text-emerald-800">Recouvrement TND</span>
                <p className="text-xl font-bold text-emerald-800 mt-1">
                  {currencyStats.tnd.paid.toLocaleString()} TND
                </p>
                <span className="text-[10px] text-emerald-600">Reste: {currencyStats.tnd.remaining.toLocaleString()} TND</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[11px] font-bold uppercase text-blue-800">Recouvrement EUR</span>
                <p className="text-xl font-bold text-blue-800 mt-1">
                  {currencyStats.eur.paid.toLocaleString()} EUR
                </p>
                <span className="text-[10px] text-blue-600">Reste: {currencyStats.eur.remaining.toLocaleString()} EUR</span>
              </div>
            </div>

            <h3 className="font-serif text-base font-bold text-verdalia-dark pt-2">
              Bilan Financier par Client
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {clients.map((client) => {
                const cOrders = orders.filter((o) => o.client_id === client.id);
                const cOrdered = cOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
                const cPaid = cOrders.reduce((s, o) => s + (Number(o.paid_amount) || 0), 0);
                const cRemaining = cOrders.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0);
                const cCur = cOrders[0]?.currency || "TND";

                return (
                  <div key={client.id} className="p-4 bg-white hover:bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{client.name}</span>
                        {client.tax_id && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                            MF: {client.tax_id}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">({client.country})</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Interlocuteur: <span className="font-medium text-gray-700">{client.contact_person || "—"}</span> • {cOrders.length} commande(s)
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-right">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Commandé</span>
                        <span className="font-bold text-gray-900">{cOrdered.toLocaleString()} {cCur}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Payé</span>
                        <span className="font-bold text-emerald-700">{cPaid.toLocaleString()} {cCur}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-600 block">Reste Flous</span>
                        <span className={`font-bold ${cRemaining > 0 ? "text-amber-800 font-extrabold" : "text-gray-400"}`}>
                          {cRemaining.toLocaleString()} {cCur}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setClientFilter(client.id);
                          setActiveTab("orders");
                        }}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                        title="Voir les commandes détaillées"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CORBEILLE (TRASH BIN) - EXACTEMENT COMME LES MESSAGES */}
        {activeTab === "trash" && (
          <div className="p-6 space-y-5">
            <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-rose-900">
                    Corbeille des Éléments Supprimés
                  </h4>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Les commandes et clients dans la corbeille peuvent être restaurés à tout moment ou effacés définitivement.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: "Vider la corbeille ?",
                      description: "Attention : Tous les éléments supprimés seront définitivement purgés. Cette opération est irréversible.",
                      actionType: trashSubTab === "orders" ? "empty_trash_orders" : "empty_trash_clients",
                    });
                  }}
                  disabled={trashSubTab === "orders" ? trashedOrders.length === 0 : trashedClients.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Vider la corbeille</span>
                </button>
              </div>
            </div>

            {/* Sub-tabs: Commandes vs Clients in Trash */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <button
                onClick={() => setTrashSubTab("orders")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  trashSubTab === "orders"
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>Commandes à la corbeille</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-800 text-[10px]">
                  {trashedOrders.length}
                </span>
              </button>
              <button
                onClick={() => setTrashSubTab("clients")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  trashSubTab === "clients"
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>Clients à la corbeille</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-800 text-[10px]">
                  {trashedClients.length}
                </span>
              </button>
            </div>

            {/* Trashed Orders Table */}
            {trashSubTab === "orders" && (
              <div className="overflow-x-auto">
                {trashedOrders.length === 0 ? (
                  <div className="py-16 text-center text-xs text-gray-500">
                    La corbeille des commandes est vide.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Commande</th>
                        <th className="py-3 px-4">Client & MF</th>
                        <th className="py-3 px-4">Produit & Montant</th>
                        <th className="py-3 px-4">Date de suppression</th>
                        <th className="py-3 px-4 text-right">Actions Corbeille</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trashedOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {o.order_number}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-gray-900">{o.client_name}</p>
                            {o.client_tax_id && (
                              <span className="text-[10px] text-blue-700 font-mono">MF: {o.client_tax_id}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-800">{o.product_name}</p>
                            <p className="text-[11px] font-bold text-gray-600">
                              {o.total_amount.toLocaleString()} {o.currency}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-[11px]">
                            {o.deleted_at ? new Date(o.deleted_at).toLocaleString() : "Récemment"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestoreOrder(o.id)}
                                className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors flex items-center gap-1 border border-emerald-200"
                                title="Restaurer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restaurer</span>
                              </button>
                              <button
                                onClick={() => handlePermanentDeleteOrder(o.id, o.order_number)}
                                className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] transition-colors flex items-center gap-1 border border-rose-200"
                                title="Supprimer définitivement"
                              >
                                <Flame className="w-3 h-3" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Trashed Clients Table */}
            {trashSubTab === "clients" && (
              <div className="overflow-x-auto">
                {trashedClients.length === 0 ? (
                  <div className="py-16 text-center text-xs text-gray-500">
                    La corbeille des clients est vide.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Matricule Fiscal</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Date de suppression</th>
                        <th className="py-3 px-4 text-right">Actions Corbeille</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trashedClients.map((c) => (
                        <tr key={c.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {c.name}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-blue-800">
                            {c.tax_id || "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {c.contact_person} • {c.phone}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-[11px]">
                            {c.deleted_at ? new Date(c.deleted_at).toLocaleString() : "Récemment"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestoreClient(c.id)}
                                className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors flex items-center gap-1 border border-emerald-200"
                                title="Restaurer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restaurer</span>
                              </button>
                              <button
                                onClick={() => handlePermanentDeleteClient(c.id, c.name)}
                                className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] transition-colors flex items-center gap-1 border border-rose-200"
                                title="Supprimer définitivement"
                              >
                                <Flame className="w-3 h-3" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT CLIENT ================= */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setClientModalOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg absolute right-4 top-4"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
                Fiche Client
              </span>
              <h3 className="font-serif text-xl font-bold text-verdalia-dark mt-1">
                {editingClient ? "Modifier les coordonnées du client" : "Nouveau Client B2B (MF)"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Saisissez les informations de l&apos;entreprise, notamment le Matricule Fiscal (MF).
              </p>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Raison Sociale / Nom du Client *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Olio Mediterraneo S.R.L. ou Société XYZ"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-blue-800 mb-1">
                    Matricule Fiscal (MF / TVA) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1489201/A/M/000"
                    value={clientForm.tax_id}
                    onChange={(e) => setClientForm({ ...clientForm, tax_id: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg font-mono font-bold focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Responsable / Interlocuteur
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: M. Iheb ou Marco Rossi"
                    value={clientForm.contact_person}
                    onChange={(e) => setClientForm({ ...clientForm, contact_person: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: +216 53 228 867"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@client.com"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    placeholder="Tunisie, Italie, France..."
                    value={clientForm.country}
                    onChange={(e) => setClientForm({ ...clientForm, country: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Adresse Complète
                  </label>
                  <input
                    type="text"
                    placeholder="Zone Industrielle, Ville..."
                    value={clientForm.address}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Notes / Observations
                </label>
                <textarea
                  rows={2}
                  placeholder="Modalités de paiement convenues, préférences..."
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-verdalia-olive"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? "Enregistrement..." : "Enregistrer Client"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT ORDER ================= */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-scaleUp my-8">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg absolute right-4 top-4"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
                Bordereau de Commande
              </span>
              <h3 className="font-serif text-xl font-bold text-verdalia-dark mt-1">
                {editingOrder ? "Modifier la Commande" : "Créer une Nouvelle Commande"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Choisissez le client, l&apos;huile selon les produits disponibles, la devise (TND, EUR, USD), la quantité et le versement.
              </p>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Référence de la Commande
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.order_number}
                    onChange={(e) => setOrderForm({ ...orderForm, order_number: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono font-bold focus:bg-white focus:outline-none focus:border-verdalia-olive"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Client Associé (MF) *
                  </label>
                  <select
                    required
                    value={orderForm.client_id}
                    onChange={(e) => setOrderForm({ ...orderForm, client_id: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg font-semibold focus:outline-none focus:border-verdalia-olive"
                  >
                    <option value="">-- Sélectionner un client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.tax_id ? `(MF: ${c.tax_id})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product selection according to available products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-verdalia-olive mb-1">
                    Produit Disponible *
                  </label>
                  <select
                    required
                    value={orderForm.product_name}
                    onChange={(e) => {
                      const selectedProd = products.find(
                        (p) => p.translations?.fr?.name === e.target.value || p.slug === e.target.value
                      );
                      setOrderForm({
                        ...orderForm,
                        product_name: e.target.value,
                        product_id: selectedProd?.id || "",
                      });
                    }}
                    className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-lg font-bold text-verdalia-dark focus:outline-none focus:border-verdalia-olive"
                  >
                    {products.map((p) => {
                      const label = p.translations?.fr?.name || p.slug;
                      return (
                        <option key={p.id} value={label}>
                          {label}
                        </option>
                      );
                    })}
                    <option value="Huile d'Olive Extra Vierge Biologique">Huile d&apos;Olive Extra Vierge Biologique</option>
                    <option value="Huile d'Olive Extra Vierge Conventionnelle">Huile d&apos;Olive Extra Vierge Conventionnelle</option>
                    <option value="Huile d'Olive Raffinée">Huile d&apos;Olive Raffinée</option>
                    <option value="Huile de Grignons d'Olive">Huile de Grignons d&apos;Olive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Conditionnement / Format
                  </label>
                  <select
                    value={orderForm.packaging}
                    onChange={(e) => setOrderForm({ ...orderForm, packaging: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="Flexitank 22,000L">Flexitank 22,000L (Maritime)</option>
                    <option value="IBC 1000L">IBC 1000L (Containers)</option>
                    <option value="Fûts 200L">Fûts Métalliques 200L</option>
                    <option value="Citernes Routières">Citernes Routières Inox</option>
                    <option value="Vrac Terminal Portuaire">Vrac Terminal Portuaire</option>
                  </select>
                </div>
              </div>

              {/* Quantity, Unit, Price, Currency */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={orderForm.quantity}
                    onChange={(e) => handleQtyPriceChange(e.target.value, orderForm.unit_price)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Unité
                  </label>
                  <select
                    value={orderForm.unit}
                    onChange={(e) => setOrderForm({ ...orderForm, unit: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="Tonnes">Tonnes</option>
                    <option value="Litres">Litres</option>
                    <option value="Kg">Kg</option>
                    <option value="IBC">Unités IBC</option>
                    <option value="Fûts">Fûts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Prix Unitaire
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ex: 24 ou 7500"
                    value={orderForm.unit_price}
                    onChange={(e) => handleQtyPriceChange(orderForm.quantity, e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-emerald-800 mb-1">
                    Devise (Monnaie) *
                  </label>
                  <select
                    value={orderForm.currency}
                    onChange={(e) => setOrderForm({ ...orderForm, currency: e.target.value })}
                    className="w-full px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-900"
                  >
                    <option value="TND">TND (Dinar Tunisien)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="USD">USD ($ Dollar)</option>
                  </select>
                </div>
              </div>

              {/* Financials: Montant total, Flous Payé, Reste calculation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-verdalia-offwhite rounded-xl border border-verdalia-olive/20">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-verdalia-dark mb-1">
                    Montant Total Commande *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      required
                      value={orderForm.total_amount}
                      onChange={(e) => setOrderForm({ ...orderForm, total_amount: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-bold text-verdalia-dark text-sm pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      {orderForm.currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-emerald-800 mb-1">
                    Flous Dfa3 (Montant Payé) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={orderForm.paid_amount}
                      onChange={(e) => setOrderForm({ ...orderForm, paid_amount: e.target.value })}
                      className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg font-bold text-emerald-900 text-sm pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">
                      {orderForm.currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-amber-800 mb-1">
                    Reste Flous (Auto-calculé)
                  </label>
                  <div className="w-full px-3 py-2 bg-amber-50/90 border border-amber-300 rounded-lg font-extrabold text-amber-900 text-sm flex items-center justify-between">
                    <span>
                      {Math.max(0, (parseFloat(orderForm.total_amount) || 0) - (parseFloat(orderForm.paid_amount) || 0)).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-amber-700">{orderForm.currency}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                    Date de la Commande
                  </label>
                  <input
                    type="date"
                    required
                    value={orderForm.order_date}
                    onChange={(e) => setOrderForm({ ...orderForm, order_date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-emerald-800 mb-1">
                    Nhar 9adeh Dfa3 (Date du Versement)
                  </label>
                  <input
                    type="date"
                    value={orderForm.payment_date}
                    onChange={(e) => setOrderForm({ ...orderForm, payment_date: e.target.value })}
                    className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                  Notes / Conditions d&apos;embarquement
                </label>
                <textarea
                  rows={2}
                  placeholder="Port de chargement (Radès, Sousse, Sfax), N° de facture ou BL..."
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? "Enregistrement..." : "Enregistrer Commande"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PAYMENT INSTALLMENT ================= */}
      {paymentModalOpen && selectedOrderForPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg absolute right-4 top-4"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Encaissement de Flous
              </span>
              <h3 className="font-serif text-lg font-bold text-verdalia-dark mt-0.5">
                Nouveau Versement / Paiement
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Commande <span className="font-bold text-verdalia-dark">{selectedOrderForPayment.order_number}</span> pour{" "}
                <span className="font-semibold">{selectedOrderForPayment.client_name}</span>
              </p>
            </div>

            {/* Financial reminder with exact currency */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 mb-4 grid grid-cols-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total</span>
                <span className="font-bold text-gray-800">
                  {selectedOrderForPayment.total_amount.toLocaleString()} {selectedOrderForPayment.currency}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Déjà Payé</span>
                <span className="font-bold text-emerald-700">
                  {selectedOrderForPayment.paid_amount.toLocaleString()} {selectedOrderForPayment.currency}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 uppercase font-bold block">Reste Dû</span>
                <span className="font-extrabold text-amber-800">
                  {selectedOrderForPayment.remaining_amount.toLocaleString()} {selectedOrderForPayment.currency}
                </span>
              </div>
            </div>

            {(() => {
              const paymentAmt = parseFloat(paymentForm.amount) || 0;
              const paymentRemain = typeof selectedOrderForPayment.remaining_amount === "number"
                ? selectedOrderForPayment.remaining_amount
                : Math.max(0, selectedOrderForPayment.total_amount - (selectedOrderForPayment.paid_amount || 0));
              const isPaymentExceeded = paymentAmt > paymentRemain + 0.001;
              const paymentExcess = Math.max(0, paymentAmt - paymentRemain);

              return (
                <form onSubmit={handleSavePayment} className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold uppercase text-[10px] text-emerald-800">
                        Montant à Encaisser en {selectedOrderForPayment.currency} *
                      </label>
                      {paymentRemain > 0 && (
                        <button
                          type="button"
                          onClick={() => setPaymentForm({ ...paymentForm, amount: String(paymentRemain) })}
                          className="text-[10px] text-emerald-700 hover:text-emerald-900 underline font-semibold"
                        >
                          Régler le solde ({paymentRemain.toLocaleString()} {selectedOrderForPayment.currency})
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="Ex: 50000"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-bold pr-14 focus:outline-none transition-colors ${
                          isPaymentExceeded
                            ? "bg-rose-50 border border-rose-300 text-rose-900 focus:ring-1 focus:ring-rose-500"
                            : "bg-emerald-50 border border-emerald-300 text-emerald-900 focus:bg-white"
                        }`}
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                        isPaymentExceeded ? "text-rose-700" : "text-emerald-700"
                      }`}>
                        {selectedOrderForPayment.currency}
                      </span>
                    </div>

                    {isPaymentExceeded && (
                      <div className="mt-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-600" />
                        <span>
                          Attention : Le montant dépasse le reste dû de +{paymentExcess.toLocaleString()} {selectedOrderForPayment.currency} !
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                      Nhar 9adeh Dfa3 (Date du Versement) *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                        Mode de Règlement
                      </label>
                      <select
                        value={paymentForm.method}
                        onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <option value="virement">Virement Bancaire</option>
                        <option value="lettre_credit">Lettre de Crédit (LC)</option>
                        <option value="cheque">Chèque Bancaire</option>
                        <option value="especes">Espèces / Cash</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                        N° Réf / Chèque
                      </label>
                      <input
                        type="text"
                        placeholder="VIR-1234 / CHQ..."
                        value={paymentForm.reference}
                        onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                      Note / Remarque
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Acompte 30%, Solde à la livraison..."
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setPaymentModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || isPaymentExceeded}
                      className={`btn-primary py-2 px-5 font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isPaymentExceeded ? "opacity-50 cursor-not-allowed bg-gray-400" : ""
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{submitting ? "Validation..." : "Valider Encaissement"}</span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD DELIVERY / PARTIAL SHIPMENT ================= */}
      {deliveryModalOpen && selectedOrderForDelivery && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-scaleUp my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setDeliveryModalOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg absolute right-4 top-4 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Suivi Logistique & Expéditions
              </span>
              <h3 className="font-serif text-lg font-bold text-verdalia-dark mt-0.5">
                Expédition & Livraison de Commande
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Commande <span className="font-bold text-verdalia-dark">{selectedOrderForDelivery.order_number}</span> •{" "}
                <span className="font-semibold text-gray-900">{selectedOrderForDelivery.client_name}</span> •{" "}
                <span className="text-verdalia-olive font-medium">{selectedOrderForDelivery.product_name}</span>
              </p>
            </div>

            {/* Delivery progress summary card */}
            {(() => {
              const total = Number(selectedOrderForDelivery.quantity) || 0;
              const delivered = Number(selectedOrderForDelivery.delivered_quantity) || (selectedOrderForDelivery.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
              const remaining = Math.max(0, total - delivered);
              const percent = total > 0 ? Math.min(100, Math.round((delivered / total) * 100)) : 0;

              return (
                <div className="p-4 bg-gradient-to-br from-blue-50/70 to-slate-50 rounded-xl border border-blue-100 mb-4">
                  <div className="grid grid-cols-3 text-center text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Total Commandé</span>
                      <span className="font-bold text-gray-800 text-sm">
                        {total.toLocaleString()} {selectedOrderForDelivery.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-600 uppercase font-bold block">Déjà Livré</span>
                      <span className="font-bold text-blue-700 text-sm">
                        {delivered.toLocaleString()} {selectedOrderForDelivery.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 uppercase font-bold block">Reste à Livrer</span>
                      <span className="font-extrabold text-amber-800 text-sm">
                        {remaining.toLocaleString()} {selectedOrderForDelivery.unit}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600">
                      <span>Progression de livraison</span>
                      <span className="text-blue-700 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent >= 100 ? "bg-emerald-500" : percent > 0 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="overflow-y-auto flex-1 pr-1 -mr-1 space-y-5">
              {/* Form to add a new shipment */}
              {(() => {
                const total = Number(selectedOrderForDelivery.quantity) || 0;
                const delivered = Number(selectedOrderForDelivery.delivered_quantity) || (selectedOrderForDelivery.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
                const remain = Math.max(0, total - delivered);
                const deliveryQty = parseFloat(deliveryForm.quantity) || 0;
                const isDeliveryExceeded = deliveryQty > remain + 0.0001;
                const deliveryExcess = Math.max(0, deliveryQty - remain);

                return (
                  <form onSubmit={handleSaveDelivery} className="space-y-3.5 text-xs bg-gray-50/60 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        Enregistrer une nouvelle expédition
                      </h4>
                      {remain > 0 && (
                        <button
                          type="button"
                          onClick={() => setDeliveryForm({ ...deliveryForm, quantity: String(remain) })}
                          className="text-[10px] text-blue-600 hover:text-blue-800 underline font-semibold"
                        >
                          Remplir le solde ({remain.toLocaleString()} {selectedOrderForDelivery.unit})
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase text-[10px] text-blue-900 mb-1">
                          Quantité Livrée ({selectedOrderForDelivery.unit}) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            required
                            placeholder="Ex: 5000"
                            value={deliveryForm.quantity}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, quantity: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-bold pr-12 focus:outline-none transition-colors ${
                              isDeliveryExceeded
                                ? "bg-rose-50 border border-rose-300 text-rose-950 focus:ring-1 focus:ring-rose-500"
                                : "bg-white border border-blue-300 text-blue-950 focus:ring-1 focus:ring-blue-500"
                            }`}
                          />
                          <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                            isDeliveryExceeded ? "text-rose-700" : "text-blue-700"
                          }`}>
                            {selectedOrderForDelivery.unit}
                          </span>
                        </div>

                        {isDeliveryExceeded && (
                          <div className="mt-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-600" />
                            <span>
                              Attention : La quantité dépasse le reste à livrer de +{deliveryExcess.toLocaleString()} {selectedOrderForDelivery.unit} !
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                          Date d&apos;Expédition / Livraison *
                        </label>
                        <input
                          type="date"
                          required
                          value={deliveryForm.delivery_date}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_date: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                          N° Bon de Livraison (BL) / Suivi
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: BL-2026-089 / TRK..."
                          value={deliveryForm.bl_number}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, bl_number: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase text-[10px] text-gray-700 mb-1">
                          Notes / Chauffeur / Camion
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Camion citerne 2, Chauffeur..."
                          value={deliveryForm.notes}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={submitting || isDeliveryExceeded}
                        className={`py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm ${
                          isDeliveryExceeded
                            ? "bg-gray-400 text-white cursor-not-allowed opacity-50"
                            : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{submitting ? "Enregistrement..." : "Valider Expédition"}</span>
                      </button>
                    </div>
                  </form>
                );
              })()}

              {/* Past deliveries history */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Historique des expéditions</span>
                  <span className="text-[10px] font-normal text-gray-500">
                    {selectedOrderForDelivery.delivery_installments?.length || 0} expédition(s)
                  </span>
                </h4>

                {(!selectedOrderForDelivery.delivery_installments ||
                  selectedOrderForDelivery.delivery_installments.length === 0) ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-400 text-xs italic border border-dashed border-gray-200">
                    Aucune expédition enregistrée pour le moment.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden bg-white">
                    {selectedOrderForDelivery.delivery_installments.map((installment, idx) => (
                      <div key={installment.id || idx} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {Number(installment.quantity).toLocaleString()} {selectedOrderForDelivery.unit}
                            </span>
                            {installment.bl_number && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-semibold">
                                BL: {installment.bl_number}
                              </span>
                            )}
                          </div>
                          {installment.notes && (
                            <p className="text-[11px] text-gray-500">{installment.notes}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-gray-700 font-semibold text-[11px] block">
                            {installment.delivery_date}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Expédition #{idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setDeliveryModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM ACTION (TRASH & PERMANENT DELETE) ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-gray-900">
                  {confirmModal.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={executeConfirmAction}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
