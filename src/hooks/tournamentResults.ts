import { useQuery } from '@tanstack/react-query';
import { fetchLiveResults } from '../lib/fetch/fetchLiveResults';
import { getResultQueryKey } from '../lib/fetch/query-keys';
import supabase from '../lib/supabase/client';

export const useTournamentResults = (tournamentName: string) => {
  const fetchResults = async () => {
    const res = await supabase
      .from('Tournament Results')
      .select('*')
      .eq('tournament_name', tournamentName);
    return res.data;
  };

  return useQuery({
    queryKey: [getResultQueryKey(tournamentName)],
    queryFn: fetchResults,
  });
};

export const useLiveTournamentResults = (tournamentId: string) => {
  return useQuery({
    queryKey: [`live-results-${tournamentId}`],
    queryFn: () => fetchLiveResults(tournamentId),
  });
};
