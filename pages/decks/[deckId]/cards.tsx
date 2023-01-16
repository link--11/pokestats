import { DeckAnalyticsContainer } from '../../../src/components/Deck/Analytics/DeckAnalyticsContainer';
import { fetchArchetype } from '../../../src/hooks/deckArchetypes';
import { fetchUniqueDecks } from '../../../src/hooks/finalResults';
import { Deck } from '../../../types/tournament';

export default function CardsInDeckPage({ deck }: { deck: Deck }) {
  return (
    <DeckAnalyticsContainer deck={deck} compactTitle>
      <div>hi</div>
    </DeckAnalyticsContainer>
  );
}

export async function getStaticProps({
  params,
}: {
  params: {
    deckId: number;
  };
}) {
  const deck = await fetchArchetype(params.deckId);

  return {
    props: {
      deck,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const decks = await fetchUniqueDecks();

  return {
    paths: decks.map(({ deck_archetype }) => ({
      params: {
        deckId: deck_archetype,
      },
    })),
    fallback: 'blocking',
  };
}
