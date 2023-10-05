import {
  Text,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { CombinedPlayerProfile } from '../../../types/player';
import { useUserMatchesLoggedInUser } from '../../hooks/user';
import { useUserIsAdmin } from '../../hooks/administrators';
import { Standing } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';
import { FullPageLoader } from '../common/FullPageLoader';
import { TournamentInfo } from '../TournamentList/TournamentInfo';
import { usePlayerStandings } from '../../hooks/newStandings';
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';
import { Card, Table, TableBody, TableRow } from '@tremor/react';

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile | null | undefined;
}) => {
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user?.name);
  const { data: tournamentPerformance, isLoading } = usePlayerStandings(user, { shouldLoadOpponentRounds: true });
  const { data: userIsAdmin } = useUserIsAdmin();

  if (isLoading) return <FullPageLoader />;

  return (
    <div className='flex flex-col gap-4 mt-4'>
      {userMatchesLoggedInUser &&
        (!tournamentPerformance || tournamentPerformance.length === 0) && (
          <Stack>
            <Text>{`We couldn't find any tournaments you've attended. We currently only support tournaments May 21, 2022 and onwards.`}</Text>
            <Text>{`If you've registered for an upcoming tournament, that tournament will show up once it has started.`}</Text>
          </Stack>
        )}
      {tournamentPerformance?.map((performance: Standing) => {
        if (!performance.tournament_id) return null;

        if (!performance.tournament) return null;

        if (performance.tournament.tournamentStatus === 'running') {
          return (
            <PlayerTournamentView
              tournament={performance.tournament}
              playerName={performance.name}
              key={`${performance.tournament_id}-${performance.name}`}
            />
          )
        }

        return (
          <Card key={`${performance.tournament_id}-${performance.name}`} className='px-6 py-4'>
            <TournamentInfo tournament={performance.tournament} />
            <Table>
              <TableBody>
                <PlayerCard
                  player={performance}
                  tournament={performance.tournament}
                  canEditDecks={userMatchesLoggedInUser || userIsAdmin}
                  isPlayerMeOrMyOpponent={false}
                />
              </TableBody>
            </Table>
          </Card>
        );
      })}
    </div>
  );
};
