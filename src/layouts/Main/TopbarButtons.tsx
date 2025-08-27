/* eslint-disable react/jsx-no-useless-fragment */
import { useMobile } from 'fracttal-core';
import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import FracttalAI from 'layouts/FracttalAI/FracttalAI';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';

interface TopbarButtonsProps {
  showTonyBotButton?: boolean;
}

const TopbarButtons = React.memo<TopbarButtonsProps>(
  ({ showTonyBotButton = true }) => {
    const currentConversationID = useSelector(
      (state: any) => state.currentConversationID.id,
    );
    // const { t } = useTranslation();
    const isMobile = useMobile();
    const conversationID = React.useMemo(
      () => currentConversationID || uuidv4(),
      [currentConversationID],
    );
    const location = useLocation();
    const [openFracttalAI, setOpenFracttalAI] = useState(false);

    return (
      <>
        {showTonyBotButton && !isMobile && location.pathname !== '/ai' && (
          <FracttalAI
            agentType="GENERAL"
            open={openFracttalAI}
            handleOpenAI={setOpenFracttalAI}
            conversationID={conversationID}
            contextType="list"
          />
        )}
      </>
    );
  },
);

export default TopbarButtons;
