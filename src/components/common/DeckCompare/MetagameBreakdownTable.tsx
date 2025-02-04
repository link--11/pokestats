import {
  Box,
} from '@chakra-ui/react';
import { createContext, useCallback, useEffect } from 'react';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { NoDataDisplay } from '../../Deck/Analytics/MetaGameShare/NoDataDisplay';
import { ComponentLoader } from '../ComponentLoader';
import {
  DeckCompareColumnType,
  DeckCompareSortTogglesProps,
} from './DeckCompareSortToggles';
import { Icon, Flex, Title, Card, Text, Bold, Subtitle, BarList, TabGroup, TabList, Tab, Badge, Select, SelectItem, Color } from "@tremor/react";
import SpriteDisplay from '../SpriteDisplay/SpriteDisplay';
import { getDeckHref } from './helpers';
import { Tournament } from '../../../../types/tournament';
import { ChartPieIcon } from '@heroicons/react/outline';
import { trackEvent } from '../../../lib/track';

export interface MetagameBreakdownTableProps<T>
  extends DeckCompareSortTogglesProps<T> {
  slug?: string;
  decks: DeckTypeSchema[];
  shouldDrillDown: boolean;
  setShouldDrillDown: (shouldDrillDown: boolean) => void;
  isLoading: boolean;
  shouldHideDeck?: (deck: DeckTypeSchema) => boolean;
  isComparison?: boolean;
  tournament: Tournament,
  numKnown: number;
}

export const ShouldDrillDownMetaShareContext = createContext(false);

export const MetagameBreakdownTable = <T extends string>(
  props: MetagameBreakdownTableProps<T>
) => {
  const getValueDisplayLabel = useCallback((column: DeckCompareColumnType<T> | undefined) => {
    if (column?.name === 'played') {
      return 'Usage';
    }

    if (column?.name === 'day 2 played') {
      return 'Usage';
    }

    if (column?.name === 'day 2') {
      return 'Conversion rate';
    }

    return 'value';
  }, []);

  const activeColumn = props.columns.find((column) => column.name === props.sortBy);

  const data = props.decks
    .filter(
      deck => !(props.shouldHideDeck && props.shouldHideDeck(deck))
    ).map((deck) => ({
      name: deck.name,
      value: activeColumn ? Math.round(activeColumn.calculation(deck) * 10000) / 100 : 0,
      href: getDeckHref(deck).pathname,
      icon: () => <SpriteDisplay pokemonNames={deck.defined_pokemon} />,
      color: 'indigo' as Color
    })).sort((a, b) => {
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    });

    useEffect(() => {
      if (!props.isLoading && document) {
        document.querySelectorAll('.tremor-BarList-barLink').forEach((el) => {
          el.removeAttribute('target')
        })
      }
    }, [props.isLoading]);

  return (
    <Card>
      <Flex>
        <div>
          <Title>{`Metagame Breakdown`}</Title>
          <Subtitle>{props.tournament.name}</Subtitle>
        </div>
        <Icon icon={ChartPieIcon} color='neutral' variant="solid" size="sm" />
      </Flex>

      <Select className='mt-3' value={props.sortBy} onValueChange={(val) => {
        trackEvent('Metagame breakdown filter toggled', { value: val });
        props.setSort(val as T, 'desc');
      }}>
        <SelectItem value='played'>Day 1</SelectItem>
        <SelectItem value='day 2 played'>Day 2</SelectItem>
        <SelectItem value='day 2'>Day 2 Conversion</SelectItem>
      </Select>
      <Flex className="mt-4">
        <Text>
          <Bold>Deck</Bold>
        </Text>
        <Text>
          <Bold>{getValueDisplayLabel(activeColumn)}</Bold>
        </Text>
      </Flex>
      {props.isLoading ? (
        <Box height={'50rem'}>
          <ComponentLoader />
        </Box>
      ) : props.decks.length === 0 ? (
        <NoDataDisplay />
      ) : (
          <BarList data={data} className='mt-2 dark:[&>div>.tremor-BarList-bar]:bg-indigo-900 [&>div>.tremor-BarList-labelWrapper]:h-10 [&>div>.tremor-BarList-labelWrapper]:after:content-["%"] [&>div>div>div]:items-center [&>div>div>div]:gap-4 [&>div>.tremor-BarList-bar]:h-10' />
      )}
      <Subtitle className='mt-3'>{`Decks known: ${props.numKnown}/${props.tournament.players.masters}`}</Subtitle>
    </Card>
  );
};
