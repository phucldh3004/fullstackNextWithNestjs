"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material"
import {
  People as PeopleIcon,
  Flag as FlagIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material"
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"

interface DashboardStats {
  totalCustomers: number
  totalLeads: number
  totalCampaigns: number
  totalUsers: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
  chartData: {
    monthlyData: Array<{ month: string; customers: number; leads: number; campaigns: number }>
    leadStatusData: Array<{ status: string; value: number }>
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          console.error('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tổng quan hệ thống CRM
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Card sx={{ flex: '1 1 250px', minWidth: '200px' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.totalCustomers.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px', minWidth: '200px' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <FlagIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Leads
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.totalLeads.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px', minWidth: '200px' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <CampaignIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Chiến dịch
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.totalCampaigns.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px', minWidth: '200px' }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Người dùng
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.totalUsers.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Card sx={{ flex: '2 1 500px', minWidth: '400px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thống kê theo tháng
            </Typography>
            <BarChart
              height={300}
              series={[
                { data: stats.chartData.monthlyData.map(d => d.customers), label: 'Khách hàng', color: '#2563eb' },
                { data: stats.chartData.monthlyData.map(d => d.leads), label: 'Leads', color: '#16a34a' },
                { data: stats.chartData.monthlyData.map(d => d.campaigns), label: 'Chiến dịch', color: '#dc2626' },
              ]}
              xAxis={[{ data: stats.chartData.monthlyData.map(d => d.month), scaleType: 'band' }]}
            />
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trạng thái Leads
            </Typography>
            <PieChart
              series={[
                {
                  data: stats.chartData.leadStatusData,
                  innerRadius: 30,
                  outerRadius: 100,
                },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activities */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Hoạt động gần đây
          </Typography>
          <List>
            {stats.recentActivities.map((activity, index) => (
              <div key={activity.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {activity.type === 'customer' && <PeopleIcon />}
                      {activity.type === 'lead' && <FlagIcon />}
                      {activity.type === 'campaign' && <CampaignIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.description}
                    secondary={activity.timestamp}
                  />
                </ListItem>
                {index < stats.recentActivities.length - 1 && <Divider variant="inset" />}
              </div>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  )
}
