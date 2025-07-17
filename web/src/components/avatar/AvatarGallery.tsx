import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { Avatar } from '@synapse/shared';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUserAvatars, deleteAvatar } from '../../utils/api';

interface AvatarGalleryProps {
  onCreateNew: () => void;
}

function AvatarGallery({ onCreateNew }: AvatarGalleryProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: avatars, isLoading, error } = useQuery(
    'userAvatars',
    () => fetchUserAvatars('user_123'), // TODO: Get from auth context
    {
      refetchInterval: 30000,
    }
  );

  const deleteAvatarMutation = useMutation(deleteAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAvatars');
      setDeleteDialogOpen(false);
      setSelectedAvatar(null);
    },
  });

  const handleDeleteClick = (avatar: Avatar, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedAvatar(avatar);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAvatar) {
      deleteAvatarMutation.mutate(selectedAvatar.id);
    }
  };

  const handleDownload = (avatar: Avatar, event: React.MouseEvent) => {
    event.stopPropagation();
    // Create a temporary link element to download the image
    const link = document.createElement('a');
    link.href = avatar.imageUrl;
    link.download = `avatar_${avatar.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error" variant="h6">
          Failed to load avatars
        </Typography>
        <Button onClick={() => queryClient.invalidateQueries('userAvatars')} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  if (!avatars || avatars.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          No avatars yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create your first AI-powered avatar to get started!
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          Create Your First Avatar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {avatars.map((avatar) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={avatar.id}>
            <Card
              sx={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  '& .avatar-actions': {
                    opacity: 1
                  }
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={avatar.imageUrl}
                alt={`Avatar ${avatar.id}`}
                sx={{ objectFit: 'cover' }}
              />
              
              <Box
                className="avatar-actions"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                  display: 'flex',
                  gap: 1
                }}
              >
                <IconButton
                  size="small"
                  sx={{ bgcolor: 'background.paper', color: 'primary.main' }}
                  onClick={(e) => handleDownload(avatar, e)}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ bgcolor: 'background.paper', color: 'error.main' }}
                  onClick={(e) => handleDeleteClick(avatar, e)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Created {new Date(avatar.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hair: {avatar.style.hairStyle} • Eyes: {avatar.style.eyeColor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="create new avatar"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={onCreateNew}
      >
        <AddIcon />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Avatar</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this avatar? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteAvatarMutation.isLoading}
          >
            {deleteAvatarMutation.isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AvatarGallery;