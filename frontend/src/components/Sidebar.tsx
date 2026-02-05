"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Flag as FlagIcon,
  Campaign as CampaignIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  ConfirmationNumber as TicketIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material"
import LogoutButton from "./LogoutButton"

interface SidebarProps {
  onClose?: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Khách hàng", href: "/dashboard/customers", icon: PeopleIcon },
  { name: "Leads", href: "/dashboard/leads", icon: FlagIcon },
  { name: "Chiến dịch", href: "/dashboard/campaigns", icon: CampaignIcon },
  { name: "Đơn hàng", href: "/dashboard/orders", icon: ShoppingCartIcon },
  { name: "Thanh toán", href: "/dashboard/payments", icon: ReceiptIcon },
  { name: "Hỗ trợ", href: "/dashboard/tickets", icon: TicketIcon },
  { name: "Người dùng", href: "/dashboard/users", icon: PersonIcon },
  { name: "Báo cáo", href: "/dashboard/reports", icon: BarChartIcon },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
          C
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          CRM System
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = item.icon
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={onClose}
                sx={{
                  mx: 2,
                  mb: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <LogoutButton />
      </Box>
    </Box>
  )
}
