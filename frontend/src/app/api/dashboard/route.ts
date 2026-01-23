import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookies = request.cookies
    const token = cookies.get('access_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For now, return mock data since we don't have the backend running
    // In production, this would call the actual backend API
    const mockData = {
      totalCustomers: 1250,
      totalLeads: 450,
      totalCampaigns: 12,
      totalUsers: 25,
      recentActivities: [
        {
          id: '1',
          type: 'customer',
          description: 'Khách hàng mới: Nguyễn Văn A',
          timestamp: '2024-01-20 10:30'
        },
        {
          id: '2',
          type: 'lead',
          description: 'Lead mới từ chiến dịch Email Marketing',
          timestamp: '2024-01-20 09:15'
        },
        {
          id: '3',
          type: 'campaign',
          description: 'Chiến dịch "Black Friday Sale" đã được tạo',
          timestamp: '2024-01-20 08:45'
        }
      ],
      chartData: {
        monthlyData: [
          { month: 'Jan', customers: 120, leads: 45, campaigns: 2 },
          { month: 'Feb', customers: 150, leads: 52, campaigns: 3 },
          { month: 'Mar', customers: 180, leads: 68, campaigns: 4 },
          { month: 'Apr', customers: 220, leads: 75, campaigns: 5 },
          { month: 'May', customers: 280, leads: 85, campaigns: 6 },
          { month: 'Jun', customers: 320, leads: 95, campaigns: 7 },
        ],
        leadStatusData: [
          { status: 'Mới', value: 120 },
          { status: 'Đang theo dõi', value: 180 },
          { status: 'Chuyển đổi', value: 95 },
          { status: 'Không quan tâm', value: 55 },
        ]
      }
    }

    // Fetch data from backend APIs
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

      // Fetch data from backend APIs
      const [customersRes, leadsRes, campaignsRes, usersRes] = await Promise.all([
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
        }),
      ])

      const customers = customersRes.data
      const leads = leadsRes.data
      const campaigns = campaignsRes.data
      const users = usersRes.data

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
      console.error('Backend API error:', backendError)
      // Fall back to mock data
      return NextResponse.json(mockData)
    }

    return NextResponse.json(mockData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions for processing backend data
function processMonthlyData(customers: any[], leads: any[], campaigns: any[]) {
  // Group data by month
  const monthlyMap = new Map()

  // Process customers
  customers.forEach(customer => {
    const month = new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short' })
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, customers: 0, leads: 0, campaigns: 0 })
    }
    monthlyMap.get(month).customers++
  })

  // Process leads
  leads.forEach(lead => {
    const month = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short' })
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, customers: 0, leads: 0, campaigns: 0 })
    }
    monthlyMap.get(month).leads++
  })

  // Process campaigns
  campaigns.forEach(campaign => {
    const month = new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short' })
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, customers: 0, leads: 0, campaigns: 0 })
    }
    monthlyMap.get(month).campaigns++
  })

  return Array.from(monthlyMap.values())
}

function processLeadStatusData(leads: any[]) {
  const statusMap = new Map()

  leads.forEach(lead => {
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
    case 'NEW': return 'Mới'
    case 'CONTACTING': return 'Đang theo dõi'
    case 'INTERESTED': return 'Chuyển đổi'
    case 'NOT_POTENTIAL': return 'Không quan tâm'
    case 'CONVERTED': return 'Đã chuyển đổi'
    default: return status
  }
}

function getRecentActivities(customers: any[], leads: any[], campaigns: any[]) {
  const activities = []

  // Get recent customers
  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
    .map(customer => ({
      id: `customer-${customer.id}`,
      type: 'customer',
      description: `Khách hàng mới: ${customer.name}`,
      timestamp: new Date(customer.createdAt).toLocaleString('vi-VN')
    }))

  // Get recent leads
  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
    .map(lead => ({
      id: `lead-${lead.id}`,
      type: 'lead',
      description: `Lead mới: ${lead.name}`,
      timestamp: new Date(lead.createdAt).toLocaleString('vi-VN')
    }))

  // Get recent campaigns
  const recentCampaigns = campaigns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1)
    .map(campaign => ({
      id: `campaign-${campaign.id}`,
      type: 'campaign',
      description: `Chiến dịch mới: ${campaign.name}`,
      timestamp: new Date(campaign.createdAt).toLocaleString('vi-VN')
    }))

  activities.push(...recentCustomers, ...recentLeads, ...recentCampaigns)

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
}
