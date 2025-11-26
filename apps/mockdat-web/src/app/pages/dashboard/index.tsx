// pages/dashboard/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAppConfig } from '@cb-common/ui-react-auth';
import {
  Box,
  Typography,
  Button,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { MockdatContext } from '../../context/MockdatContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userState, { getAuthToken }] = useUser();
  const { data: appConfig } = useAppConfig();
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(MockdatContext);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!appConfig) return null;

  useEffect(() => {
    let isMounted = true;
    const fetchScenarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToken = await getAuthToken();
        const res = await fetch(
          `${appConfig.apiUrl}/services/mockdat/scenarios`,
          {
            headers: {
              ...(idToken ? { Authorization: idToken } : {}),
            },
          }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch scenarios');
        }
        const data = await res.json();
        if (isMounted) setScenarios(data.data || []);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch scenarios');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (userState.data && appConfig) {
      fetchScenarios();
    }
    return () => {
      isMounted = false;
    };
  }, [userState.data, appConfig, getAuthToken]);

  const handleLoadScenario = (scn: any) => {
    if (!context) return;
    context.setRecordType(scn.type || scn.objectType || '');
    context.setSelectedFields(
      scn.data?.fieldsData?.map((f: any) => f.type) || []
    );
    context.setRecordCount(scn.data?.totalRecords || 10);
    context.setPreviewData([]); // Clear preview data
    context.setStep(3); // Go to Step 3 (Select Quantity)
    // Pass loaded scenario name to wizard via location state
    navigate('/wizard', { state: { loadedScenarioName: scn.name } });
  };

  const handleDeleteScenario = async (scn: any) => {
    if (!appConfig) return;
    setDeletingId(scn.id);
    try {
      const idToken = await getAuthToken();
      await fetch(`${appConfig.apiUrl}/services/mockdat/scenarios/${scn.id}`, {
        method: 'DELETE',
        headers: {
          ...(idToken ? { Authorization: idToken } : {}),
        },
      });
      setScenarios((prev) => prev.filter((s) => s.id !== scn.id));
      // If the deleted scenario is loaded, clear loaded scenario state
      if (
        window.location.pathname === '/wizard' &&
        window.history.state?.usr?.loadedScenarioName === scn.name
      ) {
        window.history.replaceState({}, '');
      }
    } catch (err) {
      alert('Failed to delete scenario');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box sx={{ p: 3 }} data-cy="dashboardPage">
      {/* Scenarios Section */}
      <Box sx={{ mb: 3 }} data-cy="scenariosSection">
        <Typography
          variant="h5"
          sx={{ color: 'text.primary' }}
          data-cy="scenariosTitle"
        >
          Scenarios
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Quickly create or edit a scenario for generating data.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          data-cy="createScenarioBtn"
          onClick={() => navigate('/wizard')}
        >
          Create New Scenario
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* My Saved Scenarios */}
      <Box sx={{ mb: 3 }} data-cy="mySavedScenariosSection">
        <Typography
          variant="h5"
          sx={{ color: 'text.primary' }}
          data-cy="mySavedScenariosTitle"
        >
          My Saved Scenarios
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Access scenarios you've created or saved.
        </Typography>
        <Box data-cy="savedScenariosList">
          {loading ? (
            <Box>
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={40}
                  sx={{ mb: 1, borderRadius: 1 }}
                />
              ))}
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : scenarios.length === 0 ? (
            <Typography sx={{ color: 'text.primary' }}>
              No saved scenarios yet. Create your first!
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ background: 'transparent' }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Object Type</TableCell>
                    <TableCell align="center">Load</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scenarios.map((scn) => (
                    <TableRow key={scn.id} hover>
                      <TableCell>{scn.name}</TableCell>
                      <TableCell>{scn.type}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Load Scenario">
                          <IconButton
                            color="primary"
                            onClick={() => handleLoadScenario(scn)}
                            size="small"
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete Scenario">
                          <span>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteScenario(scn)}
                              size="small"
                              disabled={deletingId === scn.id}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Community Scenarios */}
      <Box sx={{ mb: 3 }} data-cy="communityScenariosSection">
        <Typography
          variant="h5"
          sx={{ color: 'text.primary' }}
          data-cy="communityScenariosTitle"
        >
          Community Scenarios
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Explore scenarios shared by the community.
        </Typography>
        <Box data-cy="communityScenariosList">
          {/* Map over community scenarios if available */}
          <Typography sx={{ color: 'text.primary' }}>
            No community scenarios available yet.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
