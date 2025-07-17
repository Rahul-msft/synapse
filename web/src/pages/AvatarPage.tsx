import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import AvatarCreator from '../components/avatar/AvatarCreator';
import AvatarGallery from '../components/avatar/AvatarGallery';
import { Add as AddIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`avatar-tabpanel-${index}`}
      aria-labelledby={`avatar-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AvatarPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showCreator, setShowCreator] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateAvatar = () => {
    setShowCreator(true);
    setActiveTab(1); // Switch to creator tab
  };

  const handleAvatarCreated = () => {
    setShowCreator(false);
    setActiveTab(0); // Go back to gallery
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="My Avatars" />
          <Tab label="Create Avatar" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            My Avatars
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateAvatar}
          >
            Create New Avatar
          </Button>
        </Box>
        
        <AvatarGallery onCreateNew={handleCreateAvatar} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Create Your Avatar
        </Typography>
        
        <AvatarCreator onAvatarCreated={handleAvatarCreated} />
      </TabPanel>
    </Box>
  );
}

export default AvatarPage;