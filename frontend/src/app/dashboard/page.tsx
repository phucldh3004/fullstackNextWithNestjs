"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { People as PeopleIcon, Flag as FlagIcon, Campaign as CampaignIcon } from "@mui/icons-material"
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

const statCards = (stats: DashboardStats) => [
  {
    label: "Khách hàng",
    value: stats.totalCustomers,
    icon: <PeopleIcon />,
    color: "primary.main",
  },
  {
    label: "Leads",
    value: stats.totalLeads,
    icon: <FlagIcon />,
    color: "success.main",
  },
  {
    label: "Chiến dịch",
    value: stats.totalCampaigns,
    icon: <CampaignIcon />,
    color: "secondary.main",
  },
  {
    label: "Người dùng",
    value: stats.totalUsers,
    icon: <PeopleIcon />,
    color: "warning.main",
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isMd = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")

        // Check if redirected (which happens when no token)
        if (response.redirected && response.url.includes("/login")) {
          router.push("/login")
          return
        }

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else if (response.status === 401) {
          // Unauthorized, redirect to login
          router.push("/login")
          return
        } else {
          console.error("Failed to fetch dashboard data")
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

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

  const chartHeight = isMobile ? 220 : 300
  const barChartWidth = isMobile ? undefined : undefined // let it be responsive via container

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Page Header */}
      <Box mb={{ xs: 2, sm: 3, md: 4 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
          fontWeight="bold"
        >
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tổng quan hệ thống CRM
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} mb={{ xs: 2, sm: 3, md: 4 }}>
        {statCards(stats).map((card) => (
          <Grid item xs={6} sm={6} md={3} key={card.label}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={{ xs: "0.7rem", sm: "0.875rem" }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      fontWeight="bold"
                    >
                      {card.value.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} mb={{ xs: 2, sm: 3, md: 4 }}>
        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, overflow: "hidden" }}>
              <Typography variant="h6" gutterBottom fontSize={{ xs: "1rem", sm: "1.25rem" }}>
                Thống kê theo tháng
              </Typography>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <BarChart
                  height={chartHeight}
                  series={[
                    {
                      data: stats.chartData.monthlyData.map((d) => d.customers),
                      label: "Khách hàng",
                      color: "#04a1e4",
                    },
                    {
                      data: stats.chartData.monthlyData.map((d) => d.leads),
                      label: "Leads",
                      color: "#16a34a",
                    },
                    {
                      data: stats.chartData.monthlyData.map((d) => d.campaigns),
                      label: "Chiến dịch",
                      color: "#dc2626",
                    },
                  ]}
                  xAxis={[
                    {
                      data: stats.chartData.monthlyData.map((d) => d.month),
                      scaleType: "band",
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, overflow: "hidden" }}>
              <Typography variant="h6" gutterBottom fontSize={{ xs: "1rem", sm: "1.25rem" }}>
                Trạng thái Leads
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  overflowX: "auto",
                }}
              >
                <PieChart
                  series={[
                    {
                      data: stats.chartData.leadStatusData,
                      innerRadius: isMobile ? 20 : 30,
                      outerRadius: isMobile ? 70 : 100,
                    },
                  ]}
                  height={chartHeight}
                  width={isMobile ? 280 : undefined}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography variant="h6" gutterBottom fontSize={{ xs: "1rem", sm: "1.25rem" }}>
            Hoạt động gần đây
          </Typography>
          <List disablePadding>
            {stats.recentActivities.map((activity, index) => (
              <div key={activity.id}>
                <ListItem
                  sx={{
                    px: { xs: 0, sm: 2 },
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        mt: { xs: 0.5, sm: 0 },
                      }}
                    >
                      {activity.type === "customer" && <PeopleIcon fontSize={isMobile ? "small" : "medium"} />}
                      {activity.type === "lead" && <FlagIcon fontSize={isMobile ? "small" : "medium"} />}
                      {activity.type === "campaign" && <CampaignIcon fontSize={isMobile ? "small" : "medium"} />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500} fontSize={{ xs: "0.8rem", sm: "0.875rem" }}>
                        {activity.description}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" fontSize={{ xs: "0.7rem", sm: "0.75rem" }}>
                        {activity.timestamp}
                      </Typography>
                    }
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
