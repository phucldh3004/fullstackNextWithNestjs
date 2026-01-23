"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LogoutButton from "./LogoutButton"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Flag as FlagIcon,
  Campaign as CampaignIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Khách hàng", href: "/dashboard/customers", icon: PeopleIcon },
  { name: "Leads", href: "/dashboard/leads", icon: FlagIcon },
  { name: "Chiến dịch", href: "/dashboard/campaigns", icon: CampaignIcon },
  { name: "Người dùng", href: "/dashboard/users", icon: PersonIcon },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const drawerWidth = 280

  const drawer = (
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
                onClick={() => setSidebarOpen(false)}
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Mobile header */}
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              C
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              CRM System
            </Typography>
          </Box>
          <Box sx={{ width: 40 }} /> {/* Spacer */}
        </Box>

        {/* Page content */}
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
