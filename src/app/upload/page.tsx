import { getCurrentUser } from "@/lib/auth";
import { canUploadMachines, getCurrentUserWithRole, getRoleDisplayName } from "@/lib/auth-roles";
import { redirect } from "next/navigation";
import UploadMachineForm from "@/components/UploadMachineForm";
import Link from "next/link";

export default async function UploadPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const canUpload = await canUploadMachines();
  const userWithRole = await getCurrentUserWithRole();

  if (!canUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black page-transition">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium font-mono transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
          </div>

          {/* Access Denied */}
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-red-900/20 border border-red-500 rounded-lg p-8">
              <div className="text-red-400 text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
              <p className="text-gray-300 mb-4">
                You don't have permission to upload machines.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Current role: <span className="text-yellow-400">{getRoleDisplayName(userWithRole?.role || 'user')}</span>
                <br />
                Required role: <span className="text-green-400">Contributor or Administrator</span>
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  To upload machines, you need to be a Contributor or Administrator.
                </p>
                <p className="text-sm text-gray-400">
                  Contact an administrator to upgrade your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black page-transition">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium font-mono transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Share Your Machine
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Contribute to the cybersecurity community by uploading your own training machines.
            Help others learn and practice their skills with your challenges.
          </p>
        </div>

        {/* Upload Form */}
        <UploadMachineForm />

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-green-400 text-2xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">Security First</h3>
              <p className="text-gray-400 text-sm">
                All uploaded machines are reviewed for security and quality before being made available to the community.
              </p>
            </div>
            
            <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-green-400 text-2xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-2">Recognition</h3>
              <p className="text-gray-400 text-sm">
                Your contributions will be credited to you, and you'll gain recognition in the cybersecurity community.
              </p>
            </div>
            
            <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-green-400 text-2xl mb-3">🤝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-400 text-sm">
                Join a growing community of security professionals sharing knowledge and learning together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}