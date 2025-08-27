import React, { FC } from 'react';
import { useTheme, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Icon } from 'designSystem';

interface AgentSelectorProps {
  agents: { id: string; name: string }[];
  selectedAgent: { id: string; name: string } | null;
  onAgentSelect: (agent: { id: string; name: string } | null) => void;
}

const AgentSelector: FC<AgentSelectorProps> = ({
  agents,
  selectedAgent = null,
  onAgentSelect,
}) => {
  const theme = useTheme();

  return (
    <Select
      value={selectedAgent?.id || ''}
      fullWidth
      onChange={(event) => {
        const selectedId = event.target.value;
        const selected = agents.find((a) => a.id === selectedId) || null;
        onAgentSelect(selected);
      }}
      displayEmpty
      sx={{
        height: 56,
        borderRadius: 4,
        backgroundColor: theme.palette.action.background,
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          padding: 2,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
      renderValue={() => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon
            variantName="happy_face"
            variant="text"
            color={theme.palette.text.secondary}
          />
          <Typography
            variant="body1"
            color={theme.palette.text.secondary}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {selectedAgent?.name || 'General'}
          </Typography>
        </Stack>
      )}
    >
      <MenuItem value="">General</MenuItem>
      {agents.map((agent) => (
        <MenuItem key={agent.id} value={agent.id}>
          {agent.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default AgentSelector;
