import { Badge, BadgeDelta, Flex } from "@tremor/react";
import { Tournament } from "../../../types/tournament";
import {
  MoonIcon,
  StatusOnlineIcon
} from "@heroicons/react/outline";
import { formatTournamentStatus } from "./helpers";
import { useUtcOffset } from "../../hooks/tournamentMetadata";

interface TournamentStatusBadgesProps {
  tournament: Tournament;
  hasVagueTime?: boolean;
}

export const TournamentStatusBadges = (props: TournamentStatusBadgesProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  return props.tournament.tournamentStatus === 'not-started' ? (
        <Badge className="dark:bg-purple-900 dark:text-purple-300" color='purple'>{props.hasVagueTime ? 'Upcoming' : formatTournamentStatus(props.tournament, utcOffset)}</Badge>
      ) : props.tournament.tournamentStatus === 'running' ? (
        <Badge size='xs' icon={StatusOnlineIcon}>Round {props.tournament.roundNumbers.masters}</Badge>
      ) : null
}