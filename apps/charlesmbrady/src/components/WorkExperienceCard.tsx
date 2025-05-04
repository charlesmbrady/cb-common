import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { WorkExperience } from './workData';

interface WorkExperienceCardProps {
  experience: WorkExperience;
}

export const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ experience }) => {
  return (
    <Card 
      sx={{ 
        mb: 3,
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="div">
              {experience.company}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {experience.position}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              {experience.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {experience.period}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" paragraph>
          {experience.description}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Key Achievements
        </Typography>
        <List dense>
          {experience.achievements.map((achievement, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText
                primary={achievement}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {experience.technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{ 
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}; 