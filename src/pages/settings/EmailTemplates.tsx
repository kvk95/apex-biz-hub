import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1 } from "@/pages/PageBase1";

interface EmailTemplate {
  id: string;
  name: string;
  content: string;
  enabled: boolean;
}

const defaultTemplates: Record<string, string> = {
  "Welcome Email": `Hi <span class="text-orange">{Customer Name}</span>,<br>
Welcome to <span class="text-orange">{Company Name}</span>!<br><br>
We’re thrilled to have you as part of our community and are eager to support you in optimizing your operations. Thank you for choosing us – we appreciate your trust and confidence.<br><br>
At <span class="text-orange">{Company Name}</span>, our mission is to make your experience seamless and efficient. From managing day-to-day tasks to improving workflows, we’re here to help you get the most out of our solutions.<br><br>
If you have any questions or need assistance, our dedicated support team is always ready to assist you. Feel free to reach out anytime – we’re committed to ensuring your success.<br><br>
Thank you again for trusting <span class="text-orange">{Company Name}</span>. We’re excited to be part of your journey and look forward to supporting you every step of the way.<br><br>
Best,<br>
The <span class="text-orange">{Company Name}</span> Team`,

  "Order Confirmation": `Hi <span class="text-orange">{Customer Name}</span>,<br>
Your order <strong>{Order ID}</strong> has been confirmed!<br><br>
Thank you for shopping with <span class="text-orange">{Company Name}</span>. We’ve received your order and are preparing it for shipment.<br><br>
<strong>Order Details:</strong><br>
Product: {Product Name}<br>
Total: {Order Total}<br>
Order Date: {Order Date}<br>
Expected Delivery: {Delivery Date}<br><br>
Track your order: <a href="{Login Link}">Login to your account</a><br><br>
Questions? Contact us at <a href="mailto:{Support Email}">{Support Email}</a><br><br>
Best,<br>
The <span class="text-orange">{Company Name}</span> Team`,

  "Invoice Receipt": `Hi <span class="text-orange">{Customer Name}</span>,<br>
Here is your invoice for Order <strong>{Order ID}</strong>.<br><br>
Invoice ID: {Invoice ID}<br>
Amount Paid: {Order Total}<br>
Date: {Order Date}<br><br>
<a href="{Login Link}">View Invoice Online</a><br><br>
Thank you for your purchase!<br><br>
Best,<br>
The <span class="text-orange">{Company Name}</span> Team`,

  "Subscription Renewal Reminder": `Hi <span class="text-orange">{Customer Name}</span>,<br>
Your subscription will renew in 3 days.<br><br>
Plan: Premium<br>
Next Billing: {Order Date}<br>
Amount: {Order Total}<br><br>
<a href="{Login Link}">Manage Subscription</a><br><br>
Best,<br>
The <span class="text-orange">{Company Name}</span> Team`,

  "Seasonal Promotion": `Hi <span class="text-orange">{Customer Name}</span>,<br>
<span class="text-2xl font-bold">Diwali Sale – 30% OFF!</span><br><br>
Use code: <strong>{Discount Code}</strong><br>
Valid until: {Delivery Date}<br><br>
<a href="{Login Link}" class="bg-orange-600 text-white px-4 py-2 rounded">Shop Now</a><br><br>
Best,<br>
The <span class="text-orange">{Company Name}</span> Team`,

  "System Update": `Hi <span class="text-orange">{Customer Name}</span>,<br>
We’ve just released a new update!<br><br>
New Features:<br>
• Faster dashboard<br>
• Improved reporting<br>
• Mobile app sync<br><br>
<a href="{Login Link}">Explore Now</a><br><br>
Best,<br>
The <span class="text-orange">{Company Name}</span> Team`,
};

const allTags = [
  "{Customer Name}",
  "{Company Name}",
  "{Order ID}",
  "{Invoice ID}",
  "{Receipt ID}",
  "{Login Link}",
  "{Support Email}",
  "{Password Reset Link}",
  "{Product Name}",
  "{Order Total}",
  "{Order Date}",
  "{Delivery Date}",
  "{Discount Code}",
];

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<EmailTemplate[]>("EmailTemplates");
      if (response.status.code === "S") {
        const loaded = response.result;
        const merged = Object.keys(defaultTemplates).map((name) => {
          const existing = loaded.find((t) => t.id === name);
          return (
            existing || {
              id: name,
              name,
              content: defaultTemplates[name],
              enabled: true,
            }
          );
        });
        setTemplates(merged);
      }
    } catch {
      // Fallback to defaults
      setTemplates(
        Object.keys(defaultTemplates).map((name) => ({
          id: name,
          name,
          content: defaultTemplates[name],
          enabled: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (id: string, newContent: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: newContent } : t))
    );
  };

  const handleToggle = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleSave = async () => {
    try {
      await apiService.post("EmailTemplates", templates);
      alert("Templates saved successfully!");
    } catch {
      alert("Failed to save templates.");
    }
  };

  const handleDefault = (id: string) => {
    if (window.confirm("Reset to default template?")) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, content: defaultTemplates[id] } : t
        )
      );
    }
  };

  const handlePreview = (content: string) => {
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  const currentTemplate = templates.find((t) => t.id === activeTemplate);

  return (
    <PageBase1
      title="Email Templates"
      description="Customize email templates for notifications"
      icon="fa fa-envelope-open-text"
      onRefresh={() => loadData()}
      loading={loading}
    >
      <div className="space-y-1">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Accordion Header */}
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setActiveTemplate(
                  activeTemplate === template.id ? null : template.id
                )
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
                <h3 className="text-sm font-semibold">{template.name}</h3>
              </div>
              <i
                className={`fa fa-chevron-down transition-transform ${
                  activeTemplate === template.id ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Accordion Content */}
            {activeTemplate === template.id && (
              <div className="p-3 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Editor */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Template Content
                    </label>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleContentChange(
                          template.id,
                          e.currentTarget.innerHTML
                        )
                      }
                      dangerouslySetInnerHTML={{ __html: template.content }}
                      className="max-h-64 overflow-y-auto p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 outline-none"
                    />
                  </div>

                  {/* Right: Tags */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags
                    </label>
                    <div className="space-y-1 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {allTags.map((tag) => (
                        <div
                          key={tag}
                          className="text-xs font-mono bg-white px-3 py-1 rounded border border-gray-300 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            const editor = document.querySelector(
                              `[data-template="${template.id}"]`
                            );
                            if (editor) {
                              document.execCommand("insertHTML", false, tag);
                            }
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={() => handleDefault(template.id)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                  >
                    Default Template
                  </button>
                  <button
                    onClick={() => handlePreview(template.content)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Preview Template
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Template Preview</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="p-6">
              <div
                dangerouslySetInnerHTML={{ __html: previewContent }}
                className="prose max-w-none"
              />
            </div>
          </div>
        </div>
      )}
    </PageBase1>
  );
}
