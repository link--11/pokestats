import { useQuery } from '@tanstack/react-query';
import { Pairing } from '../../types/pairings';
import supabase from '../lib/supabase/client';

export const fetchPairingSubmissions = async (tournamentId: string) => {
  const res = await supabase
    .from('Pairing Submissions')
    .select(
      `id,deck_archetype,player1_name,player2_name,user_who_submitted,table_number,round_number`
    )
    .eq('tournament_id', tournamentId);
  return res.data;
};

export const usePairingSubmissions = (tournamentId: string) => {
  return useQuery({
    queryKey: ['pairings'],
    queryFn: () => fetchPairingSubmissions(tournamentId),
  });
};

export interface FetchPairingsOptions {
  prefetch?: boolean;
  roundNumber?: number;
}

interface PairingsSchema {
  tables: Pairing[];
}

interface FetchPairingsSchema {
  round: number;
  tables?: Pairing[];
  maxRound: number;
}

export const fetchPairings = async (
  tournamentId: string,
  options?: FetchPairingsOptions
): Promise<PairingsSchema[]> => {
  const slug = `standings/${tournamentId}/masters/${tournamentId}_Masterstables.json`;
  const url = `${
    options?.prefetch ? 'https://pokedata.ovh' : '/pokedata'
  }/${slug}`;

  const res: Response = await fetch(url);
  const data: PairingsSchema[] = await res.json();

  return data;
};

export const usePairings = (
  tournamentId: string,
  options?: FetchPairingsOptions
) => {
  const query = useQuery({
    queryKey: ['pairings', tournamentId],
    queryFn: () => fetchPairings(tournamentId, options),
  });

  let data = query.data ?? [];
  let ret: FetchPairingsSchema;

  if (options?.roundNumber) {
    ret = {
      round: options.roundNumber,
      tables: data.at(options.roundNumber)?.tables,
      maxRound: data.length - 1,
    };
  } else {
    ret = {
      round: data.length - 1,
      tables: data.at(data.length - 1)?.tables,
      maxRound: data.length - 1,
    };
  }

  return {
    ...query,
    data: ret,
  };
};
