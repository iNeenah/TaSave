"use client";

import { useState, useTransition } from "react";
import { uploadMachine } from "@/lib/actions/machines";
import HackerButton from "@/components/ui/HackerButton";
import GlowCard from "@/components/ui/GlowCard";

export default function UploadMachineForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    
    startTransition(async () => {
      try {
        const result = await uploadMachine(formData);
        
        if (result?.success) {
          setMessage({ type: 'success', text: `Machine "${result.machine?.name}" uploaded successfully!` });
          // Reset form
          const form = document.getElementById('upload-form') as HTMLFormElement;
          form?.reset();
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          setMessage({ type: 'error', text: result?.error || 'Failed to upload machine' });
        }
      } catch (error) {
        console.error('Upload error:', error);
        setMessage({ type: 'error', text: 'An unexpected error occurred while uploading the machine' });
      }
    });
  };

  return (
    <GlowCard className="max-w-2xl mx-auto">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6 font-mono">
          Upload New Machine
        </h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-900/20 border-green-500 text-green-400' 
              : 'bg-red-900/20 border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form id="upload-form" action={handleSubmit} className="space-y-6">
          {/* Machine Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-green-400 mb-2">
              Machine Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter machine name"
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-green-400 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
              placeholder="Describe your machine, its challenges, and learning objectives..."
              disabled={isPending}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-green-400 mb-2">
              Difficulty Level *
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isPending}
            >
              <option value="">Select difficulty</option>
              <option value="very_easy">Very Easy</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Download Link */}
          <div>
            <label htmlFor="downloadLink" className="block text-sm font-medium text-green-400 mb-2">
              Download Link *
            </label>
            <input
              type="url"
              id="downloadLink"
              name="downloadLink"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/machine-download.zip"
              disabled={isPending}
            />
            <p className="text-xs text-gray-400 mt-1">
              Provide a direct download link to your Docker container or VM image
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-green-400 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/machine-screenshot.jpg"
              disabled={isPending}
            />
            <p className="text-xs text-gray-400 mt-1">
              Optional: Provide a screenshot or logo for your machine
            </p>
          </div>

          {/* Creation Date */}
          <div>
            <label htmlFor="creationDate" className="block text-sm font-medium text-green-400 mb-2">
              Creation Date
            </label>
            <input
              type="date"
              id="creationDate"
              name="creationDate"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isPending}
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to use current date
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <HackerButton
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Uploading..." : "Upload Machine"}
            </HackerButton>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Upload Guidelines</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Ensure your machine is properly tested and functional</li>
            <li>• Provide clear instructions in the description</li>
            <li>• Use appropriate difficulty levels</li>
            <li>• Include learning objectives and hints if needed</li>
            <li>• Make sure download links are accessible and permanent</li>
            <li>• Follow cybersecurity best practices</li>
          </ul>
        </div>
      </div>
    </GlowCard>
  );
}