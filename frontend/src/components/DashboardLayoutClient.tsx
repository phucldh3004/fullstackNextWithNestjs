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
          ml: { lg: `${drawerWidth}px` },
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
        
        {/* Chat Bot Floating Button - hidden on the chat page itself */}
        {pathname !== '/chat-with-bot' && (
          <Tooltip title="Chat with Bot" arrow placement="left">
            <Fab 
              color="primary" 
              aria-label="chat"
              onClick={() => router.push('/chat-with-bot')}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
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
