import {
  Card,
  Grid,
  GridItem,
  HStack,
  Image,
  StackItem,
  Stat,
  StatNumber,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { Deck } from '../../../../../types/tournament';
import { useCardCounts } from '../../../../hooks/finalResults';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { SingleCardCountDisplay } from './SingleCardCountDisplay';

export const CardCounts = ({ deck }: { deck: Deck }) => {
  const cardCounts = useCardCounts(deck);
  // This is assuming each archetype unanimously runs a card.
  // If this isn't the case, you need to redefine what the archetype is.
  const numberOfDecks = cardCounts[0]?.count;

  // The maximum number of deck instances a card can be in before it stops being a tech
  const techCardDeckInstanceMax = 3;

  return (
    <Grid gridTemplateColumns={'repeat(4, 1fr)'}>
      {cardCounts.map(({ card, count }, idx) => {
        const isInGroup =
          (count === numberOfDecks || count <= techCardDeckInstanceMax) &&
          (cardCounts.at(idx + 1)?.count === count ||
            cardCounts.at(idx - 1)?.count === count);
        const firstInGroup =
          (count === numberOfDecks || count <= techCardDeckInstanceMax) &&
          cardCounts.at(idx + 1)?.count === count &&
          cardCounts.at(idx - 1)?.count !== count;

        if (firstInGroup) {
          return (
            <Fragment key={`${card.name}-${card.set}`}>
              <StackItem gridColumn={'1/-1'} paddingY={4}>
                <Stat>
                  <StatNumber>
                    {count > techCardDeckInstanceMax
                      ? `${fixPercentage(
                          (count * 100) / numberOfDecks
                        )}% of decks ran`
                      : `${count} ${count > 1 ? 'decks' : 'deck'} ran`}
                  </StatNumber>
                </Stat>
              </StackItem>
              <SingleCardCountDisplay
                card={card}
                count={count}
                numberOfDecks={numberOfDecks}
                hideStat
              />
            </Fragment>
          );
        }

        const firstInGroupWithNoStat =
          cardCounts.at(idx - 1)?.count === numberOfDecks &&
          cardCounts.at(idx - 1)?.count !== count;

        if (firstInGroupWithNoStat) {
          return (
            <Fragment key={`${card.name}-${card.set}`}>
              <GridItem gridColumn={'1/-1'} paddingY={4} />
              <SingleCardCountDisplay
                card={card}
                count={count}
                numberOfDecks={numberOfDecks}
                hideStat={isInGroup}
              />
            </Fragment>
          );
        }

        return (
          <SingleCardCountDisplay
            key={`${card.name}-${card.set}`}
            card={card}
            count={count}
            numberOfDecks={numberOfDecks}
            hideStat={isInGroup}
          />
        );
      })}
    </Grid>
  );
};
