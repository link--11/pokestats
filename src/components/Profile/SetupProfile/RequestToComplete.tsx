import {
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  Fade,
  Flex,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaSkull } from 'react-icons/fa';
import {
  SessionUserProfile,
  useUserSentAccountRequest,
} from '../../../hooks/user';
import supabase from '../../../lib/supabase/client';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';

export const RequestToComplete = ({
  userProfile,
}: {
  userProfile: SessionUserProfile | undefined;
}) => {
  const [fadeIn, setFadeIn] = useState(false);
  const { data: userSentRequest } = useUserSentAccountRequest(
    userProfile?.email
  );
  const [requestSentStatus, setRequestSentStatus] =
    useState<'before' | 'sending' | 'sent' | 'sent-error'>('before');

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (userSentRequest) {
      setRequestSentStatus('sent');
    }
  }, [userSentRequest]);

  const handleSendRequest = async () => {
    setRequestSentStatus('sending');
    const { data, error } = await supabase.from('Account Requests').insert([
      {
        email: userProfile?.email,
        name: userProfile?.name,
      },
    ]);
    if (error) {
      setRequestSentStatus('sent-error');
    } else {
      setRequestSentStatus('sent');
    }
  };

  return (
    <Stack
      padding='1.5rem'
      spacing={10}
      justifyContent='space-between'
      height='100%'
    >
      <Heading color='gray.700'>Complete account setup</Heading>
      <Fade in={fadeIn}>
        <Stack>
          <Text as='b'>{`Make sure you're logged in with the Google account you use with RK9.`}</Text>
          <Text>{`The name on your Google account doesn't seem to match any players from RK9.`}</Text>
          <Flex flexWrap='wrap' gap={2} alignItems='baseline'>
            <Text>{`Once your request is approved, you'll see the badge next to your profile pic changed from`}</Text>
            <NotVerifiedIcon />
            <Text>to</Text>
            <VerifiedIcon />
          </Flex>
        </Stack>
      </Fade>
      <Fade in={fadeIn}>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Button
            colorScheme={'gray'}
            variant='solid'
            leftIcon={
              requestSentStatus === 'sent' ? (
                <FaCheck />
              ) : requestSentStatus === 'sent-error' ? (
                <FaSkull />
              ) : (
                <FaEnvelope />
              )
            }
            isLoading={requestSentStatus === 'sending'}
            loadingText='Send a request'
            isDisabled={
              requestSentStatus === 'sent' || requestSentStatus === 'sent-error'
            }
            onClick={handleSendRequest}
          >
            {requestSentStatus === 'sent'
              ? 'Request sent!'
              : requestSentStatus === 'sent-error'
              ? 'Something went wrong'
              : 'Send a request'}
          </Button>
        </Stack>
      </Fade>
    </Stack>
  );
};
