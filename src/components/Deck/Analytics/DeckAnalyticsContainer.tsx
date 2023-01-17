import { Stack, StackItem } from '@chakra-ui/react';
import { Deck } from '../../../../types/tournament';
import { BackToDecksButton } from './BackToDecksButton';
import { DeckHeader } from './DeckHeader';

export const DeckAnalyticsContainer = ({
  children,
  deck,
  compactTitle,
}: {
  children: JSX.Element;
  deck: Deck;
  compactTitle?: boolean;
}) => (
  <Stack>
    <StackItem padding={4} paddingBottom={0}>
      {!compactTitle && <BackToDecksButton />}
    </StackItem>
    <DeckHeader deck={deck} compact={compactTitle} />
    <Stack paddingX={4}>{children}</Stack>
  </Stack>
);
