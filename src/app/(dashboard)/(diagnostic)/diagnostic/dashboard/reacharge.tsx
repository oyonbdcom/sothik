/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCreateLedgerEntryMutation } from "@/redux/api/wallter-ledger";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";

const rechargeSchema = z.object({
  amount: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().positive("Amount must be greater than 0"),
  ),
  tranId: z.string().min(5, "Transaction ID must be at least 5 characters"),
});

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RechargeModal = ({ isOpen, onClose }: RechargeModalProps) => {
  const [amount, setAmount] = useState<string>("");
  const [tranId, setTranId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Redux Hook
  const [createLedger, { isLoading }] = useCreateLedgerEntryMutation();

  const handleRecharge = async () => {
    setError(null);
    const validation = rechargeSchema.safeParse({ amount, tranId });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      // Redux mutation call
      await createLedger({
        amount: validation.data.amount,
        type: "CREDIT",
        source: "RECHARGE",
        status: "PENDING",
        referenceId: validation.data.tranId,
        description: `Manual recharge via TranID: ${validation.data.tranId}`,
      }).unwrap();

      alert("Recharge request submitted successfully!");
      onClose();
      setAmount("");
      setTranId("");
    } catch (err: any) {
      setError(err?.data?.message || "Failed to submit request.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl relative z-10 mx-4"
          >
            <h2 className="text-xl font-bold mb-4">Manual Recharge</h2>

            {error && (
              <p className="text-red-500 text-xs mb-3 font-semibold">{error}</p>
            )}

            <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs border border-gray-200">
              <p className="font-semibold mb-1 text-gray-700">
                Payment Instructions:
              </p>
              <ul className="list-disc ml-4 space-y-1 text-gray-600">
                <li>
                  Send money to Bkash/Nagad:{" "}
                  <span className="font-bold">01XXX-XXXXXX</span>
                </li>
                <li>Use your Diagnostic Name as Reference.</li>
              </ul>
            </div>

            <input
              type="number"
              placeholder="Amount"
              className="w-full border p-2 mb-3 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Transaction ID"
              className="w-full border p-2 mb-6 rounded"
              value={tranId}
              onChange={(e) => setTranId(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRecharge}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium"
              >
                {isLoading ? "Processing..." : "Submit Transaction"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RechargeModal;
