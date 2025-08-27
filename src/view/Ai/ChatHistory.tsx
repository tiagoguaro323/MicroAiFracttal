/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Collapse,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Menu,
  Skeleton,
} from '@mui/material';
import { ButtonIcon, Checkbox } from 'designSystem';
import moment from 'moment';
import { TransitionGroup } from 'react-transition-group';
import 'moment/locale/es';
import { useMobile } from 'fracttal-core';
import useRequestAI from 'hooks/FracttalAI/useRequestAI';

moment.locale('es');

interface IProps {
  previewConversations: any[];
  updateHistoryChat: (value: any) => void;
  setShowSidebar: (value: boolean) => void;
  setSelectedItems: any;
  selectedItems: string[];
  isMultiSelectMode: boolean;
}

const ChatHistory: FC<IProps> = ({
  previewConversations = [],
  updateHistoryChat,
  setShowSidebar,
  setSelectedItems,
  selectedItems = [],
  isMultiSelectMode = false,
}) => {
  const theme = useTheme();
  const isMobile = useMobile();
  const [localConversations, setLocalConversations] =
    useState(previewConversations);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { exec: deleteConversation } = useRequestAI({
    endpoint: 'conversation/',
    method: 'DELETE',
  });

  useEffect(() => {
    if (!isMultiSelectMode) {
      setSelectedItems([]);
    }
  }, [isMultiSelectMode]);

  useEffect(() => {
    setLocalConversations(previewConversations);
  }, [previewConversations]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    event.stopPropagation(); // evita que se dispare el click del ListItem
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteConversation({
        query: { conversation_id: selectedItem.conversation_id },
      });
      setLocalConversations((prev) =>
        prev.filter(
          (item) => item.conversation_id !== selectedItem.conversation_id,
        ),
      );
    } finally {
      handleMenuClose();
    }
  };

  useEffect(() => {
    if (previewConversations.length === 0) return;

    setLocalConversations((prev) => {
      const existingIds = new Set(
        Array.isArray(prev) ? prev.map((item) => item.id) : [],
      );
      // const existingIds = new Set(prev?.map((item) => item.id));
      const newItems = previewConversations.filter(
        (item) => !existingIds.has(item.id),
      );
      if (newItems.length === 0) return prev;

      return [...newItems, ...prev];
    });
  }, [previewConversations]);

  const groupedByDays = useMemo(() => {
    const now = moment();
    const groups: Record<string, { label: string; items: any[] }> = {};

    localConversations.forEach((item) => {
      const createdAt = moment(item.created_at);
      const diffDays = now.diff(createdAt, 'days');

      const groupKey = diffDays > 1 ? `${diffDays}` : 'reciente';
      const label = diffDays > 1 ? `Hace ${diffDays} días` : 'Reciente';

      if (!groups[groupKey]) {
        groups[groupKey] = { label, items: [] };
      }

      groups[groupKey].items.push(item);
    });

    Object.values(groups).forEach((group) => {
      group.items.sort(
        (a, b) =>
          moment(b.created_at).valueOf() - moment(a.created_at).valueOf(),
      );
    });

    return Object.entries(groups)
      .sort(([a], [b]) => {
        if (a === 'reciente') return -1;
        if (b === 'reciente') return 1;
        return Number(a) - Number(b);
      })
      .map(([, value]) => value);
  }, [localConversations]);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* <ListItem button onClick={() => { handleMenuClose(); }}>
          <ListItemText primary="Renombrar" />
        </ListItem> */}

        <ListItem button onClick={handleDelete}>
          <ListItemText primary="Eliminar" />
        </ListItem>
      </Menu>

      <Box
        sx={{
          width: '100%',
          maxHeight: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 170px)',
          overflowY: 'auto',
          fontFamily: (theme) => (theme.typography as any).manrope,
        }}
      >
        {localConversations.length === 0 ? (
          <Box mt={4}>
            {Array.from({ length: 13 }).map((_, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={idx} sx={{ mb: 1, mt: 1.5 }}>
                <Skeleton
                  variant="rectangular"
                  height={48}
                  animation="pulse"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          groupedByDays.map((group) => (
            <Box key={group.label} mb={3}>
              <Typography
                variant="subtitle2"
                align="left"
                color={theme.palette.text.primary}
                sx={{ mb: 1.5, ml: 1, mt: 1.5 }}
              >
                {group.label}
              </Typography>

              <List sx={{ padding: 0 }}>
                <TransitionGroup component={null}>
                  {group.items.map((item, idx) => {
                    const content =
                      item.message?.data?.content || '(Sin contenido)';
                    return (
                      <Collapse key={item.id} timeout={300}>
                        <Box component="li" sx={{ listStyle: 'none' }}>
                          <ListItem
                            onClick={() => {
                              if (isMultiSelectMode) {
                                const alreadySelected = selectedItems.includes(
                                  item.conversation_id,
                                );
                                const newSelectedItems = alreadySelected
                                  ? selectedItems.filter(
                                      (id) => id !== item.conversation_id,
                                    )
                                  : [...selectedItems, item.conversation_id];
                                setSelectedItems(newSelectedItems);
                              } else {
                                updateHistoryChat(item.conversation_id);
                                if (isMobile) setShowSidebar(false);
                              }
                            }}
                            sx={{
                              bgcolor: theme.palette.action.background,
                              borderRadius: 4,
                              px: 2,
                              py: 1,
                              mt: idx !== 0 ? 1 : 0,
                              height: 48,
                              '&:hover': {
                                background:
                                  theme.palette.ai.backgroundSecondary,
                                cursor: 'pointer',
                                color: theme.palette.text.primary,
                                fontWeight: 400,
                              },
                            }}
                            secondaryAction={
                              !isMultiSelectMode ? (
                                <ButtonIcon
                                  icon="ellipsis_vertical"
                                  variant="text"
                                  iconColor={theme.palette.text.secondary}
                                  sx={{
                                    backgroundColor: 'transparent',
                                    marginLeft: 1,
                                  }}
                                  onClick={(e) => handleMenuOpen(e, item)}
                                />
                              ) : (
                                <Checkbox
                                  onClick={(e) => e.stopPropagation()}
                                  checked={selectedItems.includes(
                                    item.conversation_id,
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newSelectedItems = e.target.checked
                                      ? [...selectedItems, item.conversation_id]
                                      : selectedItems.filter(
                                          (id) => id !== item.conversation_id,
                                        );
                                    setSelectedItems(newSelectedItems);
                                  }}
                                />
                              )
                            }
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  color={theme.palette.text.secondary}
                                  noWrap
                                  sx={{
                                    fontFamily: (theme) =>
                                      (theme.typography as any).manrope,
                                    paddingRight: 6,
                                  }}
                                >
                                  {content}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Box>
                      </Collapse>
                    );
                  })}
                </TransitionGroup>
              </List>
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

export default ChatHistory;
