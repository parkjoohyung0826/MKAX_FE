'use client';

import React from 'react';
import { Avatar, Box, Fade, Grow, Paper, Typography } from '@mui/material';
import { AutoAwesome, SmartToyOutlined } from '@mui/icons-material';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';

const messageListSx = {
  flexGrow: 1,
  overflowY: 'auto',
  px: 2,
  py: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  pb: '120px',
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)',
};

type MessageListProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  messageListRef: React.RefObject<HTMLDivElement>;
  chatEndRef: React.RefObject<HTMLDivElement>;
};

const MessageList = ({ messages, isTyping, messageListRef, chatEndRef }: MessageListProps) => (
  <Box ref={messageListRef} sx={messageListSx}>
    <Box sx={{ textAlign: 'center', py: -5, opacity: 0.5 }}>
      <SmartToyOutlined sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#94a3b8' }}>
        AI 채용 코디네이터가 입력을 도와드립니다
      </Typography>
    </Box>

    {messages.map((msg) => (
      <Grow in={true} key={msg.id} timeout={500}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          {msg.sender === 'ai' && (
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: '#fff',
                color: '#2563EB',
                mr: 2,
                mt: 0.5,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
              }}
            >
              <AutoAwesome sx={{ fontSize: 20 }} />
            </Avatar>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              px: 3,
              maxWidth: '80%',
              borderRadius: '26px',
              borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '26px',
              borderTopRightRadius: msg.sender === 'user' ? '4px' : '26px',
              bgcolor: msg.sender === 'ai' ? '#fff' : '#2563EB',
              background:
                msg.sender === 'user'
                  ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                  : '#fff',
              color: msg.sender === 'ai' ? '#334155' : '#fff',
              boxShadow:
                msg.sender === 'ai'
                  ? '0 4px 20px rgba(0,0,0,0.05)'
                  : '0 8px 25px rgba(37, 99, 235, 0.3)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {msg.text}
            </Typography>
          </Paper>
        </Box>
      </Grow>
    ))}

    {isTyping && (
      <Fade in={true}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 7 }}>
          <TypingIndicator />
        </Box>
      </Fade>
    )}
    <div ref={chatEndRef} />
  </Box>
);

export default MessageList;
