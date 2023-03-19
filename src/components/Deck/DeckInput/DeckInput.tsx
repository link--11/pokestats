import { UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { memo, useEffect, useState } from 'react';
import { Deck } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import supabase from '../../../lib/supabase/client';
import ArchetypeSelector from './ArchetypeSelector/ArchetypeSelector';
import { handleDeckSubmit } from './helpers';

const DeckInput = memo(
  ({
    playerName,
    deck,
    tournamentId,
    archetypeModal,
    shouldShowAsText,
    shouldHideDeck,
    shouldHideVerifiedIcon,
    shouldEnableEdits,
  }: {
    playerName: string;
    deck: Deck | undefined;
    tournamentId: string;
    archetypeModal: UseDisclosureProps;
    shouldShowAsText?: boolean;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean;
    shouldEnableEdits: boolean;
  }) => {
    const deckId = deck?.id;

    const { data: userIsAdmin } = useUserIsAdmin();
    const session = useSession();
    const [selectedDeck, setSelectedDeck] = useState<Deck | undefined>(deck);
    const [isStreamDeck, setIsStreamDeck] = useState(deck?.on_stream);
    const toast = useToast();

    useEffect(() => {
      setSelectedDeck(deck);
    }, [deck]);

    const handleArchetypeSelect = async (newValue: Deck) => {
      handleDeckSubmit(
        newValue,
        deck,
        playerName,
        session.data?.user?.email,
        tournamentId,
        !!isStreamDeck,
        userIsAdmin,
        toast
      );
    };

    return (
      <ArchetypeSelector
        selectedArchetype={selectedDeck}
        onChange={handleArchetypeSelect}
        modalControls={archetypeModal}
        shouldShowAsText={shouldShowAsText}
        tournamentId={tournamentId}
        unownOverride={playerName === 'Isaiah Cheville' ? 'z' : undefined}
        userIsAdmin={userIsAdmin}
        deckIsVerified={deck?.verified}
        shouldHideDeck={shouldHideDeck}
        isStreamDeck={!!isStreamDeck}
        toggleIsStreamDeck={() => setIsStreamDeck(!isStreamDeck)}
        isListUp={!!deck?.list}
        shouldHideVerifiedIcon={shouldHideVerifiedIcon}
        shouldEnableEdits={shouldEnableEdits}
      />
    );
  }
);

DeckInput.displayName = 'DeckInput';

export default DeckInput;
