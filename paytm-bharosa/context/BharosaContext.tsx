"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Bharosa, Entry, EntrySource, Lang, Payment, Role } from "@/lib/types";
import { MERCHANT_ID, MERCHANT_NAME, seedBharosas, seedEntries, seedPayments } from "@/lib/seed";

const DEFAULT_CUSTOMER_ID = "c4";
/** Display name for the standalone /consumer journey's stable identity.
 *  A real name (not "You") since it shows up in the merchant's own view too —
 *  e.g. a pending-request notification. */
export const CONSUMER_NAME = "Priya Nair";

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

interface BharosaContextValue {
  bharosas: Bharosa[];
  entries: Entry[];
  payments: Payment[];
  currentRole: Role;
  currentUserId: string;
  /** Stable identity for the standalone /consumer journey — independent of
   *  currentUserId, which is reserved for the merchant/customer role-toggle demo. */
  consumerId: string;

  openBharosa: (params: {
    merchantId?: string;
    merchantName?: string;
    customerId: string;
    customerName: string;
    customerLang: Lang;
  }) => Bharosa;
  /** Makes `customerId` the active persona for the role-toggle demo (currentRole
   *  "customer", currentUserId + demoCustomerId = customerId). Call explicitly
   *  after openBharosa when the caller wants the new bharosa to become "you"
   *  in the /customer ⇄ /merchant toggle — openBharosa itself no longer does
   *  this automatically, so callers outside that demo (e.g. /consumer) don't
   *  unintentionally hijack it. */
  activateCustomerPersona: (customerId: string) => void;
  /** Creates a bharosa in "pending" status — visible to the merchant as a
   *  request awaiting acceptBharosaRequest before it can be paid into.
   *  `initialAmount`/`initialDescription` attach the customer's first
   *  purchase to the request itself: it's already in the ledger the moment
   *  the merchant accepts, rather than requiring a second step. */
  requestBharosa: (params: {
    merchantId?: string;
    merchantName?: string;
    customerId: string;
    customerName: string;
    customerLang: Lang;
    initialAmount?: number;
    initialDescription?: string;
  }) => Bharosa;
  /** Flips a pending bharosa to "active". */
  acceptBharosaRequest: (bharosaId: string) => void;
  /** Refuses a pending request. The relationship never existed, so the
   *  provisional first-purchase entry attached to it goes too — leaving it
   *  behind would show the customer a debt to a shop that declined them. */
  declineBharosaRequest: (bharosaId: string) => void;
  /** The bharosa that governs whether this customer can transact with this
   *  merchant right now: the active or pending one, never a closed one. A
   *  plain find() over all statuses can surface a closed relationship and
   *  wrongly block re-opening. */
  getLiveBharosa: (customerId: string, merchantId: string) => Bharosa | undefined;
  addEntry: (
    bharosaId: string,
    amount: number,
    description: string,
    source: EntrySource
  ) => Entry;
  addPayment: (bharosaId: string, amount: number) => Payment;
  getBalance: (bharosaId: string) => number;
  getBharosa: (bharosaId: string) => Bharosa | undefined;
  /** Active bharosas only — the default for "does this relationship exist
   *  and can it be used" checks throughout the app. */
  getBharosaForMerchant: (merchantId: string) => Bharosa[];
  getBharosaForCustomer: (customerId: string) => Bharosa[];
  /** All statuses (pending + active + closed) for one customer — for UI that
   *  needs to show a pending request, e.g. the consumer's own Bharosa list. */
  getAllBharosaForCustomer: (customerId: string) => Bharosa[];
  /** Pending requests awaiting this merchant's acceptance. */
  getPendingRequestsForMerchant: (merchantId: string) => Bharosa[];
  getEntries: (bharosaId: string) => Entry[];
  getPayments: (bharosaId: string) => Payment[];
  switchRole: (role: Role) => void;
}

const BharosaContext = createContext<BharosaContextValue | null>(null);

export function BharosaProvider({ children }: { children: ReactNode }) {
  const [bharosas, setBharosas] = useState<Bharosa[]>(seedBharosas);
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [payments, setPayments] = useState<Payment[]>(seedPayments);
  const [currentRole, setCurrentRole] = useState<Role>("merchant");
  const [currentUserId, setCurrentUserId] = useState<string>(MERCHANT_ID);
  // Tracks which customer persona "Customer" role resolves to, independent of
  // the merchant/customer toggle — so opening a bharosa via /setup sticks
  // across role switches instead of reverting to the hardcoded default.
  const [demoCustomerId, setDemoCustomerId] = useState<string>(DEFAULT_CUSTOMER_ID);
  // Stable per-session identity for the standalone /consumer journey (its own
  // "logged in as" persona, distinct from the toggle demo's currentUserId).
  const [consumerId] = useState<string>(() => makeId("consumer"));

  const openBharosa = useCallback<BharosaContextValue["openBharosa"]>(
    ({ merchantId = MERCHANT_ID, merchantName = MERCHANT_NAME, customerId, customerName, customerLang }) => {
      const bharosa: Bharosa = {
        id: makeId("b"),
        merchantId,
        merchantName,
        customerId,
        customerName,
        customerLang,
        status: "active",
        createdAt: Date.now(),
      };
      setBharosas((prev) => [...prev, bharosa]);
      return bharosa;
    },
    []
  );

  const activateCustomerPersona = useCallback((customerId: string) => {
    setCurrentRole("customer");
    setCurrentUserId(customerId);
    setDemoCustomerId(customerId);
  }, []);

  const addEntry = useCallback<BharosaContextValue["addEntry"]>(
    (bharosaId, amount, description, source) => {
      const entry: Entry = {
        id: makeId("e"),
        bharosaId,
        amount,
        description,
        timestamp: Date.now(),
        source,
        confirmed: source === "digital_scan",
      };
      setEntries((prev) => [...prev, entry]);
      return entry;
    },
    []
  );

  const requestBharosa = useCallback<BharosaContextValue["requestBharosa"]>(
    ({
      merchantId = MERCHANT_ID,
      merchantName = MERCHANT_NAME,
      customerId,
      customerName,
      customerLang,
      initialAmount,
      initialDescription,
    }) => {
      const bharosa: Bharosa = {
        id: makeId("b"),
        merchantId,
        merchantName,
        customerId,
        customerName,
        customerLang,
        status: "pending",
        createdAt: Date.now(),
      };
      setBharosas((prev) => [...prev, bharosa]);
      if (initialAmount && initialAmount > 0) {
        addEntry(bharosa.id, initialAmount, initialDescription || "Bharosa purchase", "digital_scan");
      }
      return bharosa;
    },
    [addEntry]
  );

  const acceptBharosaRequest = useCallback((bharosaId: string) => {
    setBharosas((prev) =>
      prev.map((b) =>
        b.id === bharosaId && b.status === "pending" ? { ...b, status: "active" } : b
      )
    );
  }, []);

  const declineBharosaRequest = useCallback((bharosaId: string) => {
    setBharosas((prev) => prev.filter((b) => b.id !== bharosaId));
    setEntries((prev) => prev.filter((e) => e.bharosaId !== bharosaId));
    setPayments((prev) => prev.filter((p) => p.bharosaId !== bharosaId));
  }, []);

  const getLiveBharosa = useCallback(
    (customerId: string, merchantId: string) =>
      bharosas.find(
        (b) =>
          b.customerId === customerId &&
          b.merchantId === merchantId &&
          b.status !== "closed"
      ),
    [bharosas]
  );

  const addPayment = useCallback<BharosaContextValue["addPayment"]>(
    (bharosaId, amount) => {
      // Clamped to what's actually owed. A payment larger than the balance
      // would drive it negative and read as the shop owing the customer.
      const owed =
        entries.filter((e) => e.bharosaId === bharosaId).reduce((sum, e) => sum + e.amount, 0) -
        payments.filter((p) => p.bharosaId === bharosaId).reduce((sum, p) => sum + p.amount, 0);
      const payment: Payment = {
        id: makeId("p"),
        bharosaId,
        amount: Math.min(amount, Math.max(owed, 0)),
        timestamp: Date.now(),
        upiReference: `MOCK-UPI-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setPayments((prev) => [...prev, payment]);
      return payment;
    },
    [entries, payments]
  );

  const getBalance = useCallback(
    (bharosaId: string) => {
      const owed = entries
        .filter((e) => e.bharosaId === bharosaId)
        .reduce((sum, e) => sum + e.amount, 0);
      const paid = payments
        .filter((p) => p.bharosaId === bharosaId)
        .reduce((sum, p) => sum + p.amount, 0);
      return owed - paid;
    },
    [entries, payments]
  );

  const getBharosa = useCallback(
    (bharosaId: string) => bharosas.find((b) => b.id === bharosaId),
    [bharosas]
  );

  const getBharosaForMerchant = useCallback(
    (merchantId: string) =>
      bharosas.filter((b) => b.merchantId === merchantId && b.status === "active"),
    [bharosas]
  );

  const getBharosaForCustomer = useCallback(
    (customerId: string) =>
      bharosas.filter((b) => b.customerId === customerId && b.status === "active"),
    [bharosas]
  );

  const getAllBharosaForCustomer = useCallback(
    (customerId: string) => bharosas.filter((b) => b.customerId === customerId),
    [bharosas]
  );

  const getPendingRequestsForMerchant = useCallback(
    (merchantId: string) =>
      bharosas.filter((b) => b.merchantId === merchantId && b.status === "pending"),
    [bharosas]
  );

  const getEntries = useCallback(
    (bharosaId: string) =>
      entries
        .filter((e) => e.bharosaId === bharosaId)
        .sort((a, b) => b.timestamp - a.timestamp),
    [entries]
  );

  const getPayments = useCallback(
    (bharosaId: string) =>
      payments
        .filter((p) => p.bharosaId === bharosaId)
        .sort((a, b) => b.timestamp - a.timestamp),
    [payments]
  );

  const switchRole = useCallback(
    (role: Role) => {
      setCurrentRole(role);
      setCurrentUserId(role === "merchant" ? MERCHANT_ID : demoCustomerId);
    },
    [demoCustomerId]
  );

  const value = useMemo<BharosaContextValue>(
    () => ({
      bharosas,
      entries,
      payments,
      currentRole,
      currentUserId,
      consumerId,
      openBharosa,
      activateCustomerPersona,
      requestBharosa,
      acceptBharosaRequest,
      declineBharosaRequest,
      getLiveBharosa,
      addEntry,
      addPayment,
      getBalance,
      getBharosa,
      getBharosaForMerchant,
      getBharosaForCustomer,
      getAllBharosaForCustomer,
      getPendingRequestsForMerchant,
      getEntries,
      getPayments,
      switchRole,
    }),
    [
      bharosas,
      entries,
      payments,
      currentRole,
      currentUserId,
      consumerId,
      openBharosa,
      activateCustomerPersona,
      requestBharosa,
      acceptBharosaRequest,
      declineBharosaRequest,
      getLiveBharosa,
      addEntry,
      addPayment,
      getBalance,
      getBharosa,
      getBharosaForMerchant,
      getBharosaForCustomer,
      getAllBharosaForCustomer,
      getPendingRequestsForMerchant,
      getEntries,
      getPayments,
      switchRole,
    ]
  );

  return (
    <BharosaContext.Provider value={value}>{children}</BharosaContext.Provider>
  );
}

export function useBharosa(): BharosaContextValue {
  const ctx = useContext(BharosaContext);
  if (!ctx) {
    throw new Error("useBharosa must be used within a BharosaProvider");
  }
  return ctx;
}
