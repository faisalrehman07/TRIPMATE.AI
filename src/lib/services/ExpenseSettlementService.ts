import { ExpenseRecord, ExpenseSettlement, GroupMember } from "../types/trip";

export class ExpenseSettlementService {
  /**
   * Calculate net balance for each group member from expense records.
   * Net balance = Total paid for group - Total allocated share.
   * Positive = Member is owed money (creditor).
   * Negative = Member owes money (debtor).
   */
  static calculateMemberBalances(
    members: GroupMember[],
    expenses: ExpenseRecord[]
  ): Record<string, { member: GroupMember; paid: number; share: number; net: number }> {
    const balanceMap: Record<
      string,
      { member: GroupMember; paid: number; share: number; net: number }
    > = {};

    members.forEach((m) => {
      balanceMap[m.id] = {
        member: m,
        paid: 0,
        share: 0,
        net: 0,
      };
    });

    expenses.forEach((expense) => {
      // Record payment
      if (balanceMap[expense.payerId]) {
        balanceMap[expense.payerId].paid += expense.amount;
      }

      // Record allocations
      if (expense.splitMode === "EQUAL") {
        const participantCount = expense.allocations.length || members.length;
        const perPerson = expense.amount / Math.max(1, participantCount);
        expense.allocations.forEach((alloc) => {
          if (balanceMap[alloc.memberId]) {
            balanceMap[alloc.memberId].share += perPerson;
          }
        });
      } else {
        expense.allocations.forEach((alloc) => {
          if (balanceMap[alloc.memberId]) {
            balanceMap[alloc.memberId].share += alloc.amount;
          }
        });
      }
    });

    // Compute net
    Object.keys(balanceMap).forEach((id) => {
      const b = balanceMap[id];
      b.net = Math.round((b.paid - b.share) * 100) / 100;
    });

    return balanceMap;
  }

  /**
   * Deterministic debt simplification algorithm (Splitwise-style).
   * Minimizes number of cash transactions between group members.
   */
  static computeSettlements(
    members: GroupMember[],
    expenses: ExpenseRecord[]
  ): ExpenseSettlement[] {
    const balanceMap = this.calculateMemberBalances(members, expenses);

    interface PersonNet {
      id: string;
      name: string;
      net: number;
    }

    const creditors: PersonNet[] = [];
    const debtors: PersonNet[] = [];

    Object.values(balanceMap).forEach(({ member, net }) => {
      if (net > 0.05) {
        creditors.push({ id: member.id, name: member.name, net });
      } else if (net < -0.05) {
        debtors.push({ id: member.id, name: member.name, net: Math.abs(net) });
      }
    });

    // Sort descending by amount
    creditors.sort((a, b) => b.net - a.net);
    debtors.sort((a, b) => b.net - a.net);

    const settlements: ExpenseSettlement[] = [];

    let cIdx = 0;
    let dIdx = 0;

    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx];
      const debtor = debtors[dIdx];

      const settleAmount = Math.min(creditor.net, debtor.net);

      if (settleAmount > 0.5) {
        settlements.push({
          debtorId: debtor.id,
          debtorName: debtor.name,
          creditorId: creditor.id,
          creditorName: creditor.name,
          amount: Math.round(settleAmount),
        });
      }

      creditor.net -= settleAmount;
      debtor.net -= settleAmount;

      if (creditor.net < 0.05) {
        cIdx++;
      }
      if (debtor.net < 0.05) {
        dIdx++;
      }
    }

    return settlements;
  }
}
