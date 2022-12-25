import {
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo, useEffect, useMemo, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { EditPlayerModal } from './EditPlayerModal';
import { isMobileDevice } from '../../../../../lib/userAgent';
import { PlayerNameLink } from '../../../../Player/PlayerNameLink';

export const Player = memo(
  ({
    name,
    profile,
    isEditable,
  }: {
    name: string;
    profile: { id: number; twitterHandle: string };
    isEditable: boolean;
  }) => {
    const {
      isOpen: isEditOpen,
      onOpen: openEdit,
      onClose: closeEdit,
    } = useDisclosure();

    return (
      <Stack direction={'row'} alignItems='center'>
        <PlayerNameLink name={name} twitterHandle={profile.twitterHandle} />
        {isEditable && (
          <IconButton
            aria-label='edit-player'
            variant={'ghost'}
            size='xs'
            onClick={openEdit}
          >
            <EditIcon />
          </IconButton>
        )}
        {isEditOpen && (
          <EditPlayerModal
            isOpen={isEditOpen}
            onClose={closeEdit}
            playerProfile={profile}
            name={name}
          />
        )}
      </Stack>
    );
  }
);

Player.displayName = 'Player';
