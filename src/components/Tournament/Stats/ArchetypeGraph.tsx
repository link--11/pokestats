import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
  Cell,
} from 'recharts';
import { useDay2Decks } from '../../../hooks/day2decks';
import { getArchetypeGraphData, getArchetypeKey } from './helpers';
import { useLowResImageUrls } from '../../../hooks/images';
import { DeckArchetype, Tournament } from '../../../../types/tournament';
import { FastAverageColor } from 'fast-average-color';
import { useEffect, useState } from 'react';
import { SpriteLabel } from './SpriteLabel';

const fac = new FastAverageColor();

export const ArchetypeGraph = ({
  tournament,
  shouldDrillDown,
  shouldShowUnreported,
}: {
  tournament: Tournament;
  shouldDrillDown: boolean;
  shouldShowUnreported: boolean;
}) => {
  const { data } = useDay2Decks(tournament.id);
  const dataFlatList =
    data?.reduce(
      (acc: string[], deck: DeckArchetype) => [
        ...acc,
        ...(deck.defined_pokemon ?? []),
      ],
      []
    ) ?? [];
  const imageUrls = useLowResImageUrls(dataFlatList);
  const [averageColors, setAverageColors] = useState({});

  useEffect(() => {
    const getAverageColors = async () => {
      for (const [deckName, url] of Object.entries(imageUrls)) {
        const img = document.querySelector(`#sprite-${deckName}`);
        console.log(img);
      }
    };
    getAverageColors();
  }, []);

  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <PieChart>
        <Pie
          dataKey='value'
          data={getArchetypeGraphData(
            data,
            shouldDrillDown,
            shouldShowUnreported
          )}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={props => (
            <SpriteLabel
              {...props}
              data={data}
              imageUrls={imageUrls}
              shouldDrillDown={shouldDrillDown}
            />
          )}
          outerRadius={'100%'}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={'red'} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
