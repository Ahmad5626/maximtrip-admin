"use client"

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react"

function CampaignDetails({ campaign, onBack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Reject":
        return "bg-red-100 text-red-800"
      case "Terminate":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-IN")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to List
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{campaign.campaignTitle}</h1>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}
            >
              {campaign.status}
            </span>
          </div>
          <p className="text-gray-600 mt-2">{campaign.tagline}</p>
        </div>

        {/* Campaign Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Goal Amount</h3>
              <p className="text-2xl font-bold text-blue-700">{campaign.goalAmount}</p>
              <p className="text-sm text-blue-600">{campaign.currency}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Fund Type</h3>
              <p className="text-xl font-bold text-green-700">{campaign.fundType}</p>
              <p className="text-sm text-green-600">Category: {campaign.category}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Beneficiaries</h3>
              <p className="text-xl font-bold text-purple-700">{campaign.numberOfBeneficiaries}</p>
              <p className="text-sm text-purple-600">
                {campaign.isUrgent ? (
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                    Urgent
                  </span>
                ) : (
                  "Standard Priority"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Story */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Story</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div
              className="prose prose-gray max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: campaign.story }}
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Raising Cause</h3>
            <p className="text-gray-600">{campaign.raisingCause}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-gray-900">{campaign.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-gray-900">{campaign.lastName}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">
                    {campaign.dateOfBirth.day}/{campaign.dateOfBirth.month}/{campaign.dateOfBirth.year}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </label>
                    <p className="text-gray-900">{campaign.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </label>
                    <p className="text-gray-900">{campaign.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Street Address</label>
                  <p className="text-gray-900">{campaign.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <p className="text-gray-900">{campaign.address.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="text-gray-900">{campaign.address.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Country</label>
                    <p className="text-gray-900">{campaign.address.country}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Pincode</label>
                    <p className="text-gray-900">{campaign.pincode}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{campaign.location}</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Bank Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Account Holder Name</label>
                  <p className="text-gray-900">{campaign.accountHolderName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Account Number</label>
                  <p className="text-gray-900">{campaign.accountNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="text-gray-900">{campaign.bankName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">IFSC Code</label>
                    <p className="text-gray-900">{campaign.ifscCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Religious Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Religious Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Masjid Name</label>
                  <p className="text-gray-900">{campaign.masjidName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email of Imam Sahab</label>
                  <p className="text-gray-900">{campaign.emailOfImamSahab}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Number of Imam Sahab</label>
                  <p className="text-gray-900">{campaign.numberOfImamSahab}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Zakat Verified</label>
                  <p className="text-gray-900 flex items-center">
                    {campaign.zakatVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        Not Verified
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Timeline */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Campaign Timeline
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-gray-900">{formatDate(campaign.endDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Is Beneficiary Orphan</label>
                  <p className="text-gray-900">{campaign.isBeneficiaryOrphan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Aadhar Document</h3>
                <p className="text-sm text-gray-600 mb-2">Image URL:</p>
                <a
                  href={campaign.aadharImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {campaign.aadharImageUrl}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">PAN Document</h3>
                <p className="text-sm text-gray-600 mb-2">Image URL:</p>
                <a
                  href={campaign.panImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {campaign.panImageUrl}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Government ID</h3>
                <p className="text-sm text-gray-600 mb-2">Document URL:</p>
                <a
                  href={campaign.governmentIdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {campaign.governmentIdUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Feature Image */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Image</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Image URL:</p>
              <a
                href={campaign.featureImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all"
              >
                {campaign.featureImageUrl}
              </a>
            </div>
          </div>

          {/* Agreements */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agreements & Consents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  {campaign.agreeAll ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-900">Agree All Terms</span>
                </div>
                <div className="flex items-center">
                  {campaign.agreePayment ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-900">Payment Agreement</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  {campaign.agreePrivacy ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-900">Privacy Agreement</span>
                </div>
                <div className="flex items-center">
                  {campaign.agreeTerms ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-900">Terms & Conditions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Institute Information */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Institute Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Institute Role</label>
                <p className="text-gray-900">{campaign.instituteRole}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Anticipated Donations</label>
                <p className="text-gray-900">₹{campaign.anticipatedDonations?.toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Spending Plans</label>
                <p className="text-gray-900">{campaign.spendingPlans}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
