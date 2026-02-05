import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookies = request.cookies
    const token = cookies.get("access_token")?.value
    if (!token) {
      console.log("No access token, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Fetch data from backend APIs
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

      // Fetch data from backend APIs
      // Fetch data from backend APIs
      // Use Promise.allSettled to allow partial success (e.g. if user has access to leads but not campaigns)
      const results = await Promise.allSettled([
        axios.get(`${backendUrl}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/marketing/campaigns`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const customersRes = results[0].status === 'fulfilled' ? results[0].value : null
      const leadsRes = results[1].status === 'fulfilled' ? results[1].value : null
      const campaignsRes = results[2].status === 'fulfilled' ? results[2].value : null
      const usersRes = results[3].status === 'fulfilled' ? results[3].value : null

      // Log errors for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const endpoints = ['customers', 'leads', 'campaigns', 'users']
          console.warn(`Failed to fetch ${endpoints[index]}: ${result.reason.message}`)
        }
      })

      const customers = customersRes?.data || []
      const leads = leadsRes?.data || []
      const campaigns = campaignsRes?.data || []
      const users = usersRes?.data || []

      // Process chart data
      const monthlyData = processMonthlyData(customers, leads, campaigns)
      const leadStatusData = processLeadStatusData(leads)

      return NextResponse.json({
        totalCustomers: customers.length,
        totalLeads: leads.length,
        totalCampaigns: campaigns.length,
        totalUsers: users.length,
        recentActivities: getRecentActivities(customers, leads, campaigns),
        chartData: {
          monthlyData,
          leadStatusData
        }
      })
    } catch (backendError) {
      console.error("Backend API error:", backendError)
      // Fall back to mock data
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions for processing backend data
function processMonthlyData(customers: any[], leads: any[], campaigns: any[]) {
  // Group data by month
  const monthlyMap = new Map()

  // Process customers
  customers.forEach((customer) => {
    const month = new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short" })
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, customers: 0, leads: 0, campaigns: 0 })
    }
    monthlyMap.get(month).customers++
  })

  // Process leads
  leads.forEach((lead) => {
    const month = new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short" })
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, customers: 0, leads: 0, campaigns: 0 })
    }
    monthlyMap.get(month).leads++
  })

  // Process campaigns
  campaigns.forEach((campaign) => {
    const month = new Date(campaign.createdAt).toLocaleDateString("en-US", { month: "short" })
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, customers: 0, leads: 0, campaigns: 0 })
    }
    monthlyMap.get(month).campaigns++
  })

  return Array.from(monthlyMap.values())
}

function processLeadStatusData(leads: any[]) {
  const statusMap = new Map()

  leads.forEach((lead) => {
    const status = getLeadStatusText(lead.status)
    statusMap.set(status, (statusMap.get(status) || 0) + 1)
  })

  return Array.from(statusMap.entries()).map(([status, value]) => ({
    status,
    value
  }))
}

function getLeadStatusText(status: string) {
  switch (status) {
    case "NEW":
      return "Mới"
    case "CONTACTING":
      return "Đang theo dõi"
    case "INTERESTED":
      return "Chuyển đổi"
    case "NOT_POTENTIAL":
      return "Không quan tâm"
    case "CONVERTED":
      return "Đã chuyển đổi"
    default:
      return status
  }
}

function getRecentActivities(customers: any[], leads: any[], campaigns: any[]) {
  const activities = []

  // Get recent customers
  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
    .map((customer) => ({
      id: `customer-${customer.id}`,
      type: "customer",
      description: `Khách hàng mới: ${customer.name}`,
      timestamp: new Date(customer.createdAt).toLocaleString("vi-VN")
    }))

  // Get recent leads
  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
    .map((lead) => ({
      id: `lead-${lead.id}`,
      type: "lead",
      description: `Lead mới: ${lead.name}`,
      timestamp: new Date(lead.createdAt).toLocaleString("vi-VN")
    }))

  // Get recent campaigns
  const recentCampaigns = campaigns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1)
    .map((campaign) => ({
      id: `campaign-${campaign.id}`,
      type: "campaign",
      description: `Chiến dịch mới: ${campaign.name}`,
      timestamp: new Date(campaign.createdAt).toLocaleString("vi-VN")
    }))

  activities.push(...recentCustomers, ...recentLeads, ...recentCampaigns)

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)
}

