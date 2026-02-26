"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import {
  Drawer,
  Box,
  IconButton,
  Avatar,
  Typography,
  Fab,
  Tooltip,
} from "@mui/material"
import { Menu as MenuIcon, Chat as ChatIcon } from "@mui/icons-material"
import { useRouter, usePathname } from "next/navigation"

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const drawerWidth = 300

  const drawer = <Sidebar onClose={() => setSidebarOpen(false)} />

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true,
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
          ml: { lg: `${drawerWidth}px` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Mobile header */}
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30, fontSize: '0.875rem' }}>
              C
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              CRM System
            </Typography>
          </Box>

          {/* Spacer to balance the hamburger icon */}
          <Box sx={{ width: 40 }} />
        </Box>

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            pb: pathname !== '/chat-with-bot' ? { xs: 10, lg: 0 } : 0,
          }}
        >
          {children}
        </Box>

        {/* Chat Bot Floating Button */}
        {pathname !== '/chat-with-bot' && (
          <Tooltip title="Chat with Bot" arrow placement="left">
            <Fab
              color="primary"
              aria-label="chat"
              onClick={() => router.push('/chat-with-bot')}
              size="medium"
              sx={{
                position: 'fixed',
                bottom: { xs: 16, sm: 24 },
                right: { xs: 16, sm: 24 },
                zIndex: 1200,
                boxShadow: 4,
              }}
            >
              <ChatIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
