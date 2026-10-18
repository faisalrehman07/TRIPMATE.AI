"use client";

import React, { useState } from "react";
import { Trip } from "@/lib/types/trip";
import { formatINR } from "@/lib/utils";
import { ReplanningService } from "@/lib/services/ReplanningService";
import { HybridRetrievalService } from "@/lib/services/HybridRetrievalService";
import { Sparkles, Send, X, Bot, User, Check, AlertCircle, ArrowRight, CornerDownRight } from "lucide-react";

interface AiAssistantDrawerProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

interface ChatMessage {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
  actionTaken?: string;
  costDelta?: number;
}

export function AiAssistantDrawer({
  trip,
  isOpen,
  onClose,
  onUpdateTrip,
}: AiAssistantDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "AI",
      text: `Hello! I'm your TRIPMATE AI travel assistant for **${trip.destination}**. I'm grounded in verified regional tourism data and can execute modifications on your active itinerary.\n\nYou can ask me:\n• *"Find a cheaper hotel"*\n• *"Remove the waterfall"*\n• *"What if it rains on Day 2?"*\n• *"How much is the 4x4 Jeep fee?"*`,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "USER",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const lower = text.toLowerCase();
      const isActionable =
        lower.includes("cheaper") ||
        lower.includes("hotel") ||
        lower.includes("resort") ||
        lower.includes("remove") ||
        lower.includes("waterfall") ||
        lower.includes("rain") ||
        lower.includes("indoor") ||
        lower.includes("cut budget");

      if (isActionable) {
        const replanResult = await ReplanningService.handleNaturalLanguageCommand(trip, text);
        if (replanResult.updatedTrip) {
          onUpdateTrip(replanResult.updatedTrip);
        }

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "AI",
          text: replanResult.explanation,
          timestamp: "Just now",
          actionTaken: replanResult.actionTaken,
          costDelta: replanResult.costDelta,
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      // Contextual travel query using RAG hybrid search
      const retrieved = HybridRetrievalService.retrieve({
        query: text,
        destination: trip.destination,
        topK: 2,
      });

      if (retrieved.length > 0) {
        const topEvidence = retrieved[0];
        const reply = `According to verified travel data from **${topEvidence.sourceName}**:\n\n${topEvidence.content}\n\n*Source citation:* [Official Guide](${topEvidence.sourceUrl}) (Verified ${new Date(topEvidence.verifiedAt).toLocaleDateString("en-IN")}).`;
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "AI",
          text: reply,
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      // General helpful response grounded in active trip
      const reply = `Your trip to **${trip.destination}** is currently scheduled for **${trip.days} days** with **${trip.preferences.groupSize} travelers**. Total estimated budget is **₹${trip.budget.totalTripCost.toLocaleString("en-IN")}** (limit: ₹${trip.budget.budgetLimit.toLocaleString("en-IN")}). Let me know if you would like to swap hotels, find cheaper alternatives, remove an activity, or prepare for weather changes!`;
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "AI",
        text: reply,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "AI",
          text: "I encountered a minor issue processing that. Please try rephrasing your request.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-5 py-4 bg-stone-50 dark:bg-stone-900/90">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950 dark:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>TRIPMATE Assistant</span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Tool Calling
              </span>
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Grounded in verified {trip.destination} data
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-xs">
        <button
          onClick={() => handleSendMessage("Find a cheaper hotel")}
          className="shrink-0 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 text-stone-700 dark:text-stone-300 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
        >
          Cheaper Hotel
        </button>
        <button
          onClick={() => handleSendMessage("Remove the waterfall")}
          className="shrink-0 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 text-stone-700 dark:text-stone-300 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
        >
          Remove Waterfall
        </button>
        <button
          onClick={() => handleSendMessage("What if it rains on Day 2?")}
          className="shrink-0 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 text-stone-700 dark:text-stone-300 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
        >
          Rain Alternatives
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isAi = m.sender === "AI";
          return (
            <div key={m.id} className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
              {isAi && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950 dark:bg-emerald-900/50 text-emerald-400 mt-0.5 border border-emerald-800/40">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isAi
                    ? "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-sm border border-transparent dark:border-stone-700/50"
                    : "bg-emerald-900 dark:bg-emerald-700 text-white rounded-tr-sm shadow-xs"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Tool Action Badge */}
                {m.actionTaken && m.actionTaken !== "NO_OP" && m.actionTaken !== "RAG_ADVICE" && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-emerald-900/10 dark:bg-emerald-950/70 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 border border-emerald-900/20 dark:border-emerald-800">
                    <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Active Itinerary Updated</span>
                    {m.costDelta !== undefined && m.costDelta !== 0 && (
                      <span className="font-bold">
                        ({m.costDelta > 0 ? "+" : ""}
                        {formatINR(m.costDelta)})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-stone-400 italic pl-9">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            TRIPMATE Assistant is querying verified sources...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-stone-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type a request (e.g. 'swap hotel', 'remove activity')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            className="flex-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-700 dark:focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 dark:bg-emerald-700 text-white shadow-xs transition-colors hover:bg-emerald-800 dark:hover:bg-emerald-600 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
