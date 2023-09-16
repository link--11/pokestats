import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { createContext, useState } from 'react';
import { FaChess, FaChessRook } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { NoDataDisplay } from '../../Deck/Analytics/MetaGameShare/NoDataDisplay';
import { CommonCard } from '../CommonCard';
import { ComponentLoader } from '../ComponentLoader';
import {
  DeckCompareSortToggles,
  DeckCompareSortTogglesProps,
} from './DeckCompareSortToggles';
import { IndividualShareCard } from './IndividualShareCard';
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, TableFoot, TableFooterCell, Title, Card, Text, Bold, Subtitle  } from "@tremor/react";
import SpriteDisplay from '../SpriteDisplay/SpriteDisplay';

export interface DeckCompareTableProps<T>
  extends DeckCompareSortTogglesProps<T> {
  header: string;
  subheader: string;
  slug?: string;
  decks: DeckTypeSchema[];
  shouldDrillDown: boolean;
  setShouldDrillDown: (shouldDrillDown: boolean) => void;
  isLoading: boolean;
  format: number;
  shouldHideDeck?: (deck: DeckTypeSchema) => boolean;
  isComparison?: boolean;
}

export const ShouldDrillDownMetaShareContext = createContext(false);

export const DeckCompareTable = <T extends string>(
  props: DeckCompareTableProps<T>
) => {
  const [shouldHideLabels] = useState(true);

  console.log(props.columns)

  return (
    <ShouldDrillDownMetaShareContext.Provider value={props.shouldDrillDown}>
      <Card>
        <Title>{props.header}</Title>
        <Subtitle>{props.subheader}</Subtitle>
        <Stack>
          {props.isLoading ? (
            <Box height={'50rem'}>
              <ComponentLoader />
            </Box>
          ) : props.decks.length === 0 ? (
            <NoDataDisplay />
          ) : (
              <Table>
                <TableHead>
                  <TableRow>
                      <TableHeaderCell>Deck Archetype</TableHeaderCell>
                      <TableHeaderCell>Day 1 Meta Share</TableHeaderCell>
                      <TableHeaderCell>Day 2 Conversion Rate</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {props.decks
                  .filter(
                    deck => !(props.shouldHideDeck && props.shouldHideDeck(deck))
                  )
                  .map(deck => (
                    <TableRow key={`${deck.name}${deck.id}`}>
                      <TableCell className='flex gap-4 items-center'>
                        <SpriteDisplay pokemonNames={deck.defined_pokemon} />
                        <Bold>{deck.name}</Bold>
                      </TableCell>
                      {props.columns.map((column) => (
                        <TableCell key={column.name + deck.id}>
                          {`${(column.calculation(deck, props.decks) * 100).toFixed(2)}%`}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                  // .map(deck => {
                  //   return (
                  //     deck?.id && (
                  //       <IndividualShareCard
                  //         key={`${deck.name}${deck.id}`}
                  //         decks={props.decks}
                  //         deck={deck}
                  //         columns={props.columns}
                  //         sortBy={props.sortBy}
                  //         format={props.format}
                  //         isComparison={props.isComparison}
                  //         shouldHideLabels={shouldHideLabels}
                  //       />
                  //     )
                  //   )
                  // })
                  }
                </TableBody>
              </Table>
          )}
        </Stack>
      </Card>
    </ShouldDrillDownMetaShareContext.Provider>
  );
};
