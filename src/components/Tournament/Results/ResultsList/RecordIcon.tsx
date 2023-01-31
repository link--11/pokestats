import { HStack, Icon } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import {
  FaBroadcastTower,
  FaChessBishop,
  FaChessKing,
  FaChessQueen,
  FaChessRook,
  FaRunning,
  FaTrash,
  FaTwitch,
  FaUserAltSlash,
} from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';

export const RecordIcon = ({
  standing,
  tournament,
}: {
  standing: Standing;
  tournament: Tournament;
}) => {
  const commonIconProps = useMemo(
    () => ({
      marginRight: '8px',
    }),
    []
  );

  const getCrownIcon = useCallback(() => {
    if (!tournament.topCutStatus) return null;

    const topCutComparator = {
      top8: 0,
      top4: 1,
      finals: 2,
    };

    if (standing.placing === 1 && tournament.tournamentStatus === 'finished') {
      return <Icon {...commonIconProps} as={FaChessKing} color='yellow.500' />;
    }

    if (
      standing.placing === 2 &&
      topCutComparator[tournament.topCutStatus] >= 2
    ) {
      return <Icon {...commonIconProps} as={FaChessQueen} color='gray.400' />;
    }

    if (
      standing.placing <= 4 &&
      topCutComparator[tournament.topCutStatus] >= 1
    ) {
      return <Icon {...commonIconProps} as={FaChessRook} color='yellow.600' />;
    }

    if (
      standing.placing <= 8 &&
      topCutComparator[tournament.topCutStatus] >= 0
    ) {
      return (
        <Icon {...commonIconProps} as={FaChessBishop} color='yellow.600' />
      );
    }

    return null;
  }, [tournament, standing.placing, commonIconProps]);

  const getIcon = useCallback(() => {
    const showTrashIcon = standing.name === 'Noah Spinale';

    if (getCrownIcon()) {
      return getCrownIcon();
    }

    if (standing.drop) {
      if (standing.placing === 9999) {
        return (
          <Icon {...commonIconProps} color='red.600' as={FaUserAltSlash} />
        );
      }

      if (showTrashIcon) {
        return <Icon {...commonIconProps} color='red.600' as={FaTrash} />;
      }

      return <Icon {...commonIconProps} color='red.600' as={FaRunning} />;
    }

    // if (madeDayTwo(standing.record)) {
    //   return (
    //     <Icon
    //       {...commonIconProps}
    //       color='gray.400'
    //       boxSize={3}
    //       as={FaHandPeace}
    //     />
    //   );
    // }

    return null;
  }, [commonIconProps, getCrownIcon, standing]);

  if (standing.deck?.on_stream && !getCrownIcon()) {
    return (
      <HStack spacing={1} paddingRight={2}>
        <Icon color='purple' as={FaBroadcastTower} />
        {getIcon()}
      </HStack>
    );
  }

  return getIcon();
};
