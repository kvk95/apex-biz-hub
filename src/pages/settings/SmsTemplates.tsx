import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

interface SmsTemplate {
  id: number;
  title: string;
  message: string;
  enabled: boolean;
}

const defaultTemplates: SmsTemplate[] = [
  { id: 1, title: "Order Confirmation", message: "Dear {customer_name}, your order #{order_id} has been confirmed. Thank you for shopping with us!", enabled: true },
  { id: 2, title: "Delivery Update", message: "Hello {customer_name}, your order #{order_id} is out for delivery and will reach you soon.", enabled: true },
  { id: 3, title: "Payment Reminder", message: "Dear {customer_name}, this is a reminder that your payment for order #{order_id} is due on {due_date}.", enabled: true },
  { id: 4, title: "Promotional Offer", message: "Hi {customer_name}, enjoy a special discount of 20% on your next purchase. Use code SAVE20.", enabled: true },
  { id: 5, title: "Account Activation", message: "Welcome {customer_name} Your account has been activated successfully. Start shopping now.", enabled: true },
  { id: 6, title: "Password Reset", message: "Dear {customer_name}, click the link to reset your password: {reset_link}. If you didn't request this, ignore this message.", enabled: true },
  { id: 7, title: "Feedback Request", message: "Hi {customer_name}, we value your feedback. Please rate your recent purchase experience.", enabled: true },
  { id: 8, title: "Subscription Renewal", message: "Dear {customer_name}, your subscription will renew on {renewal_date}. Thank you for staying with us.", enabled: true },
  { id: 9, title: "Event Invitation", message: "Hello {customer_name}, you're invited to our exclusive event on {event_date}. RSVP now!", enabled: true },
  { id: 10, title: "Thank You Note", message: "Dear {customer_name}, thank you for your recent purchase. We appreciate your business!", enabled: true },
  { id: 11, title: "Order Cancellation", message: "Dear {customer_name}, your order #{order_id} has been cancelled as per your request.", enabled: true },
  { id: 12, title: "Shipping Delay", message: "Hello {customer_name}, due to unforeseen circumstances, your order #{order_id} delivery is delayed.", enabled: true },
];

const allTags = [
  "{customer_name}",
  "{order_id}",
  "{due_date}",
  "{reset_link}",
  "{renewal_date}",
  "{event_date}",
];

export default function SmsTemplates() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<SmsTemplate[]>("SmsTemplates");
      if (response.status.code === "S") {
        const loaded = response.result;
        const merged = defaultTemplates.map((def) => {
          const existing = loaded.find((t) => t.id === def.id);
          return existing || { ...def };
        });
        setTemplates(merged);
      }
    } catch {
      setTemplates(defaultTemplates);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (id: number, newContent: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, message: newContent } : t))
    );
  };

  const handleToggle = (id: number) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleSave = async () => {
    try {
      await apiService.post("SmsTemplates", templates);
      alert("SMS templates saved successfully!");
    } catch {
      alert("Failed to save SMS templates.");
    }
  };

  const handleDefault = (id: number) => {
    if (window.confirm("Reset to default template?")) {
      const def = defaultTemplates.find((t) => t.id === id);
      if (def) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? { ...t, message: def.message } : t))
        );
      }
    }
  };

  const handlePreview = (content: string) => {
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  return (
    <PageBase1
      title="SMS Templates"
      description="Manage SMS notification templates"
      icon="fa fa-sms"
      onRefresh={loadData}
      loading={loading}
    >
      <div className="space-y-1">
        {templates.map((template) => {
          const charCount = template.message.length;
          const isOverLimit = charCount > 160;

          return (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Accordion Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setActiveTemplate(activeTemplate === template.id ? null : template.id)
                }
              >
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.enabled}
                      onChange={() => handleToggle(template.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                  <h3 className="text-sm font-semibold text-gray-800">{template.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isOverLimit ? "text-red-600 font-bold" : "text-gray-500"}`}>
                    {charCount}/160
                  </span>
                  <i
                    className={`fa fa-chevron-down text-xs text-gray-500 transition-transform ${
                      activeTemplate === template.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Accordion Body */}
              {activeTemplate === template.id && (
                <div className="p-3 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMS Message
                      </label>
                      <textarea
                        value={template.message}
                        onChange={(e) => handleContentChange(template.id, e.target.value)}
                        className={`w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none font-mono text-xs ${
                          isOverLimit ? "border-red-500" : "border-gray-300"
                        }`}
                        rows={6}
                        maxLength={160}
                        placeholder="Enter SMS text..."
                        data-id={template.id}
                      />
                      <p className={`text-xs mt-1 text-right ${isOverLimit ? "text-red-600 font-bold" : "text-gray-500"}`}>
                        {charCount}/160 characters
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Tags
                      </label>
                      <div className="max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg space-y-1">
                        {allTags.map((tag) => (
                          <div
                            key={tag}
                            className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-300 cursor-pointer hover:bg-gray-100 select-none"
                            onClick={() => {
                              const textarea = document.querySelector(
                                `textarea[data-id="${template.id}"]`
                              ) as HTMLTextAreaElement;
                              if (textarea) {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = textarea.value;
                                const newText = text.substring(0, start) + tag + text.substring(end);
                                handleContentChange(template.id, newText);
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + tag.length, start + tag.length);
                                }, 0);
                              }
                            }}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Save Template
                    </button>
                    <button
                      onClick={() => handleDefault(template.id)}
                      className="px-3 py-1.5 text-xs bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                    >
                      Default Template
                    </button>
                    <button
                      onClick={() => handlePreview(template.message)}
                      className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Preview Template
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">SMS Preview</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap break-words">
                {previewContent}
              </div>
              <p className={`text-xs mt-2 text-right ${previewContent.length > 160 ? "text-red-600 font-bold" : "text-gray-500"}`}>
                {previewContent.length}/160 characters
              </p>
            </div>
          </div>
        </div>
      )}
    </PageBase1>
  );
}