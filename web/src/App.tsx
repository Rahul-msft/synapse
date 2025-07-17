import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ChatPage from './pages/ChatPage';
import AvatarPage from './pages/AvatarPage';
import Layout from './components/Layout';

function App() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:chatId" element={<ChatPage />} />
          <Route path="avatar" element={<AvatarPage />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;