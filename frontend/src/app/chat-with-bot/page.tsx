"use client"

import React, { useState, useRef, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { 
  Box, 
  Paper,
  TextField, 
  IconButton, 
  Typography, 
  Avatar, 
  Container 
} from "@mui/material"
import { Send as SendIcon, SmartToy as BotIcon, Person as PersonIcon } from "@mui/icons-material"

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

// Animated typing dots
function TypingIndicator() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
        <BotIcon sx={{ fontSize: 20 }} />
      </Avatar>
      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: 'typing-bounce 1.2s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
              '@keyframes typing-bounce': {
                '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.4 },
                '40%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          />
        ))}
      </Paper>
    </Box>
  )
}

export default function ChatWithBotPage() {
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your CRM Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userText = input
    const newMessage: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })
      const response = await res.json()

      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.text || response.error || "No response received.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error("Error generating AI response:", error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ py: 4, height: '85vh', display: 'flex', flexDirection: 'column' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">CRM Assistant</Typography>
              {isTyping && (
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  typing...
                </Typography>
              )}
            </Box>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#f5f5f5' }}>
            {messages.map((msg) => (
              <Box 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1
                }}
              >
                {msg.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <BotIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                <Paper 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%', 
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.7rem' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
                {msg.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    <PersonIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              multiline
              maxRows={3}
              disabled={isTyping}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  )
}
