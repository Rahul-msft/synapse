import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
  PhotoCamera as PhotoIcon
} from '@mui/icons-material';
import { AVATAR_CONFIG, AvatarStyle } from '@synapse/shared';
import { useMutation, useQueryClient } from 'react-query';
import { generateAvatar, uploadAvatarPhoto } from '../../utils/api';

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
      id={`avatar-creation-tabpanel-${index}`}
      aria-labelledby={`avatar-creation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface AvatarCreatorProps {
  onAvatarCreated: () => void;
}

function AvatarCreator({ onAvatarCreated }: AvatarCreatorProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [avatarStyle, setAvatarStyle] = useState<Partial<AvatarStyle>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const generateAvatarMutation = useMutation(generateAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAvatars');
      onAvatarCreated();
    },
  });

  const uploadPhotoMutation = useMutation(uploadAvatarPhoto, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAvatars');
      onAvatarCreated();
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStyleChange = (field: keyof AvatarStyle, value: string | string[]) => {
    setAvatarStyle(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGenerateAvatar = () => {
    generateAvatarMutation.mutate({
      userId: 'user_123', // TODO: Get from auth context
      style: avatarStyle
    });
  };

  const handleUploadPhoto = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('userId', 'user_123'); // TODO: Get from auth context
      
      uploadPhotoMutation.mutate(formData);
    }
  };

  const handleRandomize = () => {
    setAvatarStyle({
      hairColor: AVATAR_CONFIG.HAIR_COLORS[Math.floor(Math.random() * AVATAR_CONFIG.HAIR_COLORS.length)],
      skinColor: AVATAR_CONFIG.SKIN_COLORS[Math.floor(Math.random() * AVATAR_CONFIG.SKIN_COLORS.length)],
      eyeColor: AVATAR_CONFIG.EYE_COLORS[Math.floor(Math.random() * AVATAR_CONFIG.EYE_COLORS.length)],
      hairStyle: AVATAR_CONFIG.HAIR_STYLES[Math.floor(Math.random() * AVATAR_CONFIG.HAIR_STYLES.length)],
      facialHair: AVATAR_CONFIG.FACIAL_HAIR[Math.floor(Math.random() * AVATAR_CONFIG.FACIAL_HAIR.length)],
      accessories: [AVATAR_CONFIG.ACCESSORIES[Math.floor(Math.random() * AVATAR_CONFIG.ACCESSORIES.length)]]
    });
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Style Customization" icon="🎨" />
          <Tab label="Photo Upload" icon="📸" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Customize Your Avatar</Typography>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={handleRandomize}
                    variant="outlined"
                  >
                    Randomize
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Hair Style</InputLabel>
                      <Select
                        value={avatarStyle.hairStyle || ''}
                        label="Hair Style"
                        onChange={(e) => handleStyleChange('hairStyle', e.target.value)}
                      >
                        {AVATAR_CONFIG.HAIR_STYLES.map((style) => (
                          <MenuItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Hair Color</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {AVATAR_CONFIG.HAIR_COLORS.map((color) => (
                        <Box
                          key={color}
                          onClick={() => handleStyleChange('hairColor', color)}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: avatarStyle.hairColor === color ? '3px solid #1976d2' : '2px solid #ccc',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Skin Color</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {AVATAR_CONFIG.SKIN_COLORS.map((color) => (
                        <Box
                          key={color}
                          onClick={() => handleStyleChange('skinColor', color)}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: avatarStyle.skinColor === color ? '3px solid #1976d2' : '2px solid #ccc',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Eye Color</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {AVATAR_CONFIG.EYE_COLORS.map((color) => (
                        <Box
                          key={color}
                          onClick={() => handleStyleChange('eyeColor', color)}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: avatarStyle.eyeColor === color ? '3px solid #1976d2' : '2px solid #ccc',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Facial Hair</InputLabel>
                      <Select
                        value={avatarStyle.facialHair || ''}
                        label="Facial Hair"
                        onChange={(e) => handleStyleChange('facialHair', e.target.value)}
                      >
                        {AVATAR_CONFIG.FACIAL_HAIR.map((style) => (
                          <MenuItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Accessories</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {AVATAR_CONFIG.ACCESSORIES.map((accessory) => (
                        <Chip
                          key={accessory}
                          label={accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                          onClick={() => {
                            const current = avatarStyle.accessories || [];
                            const isSelected = current.includes(accessory);
                            const newAccessories = isSelected
                              ? current.filter(a => a !== accessory)
                              : [...current, accessory];
                            handleStyleChange('accessories', newAccessories);
                          }}
                          color={avatarStyle.accessories?.includes(accessory) ? 'primary' : 'default'}
                          variant={avatarStyle.accessories?.includes(accessory) ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleGenerateAvatar}
                  disabled={generateAvatarMutation.isLoading}
                  sx={{ mt: 3 }}
                >
                  {generateAvatarMutation.isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Generating Avatar...
                    </>
                  ) : (
                    'Generate Avatar'
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Preview</Typography>
                <Paper
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    border: '2px dashed',
                    borderColor: 'grey.300'
                  }}
                >
                  <Typography color="text.secondary">
                    Avatar preview will appear here
                  </Typography>
                </Paper>
                
                {generateAvatarMutation.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to generate avatar. Please try again.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Your Photo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload a photo and our AI will create a personalized avatar based on your features.
                </Typography>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mb: 2 }}
                >
                  Choose Photo
                </Button>

                {selectedFile && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Selected: {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<UploadIcon />}
                  onClick={handleUploadPhoto}
                  disabled={!selectedFile || uploadPhotoMutation.isLoading}
                >
                  {uploadPhotoMutation.isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Processing Photo...
                    </>
                  ) : (
                    'Create Avatar from Photo'
                  )}
                </Button>

                {uploadPhotoMutation.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to process photo. Please try again.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Photo Preview</Typography>
                <Paper
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    overflow: 'hidden'
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary">
                      Photo preview will appear here
                    </Typography>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}

export default AvatarCreator;