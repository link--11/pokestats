import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import supabase from '../lib/supabase/client';

export const fetchPinnedPlayers = async (user?: string | null) => {
  if (!user) return null;

  const res = await supabase
    .from('Pinned Players')
    .select('pinned_player_name')
    .eq('user_account', user);
  return res.data?.map(({ pinned_player_name }) => pinned_player_name);
};

export const usePinnedPlayers = () => {
  const session = useSession();
  const user = session.data?.user?.email;

  return useQuery({
    queryKey: ['pinned-players', user],
    queryFn: () => fetchPinnedPlayers(user),
  });
};
