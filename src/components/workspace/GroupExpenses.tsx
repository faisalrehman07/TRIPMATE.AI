"use client";

import React, { useState } from "react";
import { ExpenseRecord, GroupMember } from "@/lib/types/trip";
import { ExpenseSettlementService } from "@/lib/services/ExpenseSettlementService";
import { formatINR } from "@/lib/utils";
import { Plus, ArrowRight, CheckCircle2, User, Receipt, DollarSign, Wallet, UserPlus, Users } from "lucide-react";

interface GroupExpensesProps {
  members: GroupMember[];
  expenses: ExpenseRecord[];
  onAddExpense: (newExpense: ExpenseRecord) => void;
  onAddMember?: (newMember: GroupMember) => void;
}

export function GroupExpenses({ members, expenses, onAddExpense, onAddMember }: GroupExpensesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<"TRANSPORT" | "STAY" | "FOOD" | "ACTIVITY" | "MISC">("FOOD");
  const [payerId, setPayerId] = useState<string>(members[0]?.id || "");

  // Compute deterministic balances & settlements
  const memberBalances = ExpenseSettlementService.calculateMemberBalances(members, expenses);
  const settlements = ExpenseSettlementService.computeSettlements(members, expenses);

  const totalExpensePool = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmitFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim() || !onAddMember) return;

    const sampleAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    ];

    const newMember: GroupMember = {
      id: `mem-${Date.now()}`,
      name: newFriendName.trim(),
      email: newFriendEmail.trim() || `${newFriendName.toLowerCase().replace(/[^a-z0-9]/g, "")}@tripmate.ai`,
      avatar: sampleAvatars[members.length % sampleAvatars.length],
      role: "MEMBER",
      joinedAt: new Date().toISOString(),
      paidAmount: 0,
    };

    onAddMember(newMember);
    setNewFriendName("");
    setNewFriendEmail("");
    setAddFriendModalOpen(false);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || Number(amount) <= 0) return;

    const payer = members.find((m) => m.id === payerId) || members[0];
    const perPerson = Number(amount) / members.length;

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      title,
      amount: Number(amount),
      category,
      payerId: payer.id,
      payerName: payer.name,
      date: new Date().toISOString().split("T")[0],
      splitMode: "EQUAL",
      allocations: members.map((m) => ({
        memberId: m.id,
        memberName: m.name,
        amount: perPerson,
      })),
    };

    onAddExpense(newRecord);
    setTitle("");
    setAmount("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Expense Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Group Expense Ledger & Debt Simplification</span>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              {members.length} Friends
            </span>
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Total group spend tracked: <span className="font-bold text-stone-900 dark:text-stone-200">{formatINR(totalExpensePool)}</span> across {expenses.length} payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAddMember && (
            <button
              onClick={() => setAddFriendModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-2xs transition-all hover:bg-stone-50 dark:hover:bg-stone-700"
            >
              <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Add Friend</span>
            </button>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 dark:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 dark:hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Group Expense</span>
          </button>
        </div>
      </div>

      {/* Member Balances Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {members.map((m) => {
          const bal = memberBalances[m.id] || { paid: 0, share: 0, net: 0 };
          const isCreditor = bal.net > 0;
          const isDebtor = bal.net < 0;

          return (
            <div key={m.id} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-3.5 shadow-sm text-center backdrop-blur-sm">
              <img
                src={m.avatar}
                alt={m.name}
                className="h-10 w-10 mx-auto rounded-full object-cover border-2 border-stone-100 dark:border-stone-800"
              />
              <div className="mt-2 text-xs font-bold text-stone-900 dark:text-stone-200 truncate">{m.name}</div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400">Paid: {formatINR(bal.paid)}</div>

              <div
                className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  isCreditor
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : isDebtor
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                }`}
              >
                {isCreditor ? `+${formatINR(bal.net)}` : isDebtor ? `-${formatINR(Math.abs(bal.net))}` : "Settled"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Debt Simplification Settlement Algorithm Result */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
          <Wallet className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span>Optimal Settlement Plan (Minimal Cash Transfers)</span>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          TRIPMATE AI resolves circular group debts to minimize transfers down to just {settlements.length} payment{settlements.length !== 1 ? "s" : ""}.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {settlements.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-stone-900/90 p-3 shadow-xs text-xs"
            >
              <div className="font-semibold text-stone-800 dark:text-stone-200">{s.debtorName}</div>
              <div className="flex items-center gap-1.5 px-2 text-stone-400 dark:text-stone-500">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatINR(s.amount)}</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="font-semibold text-emerald-900 dark:text-emerald-300">{s.creditorName}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense History Table */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
          Recorded Expense Transactions
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          {expenses.map((exp) => (
            <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">{exp.title}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Paid by <span className="font-semibold text-stone-700 dark:text-stone-300">{exp.payerName}</span> • Split equally ({formatINR(exp.amount / members.length)}/person)
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">{formatINR(exp.amount)}</div>
                <div className="text-[10px] text-stone-400 dark:text-stone-500">{exp.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 p-6 shadow-xl border border-stone-200 dark:border-stone-800">
            <h4 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">Add Group Expense</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Record a payment made for the squad. Split automatically.
            </p>

            <form onSubmit={handleSubmitExpense} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-medium text-stone-700 dark:text-stone-300">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Kaveri Boating tickets or Dinner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 dark:text-stone-300">Amount (₹ INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 1800"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 dark:text-stone-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                >
                  <option value="FOOD">Food & Drinks</option>
                  <option value="STAY">Accommodation</option>
                  <option value="TRANSPORT">Transit & Fuel</option>
                  <option value="ACTIVITY">Activity / Safari</option>
                  <option value="MISC">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-stone-700 dark:text-stone-300">Paid By</label>
                <select
                  value={payerId}
                  onChange={(e) => setPayerId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-900 dark:bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Friend to Squad Modal */}
      {addFriendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 p-6 shadow-xl border border-stone-200 dark:border-stone-800">
            <h4 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Add Friend to Squad</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Include a new friend in the trip squad. They will be included in room allocations and group expense splits.
            </p>

            <form onSubmit={handleSubmitFriend} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-medium text-stone-700 dark:text-stone-300">Friend's Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aman Gupta or Priya Sharma"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 dark:text-stone-300">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. friend@example.com"
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setAddFriendModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-900 dark:bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
                >
                  Add to Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
